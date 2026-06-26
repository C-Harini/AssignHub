const express = require('express');
const {
  submitWork,
  listMySubmissions,
  listAllSubmissions,
  downloadSubmission,
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/mine', requireRole('student'), listMySubmissions);
router.get('/', requireRole('admin'), listAllSubmissions);
router.get('/:id/file', downloadSubmission);
router.post('/:assignmentId', requireRole('student'), upload.single('file'), submitWork);

module.exports = router;
