const Student = require('../model/Student');
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {
   const cookies = req.cookies;
	if(!cookies?.jwt) return sendStatus(401)
	const refreshToken = cookies.jwt;
	res.clearCookie('jwt', { httpOnly: true, maxAge: 60*24*24*1000, secure: true, sameSite: 'None' });

	const foundUser = await Student.findOne({ refreshToken }).exec();

	if(!foundUser) {
		{
			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				async (err, decoded) => {
					if(err) return sendStatus(403)
					const hackedUser = await Student.findOne({ username: decoded.username }).exec();
					hackedUser.refreshToken = [];
					const result = hackedUser.save()
					console.log(result);
				}
			)
		}
		return res.sendStatus(403)
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(rt !== refreshToken);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if(err) {
				console.log('expired refresh token')
				foundUser.refreshToken = [...newRefreshTokenArray];
				const result = await foundUser.save();
				console.log(result)
			}

			if(err || foundUser.username !== decoded.username) return sendStatus(403)


			//Refresh Token still valid
			const roles = Object.values(foundUser.roles);
			const accessToken = jwt.sign(
				{
               "UserInfo":{
						"username": decoded.username,
						"roles": roles
					}
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '1200s' }
			);

			const newRefreshToken = jwt.sign(
				{ "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '1d' }
			);


			foundUser.refreshToken = [...newRefreshToken, newRefreshToken];

			const result = await foundUser.save();

			res.cookie('jwt', { httpOnly: true, secure: true, maxAge: 24*60*1000*60, sameSite: 'None' })

			res.json({ roles, accessToken })


		}
	)
}

module.exports = { handleRefreshToken };