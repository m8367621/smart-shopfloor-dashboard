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