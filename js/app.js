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

async function updateStatus() {

    const response = await fetch("/api/data");
    const data = await response.json();

    // Status
    document.getElementById("espStatus").textContent = data.esp32;
    document.getElementById("wifiStatus").textContent = data.wifi;
    document.getElementById("cloudStatus").textContent = data.cloud;

    // Sensor values
    document.getElementById("pm1Value").textContent = data.pm1;
    document.getElementById("pm25Value").textContent = data.pm25;
    document.getElementById("pm10Value").textContent = data.pm10;
    document.getElementById("noiseValue").textContent = data.noise;
    document.getElementById("tempValue").textContent = data.temperature;
    document.getElementById("humidityValue").textContent = data.humidity;
    document.getElementById("lightValue").textContent = data.light;
}

setInterval(updateStatus, 1000);
updateStatus();