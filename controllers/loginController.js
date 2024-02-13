const Student = require('../model/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
   
	const cookies = req.cookies;
	const { user, pwd } = req.body;

	if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });
	const foundUser = await Student.findOne({ username: user }).exec();
	if(!foundUser) return res.sendStatus(401);//Unauthorized

	const match = await bcrypt.compare(pwd, foundUser.password);

	if(match) {
      
		const roles = Object.values(foundUser.roles);

		const accessToken = jwt.sign(
			{
				"UserInfo":{
					"username": foundUser.username,
					"roles": roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '600s' }
		);
		

		const newRefreshToken = jwt.sign(
			{"username": foundUser.username},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		const newRefreshTokenArray = 
		   !cookies?.jwt
			   ? foundUser.refreshToken
				: foundUser.refreshToken.filter( rt => rt !== cookies.jwt);

		if(cookies?.jwt) res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None'});

		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

		const result = await foundUser.save();
		//console.log(result)

		res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24*60*60*1000 });

		res.json({ accessToken, roles })

	}else {
		res.sendStatus(401)
	}
}

module.exports = { handleLogin }