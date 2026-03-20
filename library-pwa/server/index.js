const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDB();

// Basic route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Library API is running' });
});

// Import Routers
const memberRoutes = require('./routes/members');
const bookRoutes = require('./routes/books');
const seatRoutes = require('./routes/seats');
const dashboardRoutes = require('./routes/dashboard');
const transactionRoutes = require('./routes/transactions');
const attendanceRoutes = require('./routes/attendance');
const materialRoutes = require('./routes/materials');
const notificationRoutes = require('./routes/notifications');

// Register Routes
app.use('/api/members', memberRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/notifications', notificationRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
