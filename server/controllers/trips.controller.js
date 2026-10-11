const pool = require('../config/db');

// GET /travelers/:userId/trips  – אפשר לסנן: ?status=planned/ongoing/completed
async function getTrips(req, res, next) {
  try {
    const { userId }   = req.params;
    const { status }   = req.query;
    let sql            = 'SELECT * FROM trips WHERE user_id = ?';
    const args         = [userId];

    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }
    sql += ' ORDER BY id';

    const [rows] = await pool.query(sql, args);
    res.json(rows);
  } catch (err) { next(err); }
}

// POST /travelers/:userId/trips
async function createTrip(req, res, next) {
  try {
    const { userId } = req.params;
    const { title, destination, start_date, end_date, status } = req.body;
    if (!title || !destination)
      return res.status(400).json({ message: 'title and destination are required' });

    const [result] = await pool.query(
      'INSERT INTO trips (user_id, title, destination, start_date, end_date, status) VALUES (?,?,?,?,?,?)',
      [userId, title, destination, start_date || null, end_date || null, status || 'planned']
    );
    res.status(201).json({ id: result.insertId, user_id: +userId, title, destination, start_date, end_date, status: status || 'planned' });
  } catch (err) { next(err); }
}

// PUT /travelers/:userId/trips/:id
async function updateTrip(req, res, next) {
  try {
    const { userId, id } = req.params;
    const [rows] = await pool.query('SELECT * FROM trips WHERE id=? AND user_id=?', [id, userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Trip not found' });

    const t = rows[0];
    const { title, destination, start_date, end_date, status } = req.body;
    const updated = {
      title:       title       ?? t.title,
      destination: destination ?? t.destination,
      start_date:  start_date  ?? t.start_date,
      end_date:    end_date    ?? t.end_date,
      status:      status      ?? t.status,
    };

    await pool.query(
      'UPDATE trips SET title=?, destination=?, start_date=?, end_date=?, status=? WHERE id=?',
      [updated.title, updated.destination, updated.start_date, updated.end_date, updated.status, id]
    );
    res.json({ id: +id, user_id: +userId, ...updated });
  } catch (err) { next(err); }
}

// DELETE /travelers/:userId/trips/:id
async function deleteTrip(req, res, next) {
  try {
    const { userId, id } = req.params;
    const [rows] = await pool.query('SELECT id FROM trips WHERE id=? AND user_id=?', [id, userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Trip not found' });

    await pool.query('DELETE FROM trips WHERE id=?', [id]);
    res.json({ message: 'Deleted', id: +id });
  } catch (err) { next(err); }
}

module.exports = { getTrips, createTrip, updateTrip, deleteTrip };
