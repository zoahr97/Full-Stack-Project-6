const router      = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword } = require('../controllers/travelers.controller');

// בודק שהמשתמש מחובר ושהוא מבקש רק את הפרופיל שלו עצמו
function ownOnly(req, res, next) {
  if (req.user.id !== +req.params.id)
    return res.status(403).json({ message: 'Forbidden' });
  next();
}

router.get('/:id',          verifyToken, ownOnly, getProfile);
router.put('/:id',          verifyToken, ownOnly, updateProfile);
router.put('/:id/password', verifyToken, ownOnly, changePassword);

module.exports = router;
