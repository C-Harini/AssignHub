const express = require('express');
const {
  listStudents,
  listPending,
  approveStudent,
  rejectStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/', listStudents);
router.get('/pending', listPending);
router.put('/:id/approve', approveStudent);
router.put('/:id/reject', rejectStudent);

module.exports = router;
