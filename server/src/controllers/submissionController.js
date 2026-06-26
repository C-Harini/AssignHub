const path = require('path');
const fs = require('fs');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');

// POST /api/submissions/:assignmentId  (student, multipart)
async function submitWork(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      // cleanup orphan upload
      try { fs.unlinkSync(req.file.path); } catch (_) {}
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const now = new Date();
    const late = now > new Date(assignment.deadline);
    const remarks = (req.body && req.body.remarks) || '';

    // Replace existing submission, if any (only allowed before deadline)
    const existing = await Submission.findOne({
      assignment: assignment._id,
      student: req.user._id,
    });

    if (existing) {
      if (now > new Date(assignment.deadline)) {
        try { fs.unlinkSync(req.file.path); } catch (_) {}
        return res.status(403).json({ message: 'Deadline passed — cannot replace submission' });
      }
      // remove old file
      const oldFile = path.join(__dirname, '..', '..', 'uploads', existing.filePath);
      try { fs.unlinkSync(oldFile); } catch (_) {}
      existing.filePath = req.file.filename;
      existing.fileName = req.file.originalname;
      existing.fileSize = req.file.size;
      existing.mimeType = req.file.mimetype;
      existing.remarks = remarks;
      existing.submittedAt = now;
      existing.late = false;
      await existing.save();
      return res.json({ submission: existing.toJSONSafe() });
    }

    const sub = await Submission.create({
      assignment: assignment._id,
      student: req.user._id,
      filePath: req.file.filename,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      remarks,
      submittedAt: now,
      late,
    });
    res.status(201).json({ submission: sub.toJSONSafe() });
  } catch (err) {
    console.error('[submitWork]', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}

// GET /api/submissions/mine  (student)
async function listMySubmissions(req, res) {
  try {
    const subs = await Submission.find({ student: req.user._id })
      .populate('assignment')
      .sort({ submittedAt: -1 });
    res.json({
      submissions: subs.map((s) => ({
        ...s.toJSONSafe(),
        assignmentTitle: s.assignment?.title,
        deadline: s.assignment?.deadline,
      })),
    });
  } catch (err) {
    console.error('[listMySubmissions]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/submissions  (admin)
async function listAllSubmissions(req, res) {
  try {
    const { search = '', status, page = 1, limit = 50 } = req.query;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    let subs = await Submission.find()
      .populate('assignment')
      .populate({ path: 'student', select: 'name email rollNumber' })
      .sort({ submittedAt: -1 });

    if (search) {
      const rx = new RegExp(search.trim(), 'i');
      subs = subs.filter(
        (s) =>
          rx.test(s.student?.name || '') ||
          rx.test(s.student?.email || '') ||
          rx.test(s.student?.rollNumber || '') ||
          rx.test(s.assignment?.title || '')
      );
    }
    if (status === 'late') subs = subs.filter((s) => s.late);
    if (status === 'ontime') subs = subs.filter((s) => !s.late);

    const total = subs.length;
    const paged = subs.slice((p - 1) * l, p * l);

    res.json({
      submissions: paged.map((s) => ({
        ...s.toJSONSafe(),
        student: s.student
          ? {
              id: s.student._id.toString(),
              name: s.student.name,
              email: s.student.email,
              rollNumber: s.student.rollNumber,
            }
          : null,
        assignment: s.assignment
          ? { id: s.assignment._id.toString(), title: s.assignment.title, deadline: s.assignment.deadline }
          : null,
      })),
      pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) },
    });
  } catch (err) {
    console.error('[listAllSubmissions]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/submissions/:id/file  (auth — owner or admin)
async function downloadSubmission(req, res) {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });
    const isOwner = sub.student.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const file = path.join(__dirname, '..', '..', 'uploads', sub.filePath);
    if (!fs.existsSync(file)) return res.status(404).json({ message: 'File missing' });
    res.download(file, sub.fileName);
  } catch (err) {
    console.error('[downloadSubmission]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  submitWork,
  listMySubmissions,
  listAllSubmissions,
  downloadSubmission,
};
