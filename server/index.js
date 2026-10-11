require('dotenv').config();
const express          = require('express');
const cors             = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth.routes');
const travelersRoutes = require('./routes/travelers.routes');
const tripsRoutes     = require('./routes/trips.routes');
const journalRoutes   = require('./routes/journal.routes');
const memoriesRoutes  = require('./routes/memories.routes');
const adminRoutes     = require('./routes/admin.routes');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use('/auth',      authRoutes);
app.use('/travelers', travelersRoutes);   // Original TripDiary routes: /travelers/:id
app.use('/travelers', tripsRoutes);       // Original: /travelers/:userId/trips
app.use('/travelers', journalRoutes);     // Original: /travelers/:userId/journal
app.use('/journal',   memoriesRoutes);    // Original: /journal/:entryId/memories

// Project-requirement aliases in jsonplaceholder style:
// users = travelers, todos = trips, posts = journal, comments = memories
app.use('/users', travelersRoutes);       // /users/:id + /users/:id/password
app.use('/users', tripsRoutes);           // /users/:userId/todos
app.use('/users', journalRoutes);         // /users/:userId/posts
app.use('/posts', memoriesRoutes);        // /posts/:entryId/comments

app.use('/admin',     adminRoutes);       // /admin/users

// ── Error handler – חייב להיות אחרון! ───────────────────────
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
