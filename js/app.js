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

    try {

        const response = await fetch("/api/data");
        const data = await response.json();

        document.getElementById("espStatus").textContent = data.esp32;
        document.getElementById("wifiStatus").textContent = data.wifi;
        document.getElementById("cloudStatus").textContent = data.cloud;

    } catch (error) {

        document.getElementById("espStatus").textContent = "Not Connected";
        document.getElementById("wifiStatus").textContent = "Not Connected";
        document.getElementById("cloudStatus").textContent = "Offline";

    }

}

setInterval(updateStatus, 1000);
updateStatus();