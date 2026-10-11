const pool = require('../config/db');

// GET /journal/:entryId/memories
async function getMemories(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM memories WHERE entry_id=? ORDER BY id',
      [req.params.entryId]
    );
    res.json(rows);
  } catch (err) { next(err); }
}

// POST /journal/:entryId/memories
async function createMemory(req, res, next) {
  try {
    const { entryId }        = req.params;
    const { name, email, body } = req.body;
    if (!name || !email || !body)
      return res.status(400).json({ message: 'name, email and body are required' });

    // בדיקה שהרשומה קיימת לפני הוספת memory
    const [entry] = await pool.query('SELECT id FROM journal WHERE id=?', [entryId]);
    if (entry.length === 0) return res.status(404).json({ message: 'Entry not found' });

    const [result] = await pool.query(
      'INSERT INTO memories (entry_id, name, email, body) VALUES (?,?,?,?)',
      [entryId, name, email, body]
    );
    res.status(201).json({ id: result.insertId, entry_id: +entryId, name, email, body });
  } catch (err) { next(err); }
}

// PUT /journal/:entryId/memories/:id
async function updateMemory(req, res, next) {
  try {
    const { entryId, id } = req.params;
    const [rows] = await pool.query('SELECT * FROM memories WHERE id=? AND entry_id=?', [id, entryId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Memory not found' });

    const m = rows[0];
    const updated = {
      name:  req.body.name  ?? m.name,
      email: req.body.email ?? m.email,
      body:  req.body.body  ?? m.body,
    };

    await pool.query('UPDATE memories SET name=?, email=?, body=? WHERE id=?',
      [updated.name, updated.email, updated.body, id]);
    res.json({ id: +id, entry_id: +entryId, ...updated });
  } catch (err) { next(err); }
}

// DELETE /journal/:entryId/memories/:id
async function deleteMemory(req, res, next) {
  try {
    const { entryId, id } = req.params;
    const [rows] = await pool.query('SELECT id FROM memories WHERE id=? AND entry_id=?', [id, entryId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Memory not found' });

    await pool.query('DELETE FROM memories WHERE id=?', [id]);
    res.json({ message: 'Memory deleted', id: +id });
  } catch (err) { next(err); }
}

module.exports = { getMemories, createMemory, updateMemory, deleteMemory };
