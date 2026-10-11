const bcrypt = require('bcrypt');
const pool   = require('../config/db');

// GET /travelers/:id – פרופיל משתמש (ללא סיסמה)
async function getProfile(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, name, email, phone, website, is_admin, is_blocked FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// PUT /travelers/:id – עדכון פרטי פרופיל
async function updateProfile(req, res, next) {
  try {
    const { name, email, phone, website } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE users SET name=?, email=?, phone=?, website=? WHERE id=?',
      [name, email, phone || null, website || null, id]
    );

    const [rows] = await pool.query(
      'SELECT id, username, name, email, phone, website FROM users WHERE id=?', [id]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
}

// PUT /travelers/:id/password – שינוי סיסמה
// מאמת את הסיסמה הישנה לפני עדכון
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT password_hash FROM credentials WHERE user_id=?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE credentials SET password_hash=? WHERE user_id=?', [newHash, id]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile, changePassword };
