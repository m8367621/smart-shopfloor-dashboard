// ================= CLOCK =================

function updateClock() {

    const now = new Date();

    document.getElementById("date").innerHTML =
        now.toLocaleDateString("en-GB");

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

}

setInterval(updateClock, 1000);
updateClock();


// ================= TOWER LAMP =================

const greenLamp = document.querySelector(".lamp.green");
const yellowLamp = document.querySelector(".lamp.yellow");
const redLamp = document.querySelector(".lamp.red");


// ================= UPDATE DASHBOARD =================

async function updateStatus() {

    try {

        const response = await fetch("https://smart-shopfloor-dashboard.onrender.com/api/data");

        const data = await response.json();

        // ================= STATUS =================

        document.getElementById("espStatus").textContent = data.esp32;
        document.getElementById("wifiStatus").textContent = data.wifi;
        document.getElementById("cloudStatus").textContent = data.cloud;

        // ================= SENSOR VALUES =================

        document.getElementById("pm1Value").textContent =
            data.esp32 === "Connected" ? Number(data.pm1).toFixed(1) : "--";

        document.getElementById("pm25Value").textContent =
            data.esp32 === "Connected" ? Number(data.pm25).toFixed(1) : "--";

        document.getElementById("pm10Value").textContent =
            data.esp32 === "Connected" ? Number(data.pm10).toFixed(1) : "--";

        document.getElementById("noiseValue").textContent =
            data.esp32 === "Connected" ? Number(data.noise).toFixed(1) : "--";

        document.getElementById("tempValue").textContent =
            data.esp32 === "Connected" ? Number(data.temperature).toFixed(1) : "--";

        document.getElementById("humidityValue").textContent =
            data.esp32 === "Connected" ? Number(data.humidity).toFixed(1) : "--";

        document.getElementById("lightValue").textContent =
            data.esp32 === "Connected" ? Number(data.light).toFixed(1) : "--";
        // ================= ESP32 DISCONNECTED =================

        if (data.esp32 !== "Connected") {

            updateSensorCards({
                pm1: 0,
                pm25: 0,
                pm10: 0,
                noise: 0,
                temperature: 0,
                humidity: 0,
                light: 0
            });

            greenLamp.classList.remove("active");
            yellowLamp.classList.remove("active");
            redLamp.classList.remove("active");

            document.getElementById("overallStatus").className = "overall-status";
            document.getElementById("overallText").innerHTML = "NO DATA";
            document.getElementById("overallMessage").innerHTML =
                "ESP32 is not connected.";

            document.getElementById("towerText").innerHTML =
                "Tower Lamp Offline";

            return;
        }

        // ================= UPDATE SENSOR CARD COLORS =================

        updateSensorCards(data);

        // ================= LIVE CHARTS =================

        updateChart(pm1Chart, data.pm1);
        updateChart(pm25Chart, data.pm25);
        updateChart(pm10Chart, data.pm10);
        updateChart(noiseChart, data.noise);
        updateChart(tempChart, data.temperature);
        updateChart(humidityChart, data.humidity);
        updateChart(lightChart, data.light);
        // ================= OVERALL SAFETY =================

        let level = "SAFE";

        if (
            data.pm1 >= 100 ||
            data.pm25 >= 75 ||
            data.pm10 >= 150 ||
            data.noise >= 90 ||
            data.temperature >= 40
        ) {

            level = "CRITICAL";

        }
        else if (

            data.pm1 >= 50 ||
            data.pm25 >= 35 ||
            data.pm10 >= 80 ||
            data.noise >= 75 ||
            data.temperature >= 35 ||
            data.humidity >= 70 ||
            data.light <= 150

        ) {

            level = "WARNING";

        }

        const overall = document.getElementById("overallStatus");
        const overallText = document.getElementById("overallText");
        const overallMessage = document.getElementById("overallMessage");

        overall.className = "overall-status";

        greenLamp.classList.remove("active");
        yellowLamp.classList.remove("active");
        redLamp.classList.remove("active");

        if (level === "SAFE") {

            overall.classList.add("safe");

            overallText.innerHTML = "SAFE";

            overallMessage.innerHTML =
                "All environmental parameters are within safe limits.";

            greenLamp.classList.add("active");

            document.getElementById("towerText").innerHTML =
                "GREEN - Normal Condition";

        }
        else if (level === "WARNING") {

            overall.classList.add("warning");

            overallText.innerHTML = "WARNING";

            overallMessage.innerHTML =
                "One or more sensors crossed the warning threshold.";

            yellowLamp.classList.add("active");

            document.getElementById("towerText").innerHTML =
                "YELLOW - Warning Condition";

        }
        else {

            overall.classList.add("danger");

            overallText.innerHTML = "CRITICAL";

            overallMessage.innerHTML =
                "Critical environmental condition detected.";

            redLamp.classList.add("active");

            document.getElementById("towerText").innerHTML =
                "RED - Critical Condition";

        }

    }
    catch(err){

        console.log(err);

    }

}

setInterval(updateStatus,1000);

updateStatus();
// ================= SENSOR CARD STATUS =================

function updateSensorCards(data){

    updateCard("pm1Card", data.pm1, 50, 100);
    updateCard("pm25Card", data.pm25, 35, 75);
    updateCard("pm10Card", data.pm10, 80, 150);
    updateCard("noiseCard", data.noise, 50, 60);
    updateCard("tempCard", data.temperature, 35, 42);
    updateCard("humidityCard", data.humidity, 65, 80);

    // Light sensor (low value is bad)
    updateLightCard("lightCard", data.light);

}

function updateCard(cardId, value, warning, critical){

    value = Number(value);

    const card = document.getElementById(cardId);
    const badge = card.querySelector(".status");

    card.classList.remove("safe","warning","danger");
    badge.classList.remove("green","yellow","red");

    if(value >= critical){

        card.classList.add("danger");
        badge.classList.add("red");
        badge.textContent = "CRITICAL";

    }
    else if(value >= warning){

        card.classList.add("warning");
        badge.classList.add("yellow");
        badge.textContent = "WARNING";

    }
    else{

        card.classList.add("safe");
        badge.classList.add("green");
        badge.textContent = "SAFE";

    }

}

function updateLightCard(cardId, value){

    value = Number(value);

    const card = document.getElementById(cardId);
    const badge = card.querySelector(".status");

    card.classList.remove("safe","warning","danger");
    badge.classList.remove("green","yellow","red");

    // If sensor is disconnected or value is invalid
    if (isNaN(value) || value <= 0) {
        card.classList.add("safe");
        badge.classList.add("green");
        badge.textContent = "SAFE";
        return;
    }

    // Low light is dangerous
    if (value < 80) {

        card.classList.add("danger");
        badge.classList.add("red");
        badge.textContent = "CRITICAL";

    }
    else if (value < 150) {

        card.classList.add("warning");
        badge.classList.add("yellow");
        badge.textContent = "WARNING";

    }
    else {

        card.classList.add("safe");
        badge.classList.add("green");
        badge.textContent = "SAFE";

    }

}