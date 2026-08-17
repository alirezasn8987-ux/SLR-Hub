const SUPABASE_URL = "https://kgjiviwwwrwzpmektoh.supabase.co";
const SUPABASE_KEY = "sb_publishable_inLD9v_USGu93C3-JwZ7CA_mLnNBFUw";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const themeButton = document.getElementById("themeButton");
const addButton = document.getElementById("addButton");
const viewButton = document.getElementById("viewButton");
const formOverlay = document.getElementById("formOverlay");
const closeForm = document.getElementById("closeForm");
const itemForm = document.getElementById("itemForm");
const products = document.getElementById("products");
const search = document.getElementById("search");

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    themeButton.textContent =
        document.body.classList.contains("light-mode")
            ? "🌙"
            : "☀️";
});

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

async function loadListings() {

    const { data, error } = await supabaseClient
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("خطا در دریافت آگهی‌ها:", error);
        return;
    }

    products.innerHTML = "";

    if (!data || data.length === 0) {
        products.innerHTML = `
            <div class="empty">
                هنوز آگهی‌ای ثبت نشده است.
            </div>
        `;
        return;
    }

    data.forEach(function (item) {

        const product = document.createElement("div");

        product.className = "product";

        product.innerHTML = `
            <h3>${item.نام_مورد || ""}</h3>
            <p>${item.توضیحات || ""}</p>
            <strong>${item.قیمت || 0} ${item.نوع_مقدار || ""}</strong>
            ${
                item.آدرس_تصویر
                ? `<img src="${item.آدرس_تصویر}" alt="${item.نام_مورد || ""}">`
                : ""
            }
            <button class="buy-button">
                مشاهده آگهی
            </button>
        `;

        products.appendChild(product);
    });
}


// ثبت آگهی
itemForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const itemName = document.getElementById("itemName").value.trim();
    const itemDescription = document.getElementById("itemDescription").value.trim();
    const valueType = document.getElementById("valueType").value;
    const itemPrice = document.getElementById("itemPrice").value;
    const itemImage = document.getElementById("itemImage").value.trim();

    if (!itemName || !itemDescription || !valueType || !itemPrice) {
        alert("لطفاً همه قسمت‌های ضروری را پر کن.");
        return;
    }

    const { error } = await supabaseClient
        .from("listings")
        .insert({
            "نام_مورد": itemName,
            "توضیحات": itemDescription,
            "نوع_مقدار": valueType,
            "قیمت": Number(itemPrice),
            "آدرس_تصویر": itemImage || null
        });

    if (error) {
        console.error("خطا در ثبت آگهی:", error);
        alert("ثبت آگهی انجام نشد: " + error.message);
        return;
    }

    alert("آگهی با موفقیت ثبت شد! 🎉");

    itemForm.reset();
    formOverlay.style.display = "none";

    loadListings();
});


// جستجوی آگهی
search.addEventListener("input", function () {

    const text = search.value.trim().toLowerCase();

    const productsList = document.querySelectorAll(".product");

    productsList.forEach(function (product) {

        const name = product
            .querySelector("h3")
            .textContent
            .toLowerCase();

        product.style.display =
            name.includes(text)
                ? ""
                : "none";
    });
});


// بارگذاری اولیه
loadListings();
