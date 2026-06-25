const User = require('../models/User');

// GET /api/students  (admin) - all students
async function listStudents(req, res) {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    return res.json({ students: students.map(s => s.toSafeJSON()) });
  } catch (err) {
    console.error('[listStudents]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/students/pending  (admin)
async function listPending(req, res) {
  try {
    const students = await User.find({ role: 'student', status: 'pending' }).sort({ createdAt: -1 });
    return res.json({ students: students.map(s => s.toSafeJSON()) });
  } catch (err) {
    console.error('[listPending]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function setStatus(req, res, status) {
  try {
    const { id } = req.params;
    const student = await User.findOne({ _id: id, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    student.status = status;
    await student.save();
    return res.json({ student: student.toSafeJSON() });
  } catch (err) {
    console.error('[setStatus]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/students/:id/approve
const approveStudent = (req, res) => setStatus(req, res, 'approved');
// PUT /api/students/:id/reject
const rejectStudent = (req, res) => setStatus(req, res, 'rejected');

module.exports = { listStudents, listPending, approveStudent, rejectStudent };
