function updateClock(){

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString('en-GB');

    document.getElementById("date").innerHTML =
        now.toLocaleDateString('en-GB');

}

setInterval(updateClock,1000);

updateClock();