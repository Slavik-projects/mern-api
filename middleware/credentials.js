const allowedOrigins = [
	//'http://127.0.0.1:5500',
	//'http://localhost:3000',
	'https://technotes-2d67.onrender.com/'
];

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if(allowedOrigins.includes(origin)){
		res.header('Access-Control-Allow-Credentials', true)
	}
   next();
};

module.exports = credentials;