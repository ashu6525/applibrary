const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get all seats
router.get('/', (req, res) => {
    const db = getDB();
    db.all("SELECT * FROM seats", [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Book a seat
router.post('/book', (req, res) => {
    const { seat_number, shift } = req.body;
    const db = getDB();
    
    // Check if available
    db.get("SELECT status FROM seats WHERE seat_number = ?", [seat_number], (err, row) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }
        if (row && row.status === 'available') {
            db.run(
                "UPDATE seats SET status = 'booked', shift = ? WHERE seat_number = ?",
                [shift, seat_number],
                function (updateErr) {
                    db.close();
                    if (updateErr) return res.status(500).json({ error: updateErr.message });
                    res.json({ success: true, message: 'Seat booked successfully' });
                }
            );
        } else {
            db.close();
            res.status(400).json({ success: false, message: 'Seat not available' });
        }
    });
});

module.exports = router;
