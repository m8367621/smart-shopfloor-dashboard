const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let lastSeen = 0;
let sensorHistory =[];
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

    // Save every sensor reading
    sensorHistory.push({

        date: new Date().toLocaleDateString("en-GB"),

        time: new Date().toLocaleTimeString("en-US"),

        pm1: sensorData.pm1,
        pm25: sensorData.pm25,
        pm10: sensorData.pm10,

        noise: sensorData.noise,

        temperature: sensorData.temperature,

        humidity: sensorData.humidity,

        light: sensorData.light,

        status:
            sensorData.pm1 >= 100 ||
            sensorData.pm25 >= 75 ||
            sensorData.pm10 >= 150 ||
            sensorData.noise >= 90 ||
            sensorData.temperature >= 40 ||
            sensorData.humidity >= 85 ||
            sensorData.light < 80
                ? " critical"
                : sensorData.pm1 >= 50 ||
                  sensorData.pm25 >= 35 ||
                  sensorData.pm10 >= 80 ||
                  sensorData.noise >= 75 ||
                  sensorData.temperature >= 35 ||
                  sensorData.humidity >= 70 ||
                  sensorData.light < 150
                ? " Warning"
                : "Safe"

    });

    // Keep only latest 1000 records
    if (sensorHistory.length > 1000) {
        sensorHistory.shift();
    }

    res.json({
        success: true
    });

});

// ================= DASHBOARD READS DATA =================

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
app.get("/api/history", (req, res) => {

    res.json(sensorHistory);

});

app.listen(PORT, () => {

    console.log("====================================");
    console.log(" Smart Shopfloor Server Started");
    console.log(" http://localhost:3000");
    console.log(" Waiting for ESP32...");
    console.log("====================================");

});