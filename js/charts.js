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

function getStatus(sensor, value){

    value = Number(value);

    switch(sensor){

        case "PM1.0":
            if(value >= 100) return "CRITICAL";
            if(value >= 50) return "WARNING";
            return "SAFE";

        case "PM2.5":
            if(value >= 75) return "CRITICAL";
            if(value >= 35) return "WARNING";
            return "SAFE";

        case "PM10":
            if(value >= 150) return "CRITICAL";
            if(value >= 80) return "WARNING";
            return "SAFE";

        case "Noise":
            if(value >= 90) return "CRITICAL";
            if(value >= 75) return "WARNING";
            return "SAFE";

        case "Temperature":
            if(value >= 40) return "CRITICAL";
            if(value >= 35) return "WARNING";
            return "SAFE";

        case "Humidity":
            if(value >= 85) return "CRITICAL";
            if(value >= 70) return "WARNING";
            return "SAFE";

        case "Light":
            if(value < 80) return "CRITICAL";
            if(value < 150) return "WARNING";
            return "SAFE";

        default:
            return "SAFE";
    }

}

function createChart(canvasId,label,color,maxY){

    return new Chart(document.getElementById(canvasId),{

        type:"line",

        data:{
            labels:[],
            datasets:[{
                label:label,
                data:[],
                borderColor:color,
                backgroundColor:color,
                borderWidth:2,
                fill:false,
                tension:0.4,
                pointRadius:4,
                pointHoverRadius:7
            }]
        },

        options:{

            responsive:true,
            maintainAspectRatio:false,
            animation:false,

            interaction:{
                mode:"nearest",
                intersect:true
            },

            onClick(event,elements,chart){

                if(elements.length===0) return;

                const index=elements[0].index;

                const sensor=chart.data.datasets[0].label;

                const value=chart.data.datasets[0].data[index];

                const time=chart.data.labels[index];

                const status=getStatus(sensor,value);

                alert(
`${sensor}

Value : ${Number(value).toFixed(1)}

Status : ${status}

Time : ${time}

Date : ${new Date().toLocaleDateString("en-GB")}`
                );

            },

            plugins:{

                legend:{
                    display:false
                },

                tooltip:{

                    enabled:true,

                    callbacks:{

                        title:function(context){

                            return "Time : "+context[0].label;

                        },

                        label:function(context){

                            const sensor=context.dataset.label;

                            const value=Number(context.raw).toFixed(1);

                            const status=getStatus(sensor,value);

                            return[
                                "Value : "+value,
                                "Status : "+status,
                                "Date : "+new Date().toLocaleDateString("en-GB")
                            ];

                        }

                    }

                }

            },

            scales:{

                x:{
                    ticks:{
                        color:"white",
                        maxTicksLimit:6
                    },
                    grid:{
                        color:"#444"
                    }
                },

                y:{
                    min:0,
                    max:maxY,
                    ticks:{
                        color:"white"
                    },
                    grid:{
                        color:"#444"
                    }
                }

            }

        }

    });

}
// ================= CREATE ALL CHARTS =================

const pm1Chart = createChart(
    "pm1Chart",
    "PM1.0",
    "#00e676",
    200
);

const pm25Chart = createChart(
    "pm25Chart",
    "PM2.5",
    "#00bcd4",
    200
);

const pm10Chart = createChart(
    "pm10Chart",
    "PM10",
    "#ff9800",
    300
);

const noiseChart = createChart(
    "noiseChart",
    "Noise",
    "#ff5252",
    120
);

const tempChart = createChart(
    "tempChart",
    "Temperature",
    "#42a5f5",
    60
);

const humidityChart = createChart(
    "humidityChart",
    "Humidity",
    "#ab47bc",
    100
);

const lightChart = createChart(
    "lightChart",
    "Light",
    "#ffd600",
    60000
);
// ================= UPDATE CHART =================

function updateChart(chart, value) {

    value = Number(value).toFixed(1);

    if (chart.data.labels.length >= maxPoints) {

        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();

    }

    chart.data.labels.push(getTime());

    chart.data.datasets[0].data.push(Number(value));

    chart.update();

}