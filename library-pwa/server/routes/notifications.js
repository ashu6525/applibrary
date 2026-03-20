const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get notifications
router.get('/', (req, res) => {
    const db = getDB();
    db.all("SELECT * FROM notifications ORDER BY date DESC", [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create notification
router.post('/', (req, res) => {
    const { title, message } = req.body;
    const db = getDB();
    const date = new Date().toISOString();
    
    db.run("INSERT INTO notifications (title, message, date) VALUES (?, ?, ?)", 
        [title, message, date],
        function (err) {
            db.close();
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

module.exports = router;
