// ================= LIVE CHARTS =================

const maxPoints = 20;

function getTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

function createChart(canvasId, label, color, maxY) {

    return new Chart(document.getElementById(canvasId), {

        type: "line",

        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: color,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 3
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,
            animation: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    enabled: true,

                    callbacks: {

                        title: function(context){

                            return "Time : " + context[0].label;

                        },

                        label: function(context){

                            const value = Number(context.raw).toFixed(1);

                            const sensor = context.dataset.label;

                            let warning = 0;
                            let critical = 0;

                            if(sensor === "PM1.0"){
                                warning = 50;
                                critical = 100;
                            }
                            else if(sensor === "PM2.5"){
                                warning = 35;
                                critical = 75;
                            }
                            else if(sensor === "PM10"){
                                warning = 80;
                                critical = 150;
                            }
                            else if(sensor === "Noise"){
                                warning = 60;
                                critical = 70;
                            }
                            else if(sensor === "Temperature"){
                                warning = 35;
                                critical = 40;
                            }
                            else if(sensor === "Humidity"){
                                warning = 70;
                                critical = 85;
                            }

                            let status = "SAFE";

                            if(sensor === "Light"){

                                if(value < 80)
                                    status = "CRITICAL";
                                else if(value < 150)
                                    status = "WARNING";

                            }
                            else{

                                if(value >= critical)
                                    status = "CRITICAL";
                                else if(value >= warning)
                                    status = "WARNING";

                            }

                            return [
                                "Value : " + value,
                                "Status : " + status,
                                "Date : " + new Date().toLocaleDateString("en-GB")
                            ];

                        }

                    }

                }

            },

            scales: {

                x: {
                    ticks: {
                        color: "white",
                        maxTicksLimit: 6
                    },
                    grid: {
                        color: "#444"
                    }
                },

                y: {
                    min: 0,
                    max: maxY,
                    ticks: {
                        color: "white"
                    },
                    grid: {
                        color: "#444"
                    }
                }

            }

        }

    });

}

// ================= CREATE ALL CHARTS =================

const pm1Chart = createChart("pm1Chart","PM1.0","#00e676",200);

const pm25Chart = createChart("pm25Chart","PM2.5","#00bcd4",200);

const pm10Chart = createChart("pm10Chart","PM10","#ff9800",300);

const noiseChart = createChart("noiseChart","Noise","#ff5252",120);

const tempChart = createChart("tempChart","Temperature","#42a5f5",60);

const humidityChart = createChart("humidityChart","Humidity","#ab47bc",100);

const lightChart = createChart("lightChart","Light","#ffd600",60000);

// ================= UPDATE CHART =================

function updateChart(chart, value) {

    if (chart.data.labels.length >= maxPoints) {

        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();

    }

    chart.data.labels.push(getTime());

    chart.data.datasets[0].data.push(value);

    chart.update();

}