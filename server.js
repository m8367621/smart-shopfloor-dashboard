const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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

// ESP32 sends data here
app.post("/api/data", (req, res) => {

    lastSeen = Date.now();

    sensorData = {
        ...sensorData,
        ...req.body,
        esp32: "Connected",
        wifi: "Connected",
        cloud: "Online"
    };

    res.json({ success: true });
});

// Dashboard reads data here
app.get("/api/data", (req, res) => {

    if (Date.now() - lastSeen > 5000) {
        sensorData.esp32 = "Not Connected";
        sensorData.wifi = "Not Connected";
    }

    res.json(sensorData);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});