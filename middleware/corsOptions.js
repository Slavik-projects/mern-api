const allowedOrigins = [
	//'http://127.0.0.1:5500',
	//'http://localhost:3000',
	'https://technotes-2d67.onrender.com/'
];

const corsOptions = {
   origin: (origin, callback) => {
      if(allowedOrigins.includes(origin) !== -1 || !origin){
         callback(null, true)
		}else{
			callback(new Error('Not allowed by CORS'))
		}
	},credentials: true,
	optionsSuccessStatus: 200
}

module.exports = corsOptions;