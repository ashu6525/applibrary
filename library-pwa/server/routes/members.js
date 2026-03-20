const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get all members
router.get('/', (req, res) => {
    const db = getDB();
    db.all("SELECT id, name, phone, plan, role FROM members", [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Login
router.post('/login', (req, res) => {
    const { phone, password } = req.body;
    const db = getDB();
    
    db.get("SELECT id, name, phone, role FROM members WHERE phone = ? AND password = ?", [phone, password], (err, row) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

module.exports = router;
