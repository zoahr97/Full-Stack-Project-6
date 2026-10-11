const pool = require('../config/db');

// GET /travelers/:userId/journal
async function getEntries(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM journal WHERE user_id=? ORDER BY id',
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// POST /travelers/:userId/journal
async function createEntry(req, res, next) {
  try {
    const { userId } = req.params;
    const { title, body, location } = req.body;
    if (!title || !body)
      return res.status(400).json({ message: 'title and body are required' });

    const [result] = await pool.query(
      'INSERT INTO journal (user_id, title, body, location) VALUES (?,?,?,?)',
      [userId, title, body, location || null]
    );
    res.status(201).json({ id: result.insertId, user_id: +userId, title, body, location: location || null });
  } catch (err) { next(err); }
}

// PUT /travelers/:userId/journal/:id – רק הבעלים יכול לערוך
async function updateEntry(req, res, next) {
  try {
    const { userId, id } = req.params;
    const [rows] = await pool.query('SELECT * FROM journal WHERE id=? AND user_id=?', [id, userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Entry not found or not yours' });

    const e = rows[0];
    const updated = {
      title:    req.body.title    ?? e.title,
      body:     req.body.body     ?? e.body,
      location: req.body.location ?? e.location,
    };

    await pool.query('UPDATE journal SET title=?, body=?, location=? WHERE id=?',
      [updated.title, updated.body, updated.location, id]);
    res.json({ id: +id, user_id: +userId, ...updated });
  } catch (err) { next(err); }
}

// DELETE /travelers/:userId/journal/:id
// מוחק קודם את ה-memories ואז את הרשומה – סדר מחיקה מפורש
async function deleteEntry(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const { userId, id } = req.params;
    const [rows] = await conn.query('SELECT id FROM journal WHERE id=? AND user_id=?', [id, userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Entry not found or not yours' });

    await conn.beginTransaction();
    await conn.query('DELETE FROM memories WHERE entry_id=?', [id]); // מחיקת memories קודם!
    await conn.query('DELETE FROM journal WHERE id=?', [id]);
    await conn.commit();

    res.json({ message: 'Entry and its memories deleted', id: +id });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

module.exports = { getEntries, createEntry, updateEntry, deleteEntry };
