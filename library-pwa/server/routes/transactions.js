const express = require('express');
const router = express.Router();
const { getDB } = require('../db/init');

// Get all transactions
router.get('/', (req, res) => {
    const db = getDB();
    db.all(`SELECT t.*, b.title as book_title, m.name as member_name 
            FROM transactions t
            JOIN books b ON t.book_id = b.id
            JOIN members m ON t.member_id = m.id`, [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Issue Book
router.post('/issue', (req, res) => {
    const { book_id, member_id, due_date } = req.body;
    const db = getDB();
    
    db.serialize(() => {
        const issueDate = new Date().toISOString().split('T')[0];
        db.run("INSERT INTO transactions (book_id, member_id, issue_date, due_date, status) VALUES (?, ?, ?, ?, 'issued')", 
            [book_id, member_id, issueDate, due_date],
            function (err) {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }
                
                db.run("UPDATE books SET status = 'issued' WHERE id = ?", [book_id], (updateErr) => {
                    db.close();
                    if (updateErr) return res.status(500).json({ error: updateErr.message });
                    res.json({ success: true, message: 'Book issued successfully' });
                });
            }
        );
    });
});

// Return Book
router.post('/return', (req, res) => {
    const { transaction_id, book_id, fine } = req.body;
    const db = getDB();
    
    db.serialize(() => {
        const returnDate = new Date().toISOString().split('T')[0];
        db.run("UPDATE transactions SET status = 'returned', return_date = ?, fine = ? WHERE id = ?", 
            [returnDate, fine || 0, transaction_id],
            function (err) {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }
                
                db.run("UPDATE books SET status = 'available' WHERE id = ?", [book_id], (updateErr) => {
                    db.close();
                    if (updateErr) return res.status(500).json({ error: updateErr.message });
                    res.json({ success: true, message: 'Book returned successfully' });
                });
            }
        );
    });
});

module.exports = router;
