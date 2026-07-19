// =====================
// GLOBAL THEME MANAGER
// =====================

// Apply saved theme when page loads
(function () {

    const savedTheme = localStorage.getItem("theme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    window.addEventListener("DOMContentLoaded", function () {

        const icon = document.getElementById("themeIcon");

        if (icon) {
            icon.innerHTML = savedTheme === "light" ? "☀️" : "🌙";
        }

    });

})();

// Toggle Theme
function toggleTheme() {

    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");

    localStorage.setItem("theme", isLight ? "light" : "dark");

    const icon = document.getElementById("themeIcon");

    if (icon) {
        icon.innerHTML = isLight ? "☀️" : "🌙";
    }
}