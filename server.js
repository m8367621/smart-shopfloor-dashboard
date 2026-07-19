const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const historyFile = path.join(__dirname, "history.json");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let lastSeen = 0;
let history = [];

if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile));
}
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
    console.log("ESP32 Data Received");
    console.log(req.body);

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
    // Save every sensor reading to Firebase
    history.unshift({
    date: new Date().toLocaleDateString("en-GB", {
        timeZone: "Asia/Kolkata"
    }),
    time: new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }),
    pm1: sensorData.pm1,
    pm25: sensorData.pm25,
    pm10: sensorData.pm10,
    noise: sensorData.noise,
    temperature: sensorData.temperature,
    humidity: sensorData.humidity,
    light: sensorData.light,
    status: status
});

// Keep only the latest 1000 records
if (history.length > 10000) {
    history.pop();
}
fs.writeFileSync(
    historyFile,
    JSON.stringify(history, null, 2)
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
    res.json(history);
});


app.listen(PORT, () => {

    console.log("====================================");
    console.log(" Smart Shopfloor Server Started");
    console.log(" http://localhost:3000");
    console.log("====================================");

});