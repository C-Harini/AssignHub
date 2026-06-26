const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// GET /api/dashboard/admin
async function adminStats(req, res) {
  try {
    const now = new Date();
    const [total, approved, pending, rejected, assignments, submissions, lateCount] =
      await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'student', status: 'approved' }),
        User.countDocuments({ role: 'student', status: 'pending' }),
        User.countDocuments({ role: 'student', status: 'rejected' }),
        Assignment.countDocuments(),
        Submission.countDocuments(),
        Submission.countDocuments({ late: true }),
      ]);

    const totalPossible = approved * assignments;
    const completion = totalPossible > 0 ? Math.round((submissions / totalPossible) * 100) : 0;

    const recentRegistrations = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email rollNumber status createdAt');

    const recentSubmissions = await Submission.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate('student', 'name rollNumber')
      .populate('assignment', 'title');

    const upcoming = await Assignment.find({ deadline: { $gte: now } })
      .sort({ deadline: 1 })
      .limit(5);

    res.json({
      cards: {
        totalStudents: total,
        approvedStudents: approved,
        pendingStudents: pending,
        rejectedStudents: rejected,
        assignments,
        submissions,
        lateSubmissions: lateCount,
        completion,
      },
      charts: {
        submissionStatus: [
          { name: 'Submitted', value: submissions },
          { name: 'Late', value: lateCount },
          { name: 'Pending', value: Math.max(0, totalPossible - submissions) },
        ],
      },
      recentRegistrations: recentRegistrations.map((u) => u.toSafeJSON()),
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s._id.toString(),
        submittedAt: s.submittedAt,
        late: s.late,
        student: s.student ? { name: s.student.name, rollNumber: s.student.rollNumber } : null,
        assignment: s.assignment ? { title: s.assignment.title } : null,
      })),
      upcomingDeadlines: upcoming.map((a) => a.toJSONSafe()),
    });
  } catch (err) {
    console.error('[adminStats]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/dashboard/student
async function studentStats(req, res) {
  try {
    const now = new Date();
    const [assignments, mySubs] = await Promise.all([
      Assignment.find().sort({ deadline: 1 }),
      Submission.find({ student: req.user._id }).populate('assignment'),
    ]);
    const submittedIds = new Set(mySubs.map((s) => s.assignment?._id?.toString()));
    const completed = mySubs.length;
    let pending = 0;
    let missed = 0;
    for (const a of assignments) {
      if (submittedIds.has(a._id.toString())) continue;
      if (new Date(a.deadline) < now) missed += 1;
      else pending += 1;
    }
    const upcoming = assignments
      .filter((a) => new Date(a.deadline) >= now && !submittedIds.has(a._id.toString()))
      .slice(0, 5)
      .map((a) => a.toJSONSafe());

    const recentSubmissions = mySubs
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5)
      .map((s) => ({
        ...s.toJSONSafe(),
        assignmentTitle: s.assignment?.title,
      }));

    res.json({
      cards: {
        totalAssignments: assignments.length,
        completed,
        pending,
        missed,
      },
      upcomingDeadlines: upcoming,
      recentSubmissions,
    });
  } catch (err) {
    console.error('[studentStats]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { adminStats, studentStats };
