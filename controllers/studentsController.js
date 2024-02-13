const Employee = require('../model/Employee');

const createNewStudent = async (req, res) => {

   if(!req?.body?.firstname || !req?.body?.lastname) return res.status(400).json({ 'message': 'Firstname and lastname are required'});

	try{
      const result = await Employee.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname
		});

		res.status(201).json(result)
	} catch(err) {
		console.error(err)
	}

}

const getFilteredStudents = async (req, res) => {
   const students = await Employee.find();
	if(!students) return res.status(204).json({ 'message': 'No students found'});
	res.json(students)
}

const deleteStudent = async (req, res) => {
   if(!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required'});

	const student = await Employee.findOne({ _id: req.body.id }).exec();

	if(!student) return res.status(204).json({ "message": `No student matches ID ${req.params.id} not found`});
	const result = student.deleteOne({ _id: req.body.id });
	res.json(result)
}

module.exports = { createNewStudent, getFilteredStudents, deleteStudent }

