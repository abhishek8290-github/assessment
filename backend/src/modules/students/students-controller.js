
const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent, deleteStudent } = require("./students-service");
const { validateNewStudent, validateUpdateStudent } = require('./student-validator');


const handleGetAllStudents = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, name, class: className, section } = req.query;

    const payload = {
        page: +page,
        limit: +limit,
        name,
        className,
        section,
    };

    const students = await getAllStudents(payload);
    res.json(students);
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    validateNewStudent(payload);
    const message = await addNewStudent(payload);
    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const payload = req.body;
    validateUpdateStudent(payload)
    const message = await updateStudent({
        ...payload,

    });
    res.json(message);

});


const handleGetStudentDetail = asyncHandler(async (req, res) => {

    const { id: studentId } = req.params;
    const student = await getStudentDetail(studentId);
    return res.json(student);

});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const { reviewerId, status } = req.params;

    const message = await setStudentStatus({ userId, reviewerId, status });
    res.json(message);

});
const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const message = await deleteStudent(userId);
    res.json(message);

});


module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent
};
