const router      = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/journal.controller');

function ownOnly(req, res, next) {
  if (req.user.id !== +req.params.userId)
    return res.status(403).json({ message: 'Forbidden' });
  next();
}

router.get('/:userId/journal',        verifyToken, ownOnly, getEntries);
router.post('/:userId/journal',       verifyToken, ownOnly, createEntry);
router.put('/:userId/journal/:id',    verifyToken, ownOnly, updateEntry);
router.delete('/:userId/journal/:id', verifyToken, ownOnly, deleteEntry);

// Alias for the assignment requirements: posts = journal
router.get('/:userId/posts',        verifyToken, ownOnly, getEntries);
router.post('/:userId/posts',       verifyToken, ownOnly, createEntry);
router.put('/:userId/posts/:id',    verifyToken, ownOnly, updateEntry);
router.delete('/:userId/posts/:id', verifyToken, ownOnly, deleteEntry);

module.exports = router;
