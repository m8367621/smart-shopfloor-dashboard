const labels = ["10:00","10:05","10:10","10:15","10:20","10:25","10:30"];

function createChart(canvasId, label, data, color){

    new Chart(document.getElementById(canvasId),{

        type:"line",

        data:{
            labels:labels,
            datasets:[{
                label:label,
                data:data,
                borderColor:color,
                backgroundColor:color,
                fill:false,
                tension:0.4,
                pointRadius:4
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false,

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{
                x:{
                    ticks:{
                        color:"white"
                    }
                },

                y:{
                    ticks:{
                        color:"white"
                    }
                }
            }
        }

    });

}

createChart("pm1Chart","PM1.0",[8,10,9,12,11,13,12],"#00e676");

createChart("pm25Chart","PM2.5",[22,24,23,25,28,26,27],"#00bcd4");

createChart("pm10Chart","PM10",[35,38,40,42,45,44,43],"#ff9800");

createChart("noiseChart","Noise",[60,63,66,68,70,72,71],"#ff5252");

createChart("tempChart","Temperature",[28,29,30,31,30,29,30],"#42a5f5");

createChart("humidityChart","Humidity",[55,57,56,58,60,59,58],"#ab47bc");

createChart("lightChart","Light",[350,380,420,450,430,470,460],"#ffd600");

