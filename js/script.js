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


// حالت روشن / تاریک
themeButton.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    themeButton.textContent =
        document.body.classList.contains("light-mode")
            ? "🌙"
            : "☀️";

});


// باز کردن فرم ثبت آگهی
addButton.addEventListener("click", function () {
    formOverlay.style.display = "flex";
});


// بستن فرم
closeForm.addEventListener("click", function () {
    formOverlay.style.display = "none";
});


// بستن با کلیک بیرون
formOverlay.addEventListener("click", function (event) {

    if (event.target === formOverlay) {
        formOverlay.style.display = "none";
    }

});


// نمایش آگهی‌ها
async function loadListings() {

    const { data, error } = await supabaseClient
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
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
        product.setAttribute("data-name", item.item_name);

        product.innerHTML = `
            <h3>${item.item_name}</h3>
            <p>${item.description}</p>
            <strong>${item.price} ${item.value_type}</strong>
            <button class="buy-button">
                مشاهده آگهی
            </button>
        `;

        products.appendChild(product);

    });

}


// ثبت آگهی
