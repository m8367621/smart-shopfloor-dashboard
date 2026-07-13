// ---------- Live Charts ----------

const labels = [];
const maxPoints = 20;

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function createChart(canvasId, label, color) {

    return new Chart(document.getElementById(canvasId), {

        type: "line",

        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: color,
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
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
                        color: "white"
                    }
                },

                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "white"
                    }
                }

            }

        }

    });

}

// -------- Create Charts --------

const pm1Chart = createChart("pm1Chart","PM1.0","#00e676");

const pm25Chart = createChart("pm25Chart","PM2.5","#03a9f4");

const pm10Chart = createChart("pm10Chart","PM10","#ff9800");

const noiseChart = createChart("noiseChart","Noise","#ff5252");

const tempChart = createChart("tempChart","Temperature","#29b6f6");

const humidityChart = createChart("humidityChart","Humidity","#ab47bc");

const lightChart = createChart("lightChart","Light","#ffd600");


// -------- Update Chart --------

function updateChart(chart,value){

    if(chart.data.labels.length>=maxPoints){

        chart.data.labels.shift();

        chart.data.datasets[0].data.shift();

    }

    chart.data.labels.push(getTime());

    chart.data.datasets[0].data.push(value);

    chart.update();

}