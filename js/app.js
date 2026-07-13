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

        // ================= STATUS =================

        document.getElementById("espStatus").textContent = data.esp32;
        document.getElementById("wifiStatus").textContent = data.wifi;
        document.getElementById("cloudStatus").textContent = data.cloud;

        // ================= SENSOR VALUES =================

        document.getElementById("pm1Value").textContent = data.pm1;
        document.getElementById("pm25Value").textContent = data.pm25;
        document.getElementById("pm10Value").textContent = data.pm10;
        document.getElementById("noiseValue").textContent = data.noise;
        document.getElementById("tempValue").textContent = data.temperature;
        document.getElementById("humidityValue").textContent = data.humidity;
        document.getElementById("lightValue").textContent = data.light;

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

        // PM1.0
        if(data.pm1 > 100){
            level = "CRITICAL";
        }
        else if(data.pm1 > 50 && level!="CRITICAL"){
            level = "WARNING";
        }

        // PM2.5
        if(data.pm25 > 75){
            level = "CRITICAL";
        }
        else if(data.pm25 > 35 && level=="SAFE"){
            level = "WARNING";
        }

        // PM10
        if(data.pm10 > 150){
            level = "CRITICAL";
        }
        else if(data.pm10 > 80 && level=="SAFE"){
            level = "WARNING";
        }

        // Noise
        if(data.noise > 90){
            level = "CRITICAL";
        }
        else if(data.noise > 75 && level=="SAFE"){
            level = "WARNING";
        }

        // Temperature
        if(data.temperature > 40){
            level = "CRITICAL";
        }
        else if(data.temperature > 35 && level=="SAFE"){
            level = "WARNING";
        }

        // Humidity
        if(data.humidity > 80){
            level = "WARNING";
        }

        // Light
        if(data.light < 150){
            level = "WARNING";
        }

        // ================= DISPLAY =================

        const overall=document.getElementById("overallStatus");
        const text=document.getElementById("overallText");
        const msg=document.getElementById("overallMessage");

        overall.className="overall-status";

        greenLamp.classList.remove("active");
        yellowLamp.classList.remove("active");
        redLamp.classList.remove("active");

        if(level==="SAFE"){

            overall.classList.add("safe");

            text.innerHTML="SAFE";

            msg.innerHTML="All environmental parameters are within safe limits.";

            greenLamp.classList.add("active");

            document.getElementById("towerText").innerHTML="GREEN - Normal Condition";

        }

        else if(level==="WARNING"){

            overall.classList.add("warning");

            text.innerHTML="WARNING";

            msg.innerHTML="One or more sensor values are approaching unsafe limits.";

            yellowLamp.classList.add("active");

            document.getElementById("towerText").innerHTML="YELLOW - Warning Condition";

        }

        else{

            overall.classList.add("danger");

            text.innerHTML="CRITICAL";

            msg.innerHTML="Unsafe environment detected. Immediate attention required.";

            redLamp.classList.add("active");

            document.getElementById("towerText").innerHTML="RED - Critical Condition";
            
        }

        updateSensorCards(data);
    } catch (err) {

        console.log(err);

    }

}
function updateSensorCards(data){

    updateCard("pm1Card", data.pm1, 50, 100);
    updateCard("pm25Card", data.pm25, 35, 75);
    updateCard("pm10Card", data.pm10, 80, 150);
    updateCard("noiseCard", data.noise, 75, 90);
    updateCard("tempCard", data.temperature, 35, 40);
    updateCard("humidityCard", data.humidity, 70, 80);
    updateCard("lightCard", data.light, 150, 80, true);

}

function updateCard(cardId,value,warning,danger,reverse=false){

    const card=document.getElementById(cardId);
    const badge=card.querySelector(".status");

    card.classList.remove("safe","warning","danger");
    badge.classList.remove("green","yellow","red");

    let state="SAFE";

    if(!reverse){

        if(value>=danger){
            state="CRITICAL";
        }
        else if(value>=warning){
            state="WARNING";
        }

    }else{

        if(value<=danger){
            state="CRITICAL";
        }
        else if(value<=warning){
            state="WARNING";
        }

    }

    if(state==="SAFE"){

        card.classList.add("safe");
        badge.classList.add("green");
        badge.innerHTML="SAFE";

    }
    else if(state==="WARNING"){

        card.classList.add("warning");
        badge.classList.add("yellow");
        badge.innerHTML="WARNING";

    }
    else{

        card.classList.add("danger");
        badge.classList.add("red");
        badge.innerHTML="CRITICAL";

    }

}
setInterval(updateStatus,1000);

updateStatus();