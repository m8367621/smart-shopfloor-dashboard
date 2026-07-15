const sqlite3 = require("sqlite3").verbose();

// Create/Open Database
const db = new sqlite3.Database("./shopfloor.db", (err) => {

    if (err) {
        console.log("Database Error:", err.message);
    } else {
        console.log("SQLite Database Connected");
    }

});

// Create Table
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS sensor_history (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            date TEXT,

            time TEXT,

            pm1 REAL,
            pm25 REAL,
            pm10 REAL,

            noise REAL,

            temperature REAL,

            humidity REAL,

            light REAL,

            status TEXT

        )
    `);

});

module.exports = db;