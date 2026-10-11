const pool = require('../config/db');

// GET /admin/users – רשימת כל המשתמשים (ללא סיסמאות!)
async function getAllUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, name, email, phone, is_blocked, is_admin, created_at FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// PUT /admin/users/:id/block – חסימת משתמש
async function blockUser(req, res, next) {
  try {
    const { id } = req.params;

    // לא מאפשרים לחסום אדמין
    const [rows] = await pool.query('SELECT is_admin FROM users WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    if (rows[0].is_admin)  return res.status(403).json({ message: 'Cannot block an admin' });

    await pool.query('UPDATE users SET is_blocked=TRUE WHERE id=?', [id]);
    res.json({ message: 'User blocked', id: +id });
  } catch (err) { next(err); }
}

// PUT /admin/users/:id/unblock – ביטול חסימה
async function unblockUser(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('UPDATE users SET is_blocked=FALSE WHERE id=?', [id]);
    res.json({ message: 'User unblocked', id: +id });
  } catch (err) { next(err); }
}

// GET /admin/users/:id/activity – פעילות משתמש
async function getUserActivity(req, res, next) {
  try {
    const { id } = req.params;
    const [[tripCount]]  = await pool.query('SELECT COUNT(*) as count FROM trips   WHERE user_id=?', [id]);
    const [[entryCount]] = await pool.query('SELECT COUNT(*) as count FROM journal WHERE user_id=?', [id]);
    const [user]         = await pool.query(
      'SELECT id, username, name, email, is_blocked, created_at FROM users WHERE id=?', [id]
    );
    if (user.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ ...user[0], trips: tripCount.count, entries: entryCount.count });
  } catch (err) { next(err); }
}

module.exports = { getAllUsers, blockUser, unblockUser, getUserActivity };