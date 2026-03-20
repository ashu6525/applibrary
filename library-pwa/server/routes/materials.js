const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get all materials
router.get('/', (req, res) => {
    const db = getDB();
    db.all("SELECT * FROM materials", [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add new material
router.post('/', (req, res) => {
    const { title, type, url } = req.body;
    const db = getDB();
    
    db.run("INSERT INTO materials (title, type, url) VALUES (?, ?, ?)", 
        [title, type, url],
        function (err) {
            db.close();
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

module.exports = router;
