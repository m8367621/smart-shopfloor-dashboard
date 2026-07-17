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

let previousStatus = {
    pm1: "",
    pm25: "",
    pm10: "",
    noise: "",
    temperature: "",
    humidity: "",
    light: ""
};

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

        // ================= RECENT SENSOR ALERTS =================

        const container = document.getElementById("alertsContainer");

        container.innerHTML = "";

        if (data.esp32 !== "Connected") {

            container.innerHTML = `
                <div class="no-data">
                    ⚠ No data found.<br>
                    Please check whether the ESP32 is connected.
                </div>
            `;

        } else {

            const saved = JSON.parse(localStorage.getItem("shopfloorSettings")) || [
            50,100,
            60,120,
            100,200,
            80,100,
            35,45,
            80,90,
            500,1000
            ];

            checkAlert("pm1","PM1.0",getSensorStatus(data.pm1,Number(saved[0]),Number(saved[1])));

            checkAlert("pm25","PM2.5",getSensorStatus(data.pm25,Number(saved[2]),Number(saved[3])));

            checkAlert("pm10","PM10",getSensorStatus(data.pm10,Number(saved[4]),Number(saved[5])));

            checkAlert("noise","Noise",getSensorStatus(data.noise,Number(saved[6]),Number(saved[7])));

            checkAlert("temperature","Temperature",getSensorStatus(data.temperature,Number(saved[8]),Number(saved[9])));

            checkAlert("humidity","Humidity",getSensorStatus(data.humidity,Number(saved[10]),Number(saved[11])));

            checkAlert("light","Ambient Light",getSensorStatus(data.light,Number(saved[12]),Number(saved[13]),true));
        }

        // ================= LIVE CHARTS =================

        updateChart(pm1Chart, data.pm1);
        updateChart(pm25Chart, data.pm25);
        updateChart(pm10Chart, data.pm10);
        updateChart(noiseChart, data.noise);
        updateChart(tempChart, data.temperature);
        updateChart(humidityChart, data.humidity);
        updateChart(lightChart, data.light);
        // ================= OVERALL SAFETY =================


    }
    catch(err){

        console.log(err);

    }

}

setInterval(updateStatus,1000);

updateStatus();
// ================= SENSOR CARD STATUS =================

function updateSensorCards(data){

    const settings = JSON.parse(localStorage.getItem("shopfloorSettings")) || {

        pm1Warning:50,
        pm1Danger:100,

        pm25Warning:60,
        pm25Danger:120,

        pm10Warning:100,
        pm10Danger:200,

        noiseWarning:80,
        noiseDanger:100,

        tempWarning:35,
        tempDanger:45,

        humidityWarning:80,
        humidityDanger:90,

        lightWarning:500,
        lightDanger:1000

    };

    updateCard("pm1Card", data.pm1,
        Number(settings.pm1Warning),
        Number(settings.pm1Danger));

    updateCard("pm25Card", data.pm25,
        Number(settings.pm25Warning),
        Number(settings.pm25Danger));

    updateCard("pm10Card", data.pm10,
        Number(settings.pm10Warning),
        Number(settings.pm10Danger));

    updateCard("noiseCard", data.noise,
        Number(settings.noiseWarning),
        Number(settings.noiseDanger));

    updateCard("tempCard", data.temperature,
        Number(settings.tempWarning),
        Number(settings.tempDanger));

    updateCard("humidityCard", data.humidity,
        Number(settings.humidityWarning),
        Number(settings.humidityDanger));

    updateLightCard(
        "lightCard",
        data.light,
        Number(settings.lightWarning),
        Number(settings.lightDanger)
    );
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

function updateLightCard(cardId, value, warning, danger){

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

    if (value < danger) {

    card.classList.add("danger");
    badge.classList.add("red");
    badge.textContent = "CRITICAL";

    }
    else if (value < warning) {

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
function getSensorStatus(value, warning, critical, reverse = false){

    value = Number(value);

    if(isNaN(value)) return "SAFE";

    if(reverse){

        if(value <= critical) return "CRITICAL";
        if(value <= warning) return "WARNING";
        return "SAFE";

    }else{

        if(value >= critical) return "CRITICAL";
        if(value >= warning) return "WARNING";
        return "SAFE";

    }

}

function addAlert(sensor, status){

    const container = document.getElementById("alertsContainer");

    const time = new Date().toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:true
    });

    let css = "alert-safe";

    if(status === "WARNING"){
        css = "alert-warning";
    }
    else if(status === "CRITICAL"){
        css = "alert-danger";
    }

    container.innerHTML += `
        <div class="alert-item ${css}">
            <span><b>${sensor}</b> : ${status}</span>
            <span class="alert-time">${time}</span>
        </div>
    `;
}
function checkAlert(sensorKey, sensorName, status){

    if(previousStatus[sensorKey] !== status){

        previousStatus[sensorKey] = status;

        addAlert(sensorName, status);

    }

}