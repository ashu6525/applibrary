const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Admin Dashboard stats
router.get('/stats', (req, res) => {
    const db = getDB();
    const stats = {};
    
    // Execute multiple counts
    db.serialize(() => {
        db.get("SELECT COUNT(*) as total FROM members", (err, row) => stats.totalMembers = row ? row.total : 0);
        db.get("SELECT COUNT(*) as active FROM members WHERE role = 'member'", (err, row) => stats.activeMembers = row ? row.active : 0);
        db.get("SELECT COUNT(*) as issued FROM transactions WHERE status = 'issued'", (err, row) => stats.booksIssued = row ? row.issued : 0);
        db.get("SELECT COUNT(*) as reserved FROM books WHERE status = 'reserved'", (err, row) => stats.booksReserved = row ? row.reserved : 0);
        db.get("SELECT SUM(amount) as revenue FROM payments WHERE status = 'paid'", (err, row) => {
            stats.revenue = row && row.revenue ? row.revenue : 0;
            db.close();
            res.json(stats);
        });
    });
});

// Live Library Status (Available Seats)
router.get('/live', (req, res) => {
    const db = getDB();
    const liveStats = {};
    db.serialize(() => {
        db.get("SELECT COUNT(*) as available FROM seats WHERE status = 'available'", (err, row) => liveStats.availableSeats = row ? row.available : 0);
        db.get("SELECT COUNT(*) as occupied FROM seats WHERE status = 'booked'", (err, row) => {
            liveStats.occupiedSeats = row ? row.occupied : 0;
            db.close();
            res.json(liveStats);
        });
    });
});

module.exports = router;
