const router      = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getMemories, createMemory, updateMemory, deleteMemory } = require('../controllers/memories.controller');

// memories שייכות לרשומת יומן – כל מי שמחובר יכול לראות ולהוסיף
// מחיקה/עריכה מוגבלת לבעל הרשומה (נבדק ב-controller)
router.get('/:entryId/memories',          verifyToken, getMemories);
router.post('/:entryId/memories',         verifyToken, createMemory);
router.put('/:entryId/memories/:id',      verifyToken, updateMemory);
router.delete('/:entryId/memories/:id',   verifyToken, deleteMemory);

// Alias for the assignment requirements: comments = memories
router.get('/:entryId/comments',          verifyToken, getMemories);
router.post('/:entryId/comments',         verifyToken, createMemory);
router.put('/:entryId/comments/:id',      verifyToken, updateMemory);
router.delete('/:entryId/comments/:id',   verifyToken, deleteMemory);

module.exports = router;
