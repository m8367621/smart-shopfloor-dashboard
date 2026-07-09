const pmChart = new Chart(document.getElementById("pmTrendChart"), {
    type: "line",

    data: {
        labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],

        datasets: [
            {
                label: "PM1.0",
                data: [10, 12, 15, 11, 14, 13],
                borderColor: "#22c55e",
                backgroundColor: "transparent",
                tension: 0.4
            },
            {
                label: "PM2.5",
                data: [20, 24, 28, 25, 27, 30],
                borderColor: "#3b82f6",
                backgroundColor: "transparent",
                tension: 0.4
            },
            {
                label: "PM10",
                data: [35, 40, 45, 42, 48, 50],
                borderColor: "#f59e0b",
                backgroundColor: "transparent",
                tension: 0.4
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },

            y: {
                ticks: {
                    color: "white"
                }
            }
        }
    }
});
// ================= NOISE TREND CHART =================

const noiseChart = new Chart(document.getElementById("noiseTrendChart"), {
    type: "line",

    data: {
        labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],

        datasets: [{
            label: "Noise Level (dB)",
            data: [45, 55, 65, 60, 75, 50],
            borderColor: "#ef4444",
            backgroundColor: "transparent",
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: "#ef4444"
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            },
            title: {
                display: true,
                text: "Noise Trend Analysis",
                color: "white",
                font: {
                    size: 18
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "white"
                },
                title: {
                    display: true,
                    text: "Time",
                    color: "white"
                },
                grid: {
                    color: "rgba(255,255,255,0.1)"
                }
            },

            y: {
                beginAtZero: true,
                ticks: {
                    color: "white"
                },
                title: {
                    display: true,
                    text: "Noise Level (dB)",
                    color: "white"
                },
                grid: {
                    color: "rgba(255,255,255,0.1)"
                }
            }
        }
    }
});
// ================= TEMPERATURE & HUMIDITY TREND CHART =================

const tempHumidityChart = new Chart(document.getElementById("tempHumidityChart"), {
    type: "line",

    data: {
        labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],

        datasets: [
            {
                label: "Temperature (°C)",
                data: [28, 29, 31, 30, 29, 28],
                borderColor: "#f97316",
                backgroundColor: "transparent",
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: "#f97316"
            },
            {
                label: "Humidity (%)",
                data: [68, 65, 60, 58, 62, 66],
                borderColor: "#3b82f6",
                backgroundColor: "transparent",
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: "#3b82f6"
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            },
            title: {
                display: true,
                text: "Temperature & Humidity Trend",
                color: "white"
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "white"
                },
                title: {
                    display: true,
                    text: "Time",
                    color: "white"
                }
            },

            y: {
                beginAtZero: true,
                ticks: {
                    color: "white"
                },
                title: {
                    display: true,
                    text: "Value",
                    color: "white"
                }
            }
        }
    }
});
// ================= AMBIENT LIGHT TREND CHART =================

const lightTrendChart = new Chart(document.getElementById("lightTrendChart"), {
    type: "line",

    data: {
        labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],

        datasets: [{
            label: "Ambient Light (Lux)",
            data: [150, 300, 600, 500, 350, 200],
            borderColor: "#facc15",
            backgroundColor: "transparent",
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: "#facc15"
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            },
            title: {
                display: true,
                text: "Ambient Light Trend",
                color: "white",
                font: {
                    size: 18
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "white"
                },
                title: {
                    display: true,
                    text: "Time",
                    color: "white"
                },
                grid: {
                    color: "rgba(255,255,255,0.1)"
                }
            },

            y: {
                beginAtZero: true,
                ticks: {
                    color: "white"
                },
                title: {
                    display: true,
                    text: "Light Intensity (Lux)",
                    color: "white"
                },
                grid: {
                    color: "rgba(255,255,255,0.1)"
                }
            }
        }
    }
});