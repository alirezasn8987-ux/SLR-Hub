const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeButton.textContent = "🌙";
    } else {
        themeButton.textContent = "☀️";
    }

});


const addButton = document.getElementById("addButton");
const formOverlay = document.getElementById("formOverlay");
const closeForm = document.getElementById("closeForm");
const itemForm = document.getElementById("itemForm");
const products = document.getElementById("products");


addButton.addEventListener("click", function () {

    formOverlay.style.display = "flex";

});


closeForm.addEventListener("click", function () {

    formOverlay.style.display = "none";

});


formOverlay.addEventListener("click", function (event) {

    if (event.target === formOverlay) {
        formOverlay.style.display = "none";
    }

});


itemForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("itemName").value;
    const description = document.getElementById("itemDescription").value;
    const valueType = document.getElementById("valueType").value;
    const price = document.getElementById("itemPrice").value;

    const empty = document.querySelector(".empty");

    if (empty) {
        empty.remove();
    }


    const product = document.createElement("div");

    product.className = "product";

    product.setAttribute("data-name", name);


    product.innerHTML = `
        <div class="product-icon">
            ⛏️
        </div>

        <h2>${name}</h2>

        <p>${description}</p>

        <strong>
            ${price} ${valueType}
        </strong>

        <button class="buy-button">
            مشاهده آگهی
        </button>
    `;


    products.appendChild(product);

    itemForm.reset();

    formOverlay.style.display = "none";

});


const search = document.getElementById("search");


search.addEventListener("input", function () {

    const text = search.value.toLowerCase();

    const items = document.querySelectorAll(".product");


    items.forEach(function (item) {

        const name = item
            .getAttribute("data-name")
            .toLowerCase();

        if (name.includes(text)) {

            item.style.display = "block";

        } else {

            item.style.display = "none";

        }

    });

});
