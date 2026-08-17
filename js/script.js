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
        document.body.classList.contains("light-mode") ? "🌙" : "☀️";
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

        const title = document.createElement("h3");
        title.textContent = item.item_name || "";

        const description = document.createElement("p");
        description.textContent = item.description || "";

        const price = document.createElement("strong");
        price.textContent =
            `${item.price || 0} ${item.value_type || ""}`;

        const button = document.createElement("button");
        button.className = "buy-button";
        button.textContent = "مشاهده آگهی";

        button.addEventListener("click", function () {
            alert(
                `نام: ${item.item_name}\n` +
                `توضیحات: ${item.description}\n` +
                `قیمت: ${item.price} ${item.value_type}`
            );
        });

        product.appendChild(title);
        product.appendChild(description);
        product.appendChild(price);

        if (item.image_url) {
            const image = document.createElement("img");
            image.src = item.image_url;
            image.alt = item.item_name || "تصویر آگهی";
            product.appendChild(image);
        }

        product.appendChild(button);
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
        alert("لطفاً قسمت‌های ضروری را پر کن.");
        return;
    }

    const { error } = await supabaseClient
        .from("listings")
        .insert({
            item_name: itemName,
            description: itemDescription,
            value_type: valueType,
            price: Number(itemPrice),
            image_url: itemImage || null
        });

    if (error) {
        console.error("Supabase error:", error);
        alert("ثبت آگهی انجام نشد: " + error.message);
        return;
    }

    alert("آگهی با موفقیت ثبت شد! 🎉");

    itemForm.reset();
    formOverlay.style.display = "none";

    await loadListings();
});


// جستجو
search.addEventListener("input", function () {
    const text = search.value.trim().toLowerCase();

    document.querySelectorAll(".product").forEach(function (product) {
        const name = product.querySelector("h3").textContent.toLowerCase();

        product.style.display =
            name.includes(text) ? "" : "none";
    });
});


// بارگذاری آگهی‌ها
loadListings();
