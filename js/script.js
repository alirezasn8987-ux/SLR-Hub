const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {

    if (document.body.style.backgroundColor === "white") {
        document.body.style.backgroundColor = "#0b1020";
        document.body.style.color = "white";
        themeButton.textContent = "☀️";
    } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "#111111";
        themeButton.textContent = "🌙";
    }

});


const search = document.getElementById("search");
const tools = document.querySelectorAll(".tool");

search.addEventListener("input", function () {

    const text = search.value.toLowerCase();

    tools.forEach(function (tool) {

        const name = tool.getAttribute("data-name").toLowerCase();

        if (name.includes(text)) {
            tool.style.display = "block";
        } else {
            tool.style.display = "none";
        }

    });

});


const calculatorButton = document.getElementById("calculatorButton");

calculatorButton.addEventListener("click", function () {
    window.location.href = "calculator.html";
});
