const express = require("express");
const cors = require("cors");
const db = require("./js/database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let lastHistorySave = 0;
let lastSeen = 0;
let sensorData = {
    esp32: "Not Connected",
    wifi: "Not Connected",
    cloud: "Online",

    pm1: 0,
    pm25: 0,
    pm10: 0,

    noise: 0,

    temperature: 0,
    humidity: 0,

    light: 0
};

// ================= ESP32 SENDS DATA =================

app.post("/api/data", (req, res) => {

    lastSeen = Date.now();

    sensorData = {
        ...sensorData,
        ...req.body,

        esp32: "Connected",
        wifi: "Connected",
        cloud: "Online"
    };

    let status = "Safe";

    if (
        sensorData.pm1 >= 100 ||
        sensorData.pm25 >= 75 ||
        sensorData.pm10 >= 150 ||
        sensorData.noise >= 90 ||
        sensorData.temperature >= 40 ||
        sensorData.humidity >= 85 ||
        sensorData.light < 80
    ) {

        status = "Danger";

    } else if (

        sensorData.pm1 >= 50 ||
        sensorData.pm25 >= 35 ||
        sensorData.pm10 >= 80 ||
        sensorData.noise >= 75 ||
        sensorData.temperature >= 35 ||
        sensorData.humidity >= 70 ||
        sensorData.light < 150

    ) {

        status = "Warning";
    }
    //every 30 seconds//
    if (DataTransfer.now() -lastHistorySave >= 30000){
        lastHistorySave = Date.now();
    }
    db.run(
        `INSERT INTO sensor_history
        (date,time,pm1,pm25,pm10,noise,temperature,humidity,light,status)
        VALUES(?,?,?,?,?,?,?,?,?,?)`,
        [
            new Date().toLocaleDateString("en-GB", {
                timeZone: "Asia/Kolkata"
            }),

            new Date().toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }),

            sensorData.pm1,
            sensorData.pm25,
            sensorData.pm10,
            sensorData.noise,
            sensorData.temperature,
            sensorData.humidity,
            sensorData.light,
            status
        ]
    );

    res.json({
        success: true
    });

});

// ================= LIVE SENSOR DATA =================

app.get("/api/data", (req, res) => {

    if (Date.now() - lastSeen > 5000) {

        sensorData.esp32 = "Not Connected";
        sensorData.wifi = "Not Connected";

        sensorData.pm1 = 0;
        sensorData.pm25 = 0;
        sensorData.pm10 = 0;
        sensorData.noise = 0;
        sensorData.temperature = 0;
        sensorData.humidity = 0;
        sensorData.light = 0;
    }

    res.json(sensorData);

});

// ================= HISTORY =================

app.get("/api/history", (req, res) => {

    db.all(
        "SELECT * FROM sensor_history ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

app.listen(PORT, () => {

    console.log("====================================");
    console.log(" Smart Shopfloor Server Started");
    console.log(" http://localhost:3000");
    console.log("====================================");

});