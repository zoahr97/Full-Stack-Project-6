const router      = require('express').Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { getAllUsers, blockUser, unblockUser, getUserActivity } = require('../controllers/admin.controller');

// כל route של אדמין דורש תחילה token תקין ואז בדיקת is_admin
router.get('/users',                 verifyToken, verifyAdmin, getAllUsers);
router.get('/users/:id/activity',    verifyToken, verifyAdmin, getUserActivity);
router.put('/users/:id/block',       verifyToken, verifyAdmin, blockUser);
router.put('/users/:id/unblock',     verifyToken, verifyAdmin, unblockUser);

module.exports = router;
