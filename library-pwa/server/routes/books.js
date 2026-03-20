const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get all books
router.get('/', (req, res) => {
    const db = getDB();
    db.all("SELECT * FROM books", [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a new book
router.post('/', (req, res) => {
    const { title, author, category, cover_url } = req.body;
    const db = getDB();
    db.run(
        "INSERT INTO books (title, author, category, cover_url) VALUES (?, ?, ?, ?)",
        [title, author, category, cover_url],
        function (err) {
            db.close();
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Update book status (e.g. reserving)
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const db = getDB();
    db.run(
        "UPDATE books SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
            db.close();
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, changes: this.changes });
        }
    );
});

module.exports = router;
