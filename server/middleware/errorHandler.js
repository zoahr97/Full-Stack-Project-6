// טיפול מרכזי בשגיאות – כל controller יכול לקרוא ל-next(err)
// ושגיאה תגיע לכאן במקום לכתוב try/catch בכל מקום
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

module.exports = { errorHandler };
