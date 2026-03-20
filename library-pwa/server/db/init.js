const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'library.sqlite');

function initDB() {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err.message);
        } else {
            console.log('Connected to the SQLite database.');
            createTables(db);
        }
    });
}

function createTables(db) {
    db.serialize(() => {
        // Members Table
        db.run(`CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE,
            password TEXT,
            name TEXT,
            plan TEXT,
            join_date TEXT,
            photo_url TEXT,
            role TEXT DEFAULT 'member'
        )`);

        // Books Table
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT,
            category TEXT,
            status TEXT DEFAULT 'available',
            cover_url TEXT
        )`);

        // Transactions (Issues/Returns)
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            member_id INTEGER,
            issue_date TEXT,
            due_date TEXT,
            return_date TEXT,
            fine REAL DEFAULT 0,
            status TEXT DEFAULT 'issued',
            FOREIGN KEY(book_id) REFERENCES books(id),
            FOREIGN KEY(member_id) REFERENCES members(id)
        )`);

        // Seats Table
        db.run(`CREATE TABLE IF NOT EXISTS seats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seat_number INTEGER UNIQUE,
            status TEXT DEFAULT 'available',
            shift TEXT
        )`);

        // Payments Table
        db.run(`CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_id INTEGER,
            amount REAL,
            date TEXT,
            status TEXT DEFAULT 'pending',
            method TEXT,
            FOREIGN KEY(member_id) REFERENCES members(id)
        )`);

        // Notifications
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            message TEXT,
            date TEXT
        )`);

        // Materials (Study Materials)
        db.run(`CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            type TEXT,
            url TEXT
        )`);

        // Attendance Table
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_id INTEGER,
            date TEXT,
            status TEXT,
            FOREIGN KEY(member_id) REFERENCES members(id)
        )`);

        // Seed initial admin user if no users exist
        db.get("SELECT count(*) as count FROM members WHERE role = 'admin'", (err, row) => {
            if (!err && row.count === 0) {
                // Default admin login: admin / admin
                db.run("INSERT INTO members (phone, password, name, role, join_date) VALUES ('admin', 'admin', 'System Admin', 'admin', datetime('now'))");
                console.log("Seeded default admin user (phone: admin, pass: admin)");

                // Seed some basic seats
                const stmt = db.prepare("INSERT INTO seats (seat_number, status, shift) VALUES (?, 'available', 'all')");
                for (let i = 1; i <= 20; i++) {
                    stmt.run(i);
                }
                stmt.finalize();
                console.log("Seeded 20 library seats");
            }
        });
    });
}

function getDB() {
    return new sqlite3.Database(dbPath);
}

module.exports = { initDB, getDB };
