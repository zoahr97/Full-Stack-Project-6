const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

// POST /auth/login
// מחפש משתמש לפי username בלבד – לא מביא את כל המשתמשים לקליינט!
// זה הדגש הכי חשוב מבחינת אבטחה
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    // שאילתה ממוקדת – רק המשתמש הספציפי הזה
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.name, u.email, u.phone, u.website,
              u.is_admin, u.is_blocked, c.password_hash
       FROM users u
       JOIN credentials c ON c.user_id = u.id
       WHERE u.username = ?`,
      [username]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid username or password' });

    const user = rows[0];

    // בדיקה שהמשתמש לא חסום
    if (user.is_blocked)
      return res.status(403).json({ message: 'Your account has been blocked' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // מחזיר את המשתמש ללא הסיסמה
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) { next(err); }
}

// POST /auth/register
async function register(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const { username, name, email, password, phone, website } = req.body;
    if (!username || !name || !email || !password)
      return res.status(400).json({ message: 'username, name, email and password are required' });

    // בדיקה שהמשתמש לא קיים כבר
    const [existing] = await conn.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: 'Username or email already taken' });

    const hash = await bcrypt.hash(password, 10);

    // transaction – אם ההכנסה לאחת הטבלאות נכשלת, הכל מבוטל
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO users (username, name, email, phone, website) VALUES (?,?,?,?,?)',
      [username, name, email, phone || null, website || null]
    );
    const userId = result.insertId;
    await conn.query(
      'INSERT INTO credentials (user_id, password_hash) VALUES (?,?)',
      [userId, hash]
    );
    await conn.commit();

    const token = jwt.sign(
      { id: userId, username, is_admin: false },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: { id: userId, username, name, email, phone: phone || null, website: website || null, is_admin: false, is_blocked: false }
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

module.exports = { login, register };
