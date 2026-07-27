const sqlite3 = require("sqlite3").verbose();
const path = require("path");


// Database location
const dbPath = path.join(__dirname, "website.db");


// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database");
    }

});


// Create contact table
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS contact_requests (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            phone TEXT,

            email TEXT NOT NULL,

            message TEXT NOT NULL,

            contact_method TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

});


module.exports = db;