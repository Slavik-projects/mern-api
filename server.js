const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const corsOptions = require('./middleware/corsOptions')
const PORT = process.env.PORT || 4000;
//const verifyJWT = require('./middleware/verifyJWT');
const mongoose = require('mongoose');
const dbConn = require('./middleware/dbConnection');
const path = require("path");

dbConn();

app.use(cors(corsOptions));
app.use(credentials);
//app.use(corsOptions)

app.use(express.json());

app.use(express.urlencoded({ extended: false }));



app.use('/refresh', require('./routes/refresh'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));

//app.use(verifyJWT);

//FILE SERVING
const bodyParser = require('body-parser');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const Photo = require('./model/Photo');
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('views'));
//here app.use on '/getImage' for folder with files
app.use(express.static("photos"));


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'photos')//change folder to path to FRONTEND folder
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
	}
});

const upload = multer({
	storage: storage
});


app.post('/upload', upload.single('file'), (req, res) => {
	console.log('UPLOAD EVENT!!!')
	//ADD STUDENT TO DB
	Photo.create({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		image: req.file.filename
	})
	.then(result => res.json(result))
	.catch(err => console.log(err))
});

app.get('/getStudent', (req, res) => {
   Photo.find()
	.then(img => res.json(img))
	.catch(err => res.json(err));
	console.log('GET STUDENT WORK!!!')
});

///Delete student by name and surname
app.post('/deleteStudent',  (req, res) =>{
	console.log('DELETE METHOD WORK');
	console.log(req.body.firstname);
	console.log(req.body.lastname);
	deleteStudent(req, res);
})


const deleteStudent = async (req, res) => {
   if(!req.body?.firstname || !req?.body?.lastname) return res.status(400).json({ 'message': 'Last and firstname are required' });

	const student = await Photo.findOne({ firstname: req.body.firstname, lastname: req.body.lastname }).exec();
	if(!student) return res.status(204).json({ "message": 'No student matches required with this dates'});
	const result = student.deleteOne({ firstname: req.body.firstname, lastname: req.body.lastname }).exec();
	res.json(student)
	console.log(result)
}



//END FILE SERVE



app.get('/', (req, res) => {
	//console.log(req, res)
	//res.sendFile(path.join(__dirname+'/index.html'));
	res.json({ message: "Hello from server!" })
	//res.json({names})
});


app.use(cookieParser());

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}.`))
})



