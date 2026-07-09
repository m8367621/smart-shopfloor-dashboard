// Date Filter

const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const reportType = document.getElementById("reportType");

reportType.addEventListener("change", function () {

    if (this.value === "Today") {

        const today = new Date().toISOString().split("T")[0];

        fromDate.value = today;
        toDate.value = today;
    }

});

// Search

const searchBox = document.querySelector('input[type="text"]');

searchBox.addEventListener("keyup", function () {

    const filter = this.value.toLowerCase();

    const rows = document.querySelectorAll(".history-table tbody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(filter)
                ? ""
                : "none";

    });

});
// ================= Excel Download =================

document.getElementById("excelBtn").addEventListener("click", function () {

    const table = document.querySelector(".history-table table");

    const workbook = XLSX.utils.table_to_book(table, {
        sheet: "Sensor History"
    });

    XLSX.writeFile(workbook, "Smart_Shopfloor_History.xlsx");

});
document.getElementById("pdfBtn").addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica","bold");
    doc.setFontSize(18);
    doc.text("VEL TECH RANGARAJAN DR. SAGUNTHALA", 20, 20);
    doc.text("R&D INSTITUTE OF SCIENCE AND TECHNOLOGY", 20, 30);

    doc.setFontSize(16);
    doc.text("Smart Shopfloor Environment Monitoring System", 20, 45);

    // Report Date
    doc.setFontSize(11);
    doc.setFont("helvetica","normal");

    const now = new Date();

    doc.text("Report Generated : " + now.toLocaleString(),20,60);

    doc.text("Report Type : Sensor History",20,70);

    doc.line(20,75,190,75);

    let y=90;

    doc.setFont("helvetica","bold");

    doc.text("Date",20,y);
    doc.text("Time",45,y);
    doc.text("Status",170,y);

    y+=10;

    doc.setFont("helvetica","normal");

    const rows=document.querySelectorAll(".history-table tbody tr");

    rows.forEach(row=>{

        const col=row.querySelectorAll("td");

        doc.text(col[0].innerText,20,y);

        doc.text(col[1].innerText,45,y);

        doc.text(col[9].innerText,170,y);

        y+=10;

    });

    doc.line(20,y+5,190,y+5);

    doc.text("Prepared by : Smart Shopfloor Dashboard",20,y+20);

    doc.save("Smart_Shopfloor_Report.pdf");

});