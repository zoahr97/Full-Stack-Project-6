const router      = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getTrips, createTrip, updateTrip, deleteTrip } = require('../controllers/trips.controller');

// מוודא שה-userId ב-URL שייך למשתמש המחובר
function ownOnly(req, res, next) {
  if (req.user.id !== +req.params.userId)
    return res.status(403).json({ message: 'Forbidden' });
  next();
}

router.get('/:userId/trips',          verifyToken, ownOnly, getTrips);
router.post('/:userId/trips',         verifyToken, ownOnly, createTrip);
router.put('/:userId/trips/:id',      verifyToken, ownOnly, updateTrip);
router.delete('/:userId/trips/:id',   verifyToken, ownOnly, deleteTrip);

// Alias for the assignment requirements: todos = trips
router.get('/:userId/todos',          verifyToken, ownOnly, getTrips);
router.post('/:userId/todos',         verifyToken, ownOnly, createTrip);
router.put('/:userId/todos/:id',      verifyToken, ownOnly, updateTrip);
router.delete('/:userId/todos/:id',   verifyToken, ownOnly, deleteTrip);

module.exports = router;
