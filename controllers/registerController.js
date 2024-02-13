const Student = require('../model/Student');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
   const { user, pwd, roles } = req.body;
	if(!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

	const duplicate = await Student.findOne({ username: user }).exec();
	if(duplicate) return res.sendStatus(409);

	try{
      const hashedPwd = await bcrypt.hash(pwd , 10);
		const result = await Student.create ({
			"username": user,
			//"roles": {"User": 2001},
			"roles": {"User": 1925, "Editor": 1985,"Admin":1923},//change this parameters for register user with other roles
			"password": hashedPwd
		});
		console.log(result)
		res.status(201).json({ 'success': `New user ${user} created!` })
	}catch (err) {
      res.status(500).json({ 'message': err.message })
	}
}

module.exports = { handleNewUser }