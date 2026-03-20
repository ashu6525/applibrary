const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get attendance
router.get('/', (req, res) => {
    const db = getDB();
    db.all(`SELECT a.*, m.name as member_name 
            FROM attendance a
            JOIN members m ON a.member_id = m.id`, [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Mark attendance
router.post('/mark', (req, res) => {
    const { member_id, status } = req.body;
    const db = getDB();
    const date = new Date().toISOString().split('T')[0];
    
    db.run("INSERT INTO attendance (member_id, date, status) VALUES (?, ?, ?)", 
        [member_id, date, status || 'present'],
        function (err) {
            db.close();
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Attendance marked' });
        }
    );
});

module.exports = router;
