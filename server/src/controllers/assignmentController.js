const path = require('path');
const fs = require('fs');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

function parseDeadline(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// GET /api/assignments  (admin + student)
async function listAssignments(req, res) {
  try {
    const { search = '', from, to, page = 1, limit = 50 } = req.query;
    const query = {};
    if (search) {
      const rx = new RegExp(search.trim(), 'i');
      query.$or = [{ title: rx }, { description: rx }];
    }
    if (from || to) {
      query.deadline = {};
      if (from) query.deadline.$gte = new Date(from);
      if (to) query.deadline.$lte = new Date(to);
    }

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    const [items, total] = await Promise.all([
      Assignment.find(query).sort({ deadline: 1 }).skip((p - 1) * l).limit(l),
      Assignment.countDocuments(query),
    ]);
    res.json({
      assignments: items.map((a) => a.toJSONSafe()),
      pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) },
    });
  } catch (err) {
    console.error('[listAssignments]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/assignments  (admin)
async function createAssignment(req, res) {
  try {
    const { title, description = '', type = 'richtext', externalLink = '', deadline } = req.body || {};
    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }
    const dl = parseDeadline(deadline);
    if (!dl) return res.status(400).json({ message: 'Invalid deadline' });
    if (!['pdf', 'link', 'richtext'].includes(type)) {
      return res.status(400).json({ message: 'Invalid assignment type' });
    }
    if (type === 'link' && !externalLink) {
      return res.status(400).json({ message: 'External link required for link type' });
    }

    const doc = await Assignment.create({
      title: title.trim(),
      description,
      type,
      externalLink,
      deadline: dl,
      createdBy: req.user._id,
      attachmentPath: req.file ? req.file.filename : '',
      attachmentName: req.file ? req.file.originalname : '',
    });
    res.status(201).json({ assignment: doc.toJSONSafe() });
  } catch (err) {
    console.error('[createAssignment]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/assignments/:id  (admin)
async function updateAssignment(req, res) {
  try {
    const a = await Assignment.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Assignment not found' });

    const { title, description, type, externalLink, deadline } = req.body || {};
    if (title !== undefined) a.title = String(title).trim();
    if (description !== undefined) a.description = description;
    if (type !== undefined) {
      if (!['pdf', 'link', 'richtext'].includes(type)) {
        return res.status(400).json({ message: 'Invalid assignment type' });
      }
      a.type = type;
    }
    if (externalLink !== undefined) a.externalLink = externalLink;
    if (deadline !== undefined) {
      const dl = parseDeadline(deadline);
      if (!dl) return res.status(400).json({ message: 'Invalid deadline' });
      a.deadline = dl;
    }
    if (req.file) {
      a.attachmentPath = req.file.filename;
      a.attachmentName = req.file.originalname;
    }
    await a.save();
    res.json({ assignment: a.toJSONSafe() });
  } catch (err) {
    console.error('[updateAssignment]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/assignments/:id  (admin)
async function deleteAssignment(req, res) {
  try {
    const a = await Assignment.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Assignment not found' });

    // Also remove submissions + their files
    const subs = await Submission.find({ assignment: a._id });
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    for (const s of subs) {
      try { fs.unlinkSync(path.join(uploadDir, s.filePath)); } catch (_) {}
    }
    await Submission.deleteMany({ assignment: a._id });
    if (a.attachmentPath) {
      try { fs.unlinkSync(path.join(uploadDir, a.attachmentPath)); } catch (_) {}
    }
    await a.deleteOne();
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error('[deleteAssignment]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/assignments/:id/attachment  (auth)
async function downloadAttachment(req, res) {
  try {
    const a = await Assignment.findById(req.params.id);
    if (!a || !a.attachmentPath) return res.status(404).json({ message: 'No attachment' });
    const file = path.join(__dirname, '..', '..', 'uploads', a.attachmentPath);
    if (!fs.existsSync(file)) return res.status(404).json({ message: 'File missing' });
    res.download(file, a.attachmentName || a.attachmentPath);
  } catch (err) {
    console.error('[downloadAttachment]', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  downloadAttachment,
};
