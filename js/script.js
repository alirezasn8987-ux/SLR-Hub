const SUPABASE_URL = "https://kgjiviwwwrkwzpmektoh.supabase.co";
const SUPABASE_KEY = "sb_publishable_inLD9v_USGu93C3-JwZ7CA_mLnNBFUw";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const themeButton = document.getElementById("themeButton");
const addAdButton = document.getElementById("addAdButton");
const formOverlay = document.getElementById("formOverlay");
const closeForm = document.getElementById("closeForm");
const itemForm = document.getElementById("itemForm");
const products = document.getElementById("products");
const search = document.getElementById("search");

if (themeButton) {
    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");
        themeButton.textContent =
            document.body.classList.contains("light-mode")
                ? "🌙"
                : "☀️";
    });
}

if (addAdButton) {
    addAdButton.addEventListener("click", function () {
        formOverlay.style.display = "flex";
    });
}

if (closeForm) {
    closeForm.addEventListener("click", function () {
        formOverlay.style.display = "none";
    });
}

if (formOverlay) {
    formOverlay.addEventListener("click", function (event) {
        if (event.target === formOverlay) {
            formOverlay.style.display = "none";
        }
    });
}

async function loadListings() {
    const { data, error } = await supabaseClient
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("خطای دریافت آگهی‌ها:", error);
        products.innerHTML = `
            <div class="empty">
                خطا در دریافت آگهی‌ها
            </div>
        `;
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
            String(item.price || 0) + " " +
            String(item.value_type || "");

        const button = document.createElement("button");
        button.className = "buy-button";
        button.textContent = "مشاهده آگهی";

        button.addEventListener("click", function () {
            alert(
                "نام: " + (item.item_name || "") +
                "\nتوضیحات: " + (item.description || "") +
                "\nقیمت: " + (item.price || 0) +
                " " + (item.value_type || "")
            );
        });

        product.appendChild(title);
        product.appendChild(description);
        product.appendChild(price);
        product.appendChild(button);

        products.appendChild(product);
    });
}

if (itemForm) {
    itemForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const itemName =
            document.getElementById("itemName").value.trim();

        const itemDescription =
            document.getElementById("itemDescription").value.trim();

        const valueType =
            document.getElementById("valueType").value;

        const itemPrice =
            document.getElementById("itemPrice").value;

        const itemImage =
            document.getElementById("itemImage").value.trim();

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
            console.error("خطای ثبت:", error);
            alert(
                "ثبت آگهی انجام نشد:\n" +
                error.message
            );
            return;
        }

        alert("آگهی با موفقیت ثبت شد! 🎉");

        itemForm.reset();
        formOverlay.style.display = "none";

        await loadListings();
    });
}

if (search) {
    search.addEventListener("input", function () {
        const text =
            search.value.trim().toLowerCase();

        document.querySelectorAll(".product").forEach(function (product) {
            const title = product.querySelector("h3");

            if (!title) return;

            product.style.display =
                title.textContent.toLowerCase().includes(text)
                    ? ""
                    : "none";
        });
    });
}

window.addEventListener("load", async function () {
    loadListings();
});

const messagesButton = document.getElementById("messagesButton");
const messagesOverlay = document.getElementById("messagesOverlay");
const closeMessages = document.getElementById("closeMessages");

if (messagesButton && messagesOverlay) {
    messagesButton.addEventListener("click", function () {
        messagesOverlay.style.display = "flex";
    });
}

if (closeMessages && messagesOverlay) {
    closeMessages.addEventListener("click", function () {
        messagesOverlay.style.display = "none";
    });
}

if (messagesOverlay) {
    messagesOverlay.addEventListener("click", function (event) {
        if (event.target === messagesOverlay) {
            messagesOverlay.style.display = "none";
        }
    });
}

// ================================
// SLR-Hub Authentication
// ================================

const authOverlay = document.getElementById("authOverlay");
const closeAuth = document.getElementById("closeAuth");

const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const gameUsername = document.getElementById("gameUsername");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const authMessage = document.getElementById("authMessage");

async function createProfile(user) {
    if (!user) return;

    const minecraftUsername =
        gameUsername ? gameUsername.value.trim() : "";

    if (!minecraftUsername) {
        return;
    }

    const { error } = await supabaseClient
        .from("profiles")
        .upsert({
            id: user.id,
            minecraft_username: minecraftUsername
        });

    if (error) {
        console.error("Profile error:", error);
    }
}

if (signupBtn) {
    signupBtn.addEventListener("click", async function () {

        const email = authEmail.value.trim();
        const password = authPassword.value;
        const minecraftUsername = gameUsername.value.trim();

        if (!email || !password || !minecraftUsername) {
            authMessage.textContent =
                "لطفاً ایمیل، رمز عبور و نام Minecraft را وارد کنید.";
            return;
        }

        if (password.length < 6) {
            authMessage.textContent =
                "رمز عبور باید حداقل ۶ کاراکتر باشد.";
            return;
        }

        authMessage.textContent = "در حال ثبت‌نام...";

        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        minecraft_username: minecraftUsername
                    }
                }
            });

        if (error) {
            console.error("Signup error:", error);
            authMessage.textContent =
                "ثبت‌نام انجام نشد: " + error.message;
            return;
        }

        if (data.session && data.user) {

            const { error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .upsert({
                        id: data.user.id,
                        minecraft_username: minecraftUsername
                    });

            if (profileError) {
                console.error("Profile error:", profileError);
                authMessage.textContent =
                    "حساب ساخته شد، اما ذخیره نام Minecraft انجام نشد.";
                return;
            }

            authMessage.textContent =
                "ثبت‌نام با موفقیت انجام شد! 🎉";

        } else {

            authMessage.textContent =
                "حساب ساخته شد! ایمیل خود را تأیید کنید، سپس وارد شوید. 📧";
        }

        setTimeout(function () {
            authOverlay.style.display = "none";
        }, 1800);
    });
}

if (loginBtn) {
    loginBtn.addEventListener("click", async function () {

        const email = authEmail.value.trim();
        const password = authPassword.value;

        if (!email || !password) {
            authMessage.textContent =
                "ایمیل و رمز عبور را وارد کنید.";
            return;
        }

        authMessage.textContent = "در حال ورود...";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            console.error("Login error:", error);
            authMessage.textContent =
                "ورود انجام نشد: " + error.message;
            return;
        }

        if (data.user) {

            const minecraftUsername =
                data.user.user_metadata?.minecraft_username || "";

            if (minecraftUsername) {

                const { error: profileError } =
                    await supabaseClient
                        .from("profiles")
                        .upsert({
                            id: data.user.id,
                            minecraft_username: minecraftUsername
                        });

                if (profileError) {
                    console.error(
                        "Profile update error:",
                        profileError
                    );
                }
            }
        }

        authMessage.textContent =
            "با موفقیت وارد شدید! 👋";

        setTimeout(function () {
            authOverlay.style.display = "none";
        }, 1000);
    });
}

if (closeAuth) {
    closeAuth.addEventListener("click", function () {
        authOverlay.style.display = "none";
    });
}

supabaseClient.auth.onAuthStateChange(
    async function (event, session) {

        if (session && session.user) {
            console.log("User logged in:", session.user.id);
        }

    }
);
