const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
   const authHeader = req.headers.authorization || req.headers.Authorization;
	const token = authHeader.split(' ')[1];

	if(!authHeader?.startsWith('Bearer')) return res.sendStatus(401)

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(err, decoded) => {
			if(err) return res.sendStatus(401)
			req.user = decoded.UserInfo.username;
			req.roles = decoded.UserInfo.roles;
			next();
		}
	)
}

module.exports = verifyJWT;