const Student = require('../model/Student');

const handleLogout = async (req, res) => {

   const cookies = req.cookies;
	if(!cookies?.jwt) return res.sendStatus(204);//No content

	const refreshToken = cookies.jwt;

	const foundUser = await Student.findOne({ refreshToken }).exec();

	if(!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}
   
	//delete token in DB
	foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);

	const result = await foundUser.save();
   
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 })
	res.sendStatus(204)
}

module.exports = { handleLogout }