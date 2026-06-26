const express = require('express');
const {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  downloadAttachment,
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', listAssignments);
router.get('/:id/attachment', downloadAttachment);

router.post('/', requireRole('admin'), upload.single('attachment'), createAssignment);
router.put('/:id', requireRole('admin'), upload.single('attachment'), updateAssignment);
router.delete('/:id', requireRole('admin'), deleteAssignment);

module.exports = router;
