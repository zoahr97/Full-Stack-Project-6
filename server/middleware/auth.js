const jwt = require('jsonwebtoken');

// בודק את ה-JWT בכותרת Authorization של הבקשה.
// אם תקין – שם את המידע המפוענח ב-req.user וממשיך.
// משמש על כל route מוגן.
function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token provided' });

  const token = header.split(' ')[1]; // "Bearer <token>"
  if (!token)  return res.status(401).json({ message: 'Malformed token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// בודק שהמשתמש המחובר הוא אדמין
function verifyAdmin(req, res, next) {
  if (!req.user?.is_admin)
    return res.status(403).json({ message: 'Admin access required' });
  next();
}

module.exports = { verifyToken, verifyAdmin };
