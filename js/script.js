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

const listingOverlay =
    document.getElementById("listingOverlay");

const closeListing =
    document.getElementById("closeListing");

const listingDetails =
    document.getElementById("listingDetails");

function getVisitorId() {

    let visitorId =
        localStorage.getItem("sph_shop_visitor_id");

    if (!visitorId) {

        visitorId =
            crypto.randomUUID();

        localStorage.setItem(
            "sph_shop_visitor_id",
            visitorId
        );
    }

    return visitorId;
}

const visitorId = getVisitorId();

console.log("🔥 SPH visitorId:", visitorId);

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

        if (item.image_url) {
            const image = document.createElement("img");
            image.src = item.image_url;
            image.alt = item.item_name || "تصویر آگهی";
            image.className = "product-image";
            product.appendChild(image);
        }

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

            if (!listingOverlay || !listingDetails) {
                return;
            }

            listingDetails.innerHTML = "";

            if (item.image_url) {
                const detailImage =
                    document.createElement("img");

                detailImage.src = item.image_url;
                detailImage.alt =
                    item.item_name || "تصویر آگهی";

                detailImage.className =
                    "listing-detail-image";

                listingDetails.appendChild(detailImage);
            }

            const detailTitle =
                document.createElement("h2");

            detailTitle.className =
                "listing-detail-title";

            detailTitle.textContent =
                item.item_name || "";

            listingDetails.appendChild(detailTitle);

            const detailDescription =
                document.createElement("p");

            detailDescription.className =
                "listing-detail-description";

            detailDescription.textContent =
                item.description || "";

            listingDetails.appendChild(detailDescription);

            const detailPrice =
                document.createElement("div");

            detailPrice.className =
                "listing-detail-price";

            detailPrice.textContent =
                String(item.price || 0) +
                " " +
                String(item.value_type || "");

            listingDetails.appendChild(detailPrice);

            const detailSeller =
                document.createElement("div");

            detailSeller.className =
                "listing-detail-seller";

            detailSeller.textContent =
                "فروشنده: " +
                (item.seller_minecraft_name || "");

            listingDetails.appendChild(detailSeller);

            const messageButton =
                document.createElement("button");

            messageButton.className =
                "listing-message-button";

            messageButton.textContent =
                "💬 پیام به فروشنده";

            messageButton.addEventListener(
                "click",
                function () {

                    const composeOverlay =
                        document.getElementById(
                            "messageComposeOverlay"
                        );

                    const messageInput =
                        document.getElementById(
                            "messageInput"
                        );

                    if (!composeOverlay || !messageInput) {
                        return;
                    }

                    messageInput.value = "";

                    messageInput.placeholder =
                        "پیامتان برای " +
                        (item.seller_minecraft_name || "فروشنده") +
                        " را بنویسید...";

                    composeOverlay.style.display = "flex";

                    messageInput.dataset.receiverName =
                        item.seller_minecraft_name || "";

                    messageInput.dataset.receiverVisitorId =
                        item.seller_visitor_id || "";

                    messageInput.dataset.listingId =
                        item.id || "";
                }
            );

            listingDetails.appendChild(messageButton);

            listingOverlay.style.display = "flex";
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

        console.log("🔥 SUBMIT FORM اجرا شد");

        try {

        const itemName =
            document.getElementById("itemName").value.trim();

        const itemDescription =
            document.getElementById("itemDescription").value.trim();

        const sellerMinecraftName =
            document.getElementById("sellerMinecraftName").value.trim();

        const valueType =
            document.getElementById("valueType").value;

        const itemPrice =
            document.getElementById("itemPrice").value;

        const itemImageInput =
            document.getElementById("itemImage");

        const imageFile =
            itemImageInput.files[0];

        let imageUrl = null;

        if (imageFile) {
            const fileExt =
                imageFile.name.split(".").pop().toLowerCase();

            const fileName =
                Date.now() + "-" +
                Math.random().toString(36).substring(2, 10) +
                "." + fileExt;

            const { error: uploadError } =
                await supabaseClient.storage
                    .from("listing-images")
                    .upload(fileName, imageFile, {
                        contentType: imageFile.type,
                        upsert: false
                    });

            if (uploadError) {
                console.error("خطای آپلود تصویر:", uploadError);
                alert(
                    "آپلود تصویر انجام نشد:\n" +
                    uploadError.message
                );
                return;
            }

            const { data: publicUrlData } =
                supabaseClient.storage
                    .from("listing-images")
                    .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        if (!itemName || !itemDescription || !sellerMinecraftName || !valueType || !itemPrice) {
            alert("لطفاً قسمت‌های ضروری را پر کن.");
            return;
        }

        const { error } = await supabaseClient
            .from("listings")
            .insert({
                item_name: itemName,
                description: itemDescription,
                seller_minecraft_name: sellerMinecraftName,
                seller_visitor_id: visitorId,
                owner_id: visitorId,
                value_type: valueType,
                price: Number(itemPrice),
                image_url: imageUrl
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

        } catch (error) {
            console.error("🔥 خطای کامل ثبت آگهی:", error);
            alert("❌ خطای واقعی ثبت آگهی:\n" + error.message);
        }
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


// ========================================
// SPH SHOP - سیستم پیام‌ها
// ========================================


const messagesButton =
    document.getElementById("messagesButton");

const messagesOverlay =
    document.getElementById("messagesOverlay");

const closeMessages =
    document.getElementById("closeMessages");

const messagesList =
    document.getElementById("messagesList");

const messageComposeOverlay =
    document.getElementById("messageComposeOverlay");

const closeMessageCompose =
    document.getElementById("closeMessageCompose");

const sendMessageButton =
    document.getElementById("sendMessageButton");

let replyMessageId = null;
let replyConversationId = null;


// ========================================
// پیام‌های من
// ========================================

async function loadMyMessages() {

    if (!messagesList) return;

    messagesList.innerHTML = `
        <div class="empty">
            در حال دریافت پیام‌ها...
        </div>
    `;

    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("receiver_id", visitorId)
        .order("created_at", { ascending: true });

    if (error) {

        console.error("خطای دریافت پیام‌ها:", error);

        messagesList.innerHTML = `
            <div class="empty">
                دریافت پیام‌ها انجام نشد.
            </div>
        `;

        return;
    }

    if (!data || data.length === 0) {

        messagesList.innerHTML = `
            <div class="empty">
                هنوز پیامی ندارید.
            </div>
        `;

        return;
    }

    messagesList.innerHTML = "";

    const conversations = {};

    data.forEach(function (message) {

        const key =
            message.conversation_id ||
            String(message.id);

        if (!conversations[key]) {
            conversations[key] = [];
        }

        conversations[key].push(message);
    });

    Object.values(conversations).forEach(function (messages) {

        const conversation =
            document.createElement("div");

        conversation.className =
            "conversation";

        messages.forEach(function (message) {

            const item =
                document.createElement("div");

            item.className =
                "message-item";

            const sender =
                document.createElement("strong");

            sender.textContent =
                message.sender_username
                    ? "پیام از " +
                      message.sender_username
                    : "پیام";

            const text =
                document.createElement("p");

            text.textContent =
                message.message_text || "";

            const date =
                document.createElement("small");

            if (message.created_at) {

                date.textContent =
                    new Date(
                        message.created_at
                    ).toLocaleString("fa-IR");
            }

            const replyButton =
                document.createElement("button");

            replyButton.type = "button";
            replyButton.textContent = "↩️ پاسخ";

            replyButton.className =
                "reply-message-button";

            replyButton.addEventListener(
                "click",
                function () {

                    replyMessageId =
                        message.id;

                    replyConversationId =
                        message.conversation_id;

                    if (messageComposeOverlay) {

                        messageComposeOverlay.style.display =
                            "flex";
                    }

                    const input =
                        document.getElementById(
                            "messageInput"
                        );

                    if (input) {

                        input.value = "";

                        input.dataset.receiverName =
                            message.sender_username || "";

                        input.dataset.listingId =
                            message.listing_id || "";

                        input.dataset.replyTo =
                            message.id || "";

                        input.dataset.conversationId =
                            message.conversation_id || "";
                    }
                }
            );

            item.appendChild(sender);
            item.appendChild(text);
            item.appendChild(date);
            item.appendChild(replyButton);

            conversation.appendChild(item);
        });

        messagesList.appendChild(conversation);
    });
}


// ========================================
// باز کردن پیام‌ها
// ========================================

if (messagesButton && messagesOverlay) {

    messagesButton.addEventListener(
        "click",
        async function () {

            messagesOverlay.style.display =
                "flex";

            await loadMyMessages();
        }
    );
}


// ========================================
// بستن پیام‌ها
// ========================================

if (closeMessages && messagesOverlay) {

    closeMessages.onclick = function () {

        messagesOverlay.style.display =
            "none";
    };
}


// ========================================
// ارسال پیام / پاسخ
// ========================================

if (sendMessageButton) {

    sendMessageButton.addEventListener(
        "click",
        async function () {

            const input =
                document.getElementById(
                    "messageInput"
                );

            if (!input) return;

            const text =
                input.value.trim();

            const receiverName =
                input.dataset.receiverName || "";

            const listingId =
                input.dataset.listingId || "";

            if (!text) {

                alert("لطفاً پیام را بنویس.");
                return;
            }

            const minecraftName =
                prompt(
                    "نام شما در Minecraft را وارد کنید:"
                );

            if (!minecraftName ||
                !minecraftName.trim()) {

                alert(
                    "برای ارسال پیام باید نام Minecraft را وارد کنید."
                );

                return;
            }

            sendMessageButton.disabled =
                true;

            sendMessageButton.textContent =
                "در حال ارسال...";

            const existingConversation =
                input.dataset.conversationId || "";

            const conversationId =
                existingConversation ||
                crypto.randomUUID();

            const replyTo =
                input.dataset.replyTo
                    ? Number(input.dataset.replyTo)
                    : null;

            const receiverVisitorId =
                input.dataset.receiverVisitorId || "";

            const { error } =
                await supabaseClient
                    .from("messages")
                    .insert({

                        sender_id:
                            visitorId,

                        receiver_id:
                            receiverVisitorId || null,

                        sender_username:
                            minecraftName.trim(),

                        receiver_username:
                            receiverName,

                        message_text:
                            text,

                        listing_id:
                            listingId
                                ? Number(listingId)
                                : null,

                        conversation_id:
                            conversationId,

                        reply_to:
                            replyTo
                    });

            sendMessageButton.disabled =
                false;

            sendMessageButton.textContent =
                "ارسال پیام";

            if (error) {

                console.error(
                    "خطای ارسال پیام:",
                    error
                );

                alert(
                    "ارسال پیام انجام نشد:\n" +
                    error.message
                );

                return;
            }

            alert(
                replyTo
                    ? "پاسخ با موفقیت ارسال شد! ↩️"
                    : "پیام با موفقیت ارسال شد! 💬"
            );

            input.value = "";

            delete input.dataset.replyTo;
            delete input.dataset.conversationId;

            replyMessageId = null;
            replyConversationId = null;

            if (messageComposeOverlay) {

                messageComposeOverlay.style.display =
                    "none";
            }

            await loadMyMessages();
        }
    );
}


// ========================================
// بستن پنجره جزئیات آگهی
// ========================================

const listingOverlayFixed =
    document.getElementById("listingOverlay");

const closeListingFixed =
    document.getElementById("closeListing");

if (closeListingFixed && listingOverlayFixed) {

    closeListingFixed.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        listingOverlayFixed.style.display = "none";
    };
}

if (listingOverlayFixed) {

    listingOverlayFixed.onclick = function (event) {

        if (event.target === listingOverlayFixed) {
            listingOverlayFixed.style.display = "none";
        }
    };
}







// ========================================
// 🔴 سیستم پیام جدید - نسخه نهایی
// ========================================

let messagesUnreadDot = null;

function createMessagesUnreadDot() {

    if (!messagesButton) return;

    messagesUnreadDot =
        document.getElementById("messagesUnreadDot");

    if (!messagesUnreadDot) {

        messagesUnreadDot =
            document.createElement("span");

        messagesUnreadDot.id =
            "messagesUnreadDot";

        messagesUnreadDot.style.cssText = `
            position:absolute;
            width:12px;
            height:12px;
            background:#ff3040;
            border-radius:50%;
            border:2px solid white;
            top:2px;
            right:2px;
            z-index:99999;
            display:none;
            pointer-events:none;
            box-sizing:border-box;
        `;

        messagesButton.style.position = "relative";

        messagesButton.appendChild(
            messagesUnreadDot
        );
    }
}


function setMessagesUnreadDot(show) {

    createMessagesUnreadDot();

    if (!messagesUnreadDot) return;

    messagesUnreadDot.style.display =
        show ? "block" : "none";
}


// ========================================
// بررسی پیام‌های خوانده نشده
// ========================================

async function checkUnreadMessages() {

    if (!messagesButton) return;

    const { data, error } =
        await supabaseClient
            .from("messages")
            .select("id,is_read,receiver_username");

    if (error) {

        console.error(
            "خطای بررسی پیام‌ها:",
            error
        );

        return;
    }

    const unread =
        (data || []).some(function(message) {

            return message.is_read === false;

        });

    setMessagesUnreadDot(unread);
}


// ========================================
// باز کردن پیام‌ها
// ========================================

async function openMessagesAndMarkRead() {

    if (!messagesOverlay) return;

    messagesOverlay.style.display =
        "flex";

    await loadMyMessages();

    const { error } =
        await supabaseClient
            .from("messages")
            .update({
                is_read: true
            })
            .eq("receiver_id", visitorId)
            .eq("is_read", false);

    if (error) {

        console.error(
            "خطای خوانده‌شدن پیام‌ها:",
            error
        );

        return;
    }

    setMessagesUnreadDot(false);
}


// ========================================
// دکمه پیام‌ها
// ========================================

if (messagesButton && messagesOverlay) {

    messagesButton.onclick =
        async function() {

            await openMessagesAndMarkRead();

            addDeleteMessagesButton();

        };
}



// ========================================
// حذف پیام‌های دریافتی
// ========================================

function addDeleteMessagesButton() {

    if (!messagesOverlay) return;

    const messagesBox =
        messagesOverlay.querySelector(".messages-box");

    if (!messagesBox) return;

    if (document.getElementById("deleteMyMessagesButton")) {
        return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.id = "deleteMyMessagesButton";
    button.textContent = "🗑️ حذف پیام‌های دریافتی";

    button.style.cssText = `
        width: 100%;
        margin-top: 12px;
        padding: 12px;
        border: none;
        border-radius: 12px;
        background: #d32f2f;
        color: white;
        font-size: 14px;
        cursor: pointer;
    `;

    button.addEventListener("click", async function () {

        const confirmed = confirm(
            "آیا مطمئنید می‌خواهید تمام پیام‌های دریافتی خود را حذف کنید؟\n\nفقط پیام‌های دریافتی همین کاربر حذف می‌شوند."
        );

        if (!confirmed) return;

        button.disabled = true;
        button.textContent = "در حال حذف...";

        try {

            const { error } = await supabaseClient
                .from("messages")
                .delete()
                .eq("receiver_id", visitorId);

            if (error) {
                console.error("خطای حذف پیام‌ها:", error);
                alert("حذف پیام‌ها انجام نشد.");
                return;
            }

            await loadMyMessages();

            setMessagesUnreadDot(false);

            alert("✅ تمام پیام‌های دریافتی شما حذف شدند.");

        } catch (error) {

            console.error("خطای حذف پیام‌ها:", error);
            alert("خطایی هنگام حذف پیام‌ها رخ داد.");

        } finally {

            button.disabled = false;
            button.textContent = "🗑️ حذف پیام‌های دریافتی";

        }
    });

    messagesBox.appendChild(button);
}

// ========================================
// شروع سیستم
// ========================================

createMessagesUnreadDot();

checkUnreadMessages();

setInterval(
    checkUnreadMessages,
    5000
);

console.log("🔥 DEBUG TEST شروع شد");

console.log("itemForm =", document.getElementById("itemForm"));
console.log("products =", document.getElementById("products"));
console.log("listingOverlay =", document.getElementById("listingOverlay"));
console.log("listingDetails =", document.getElementById("listingDetails"));


/* ========================================
   SPH SHOP AUTO FIX
   SAFE LISTING + VIEW DEBUG
======================================== */

(function () {

    console.log("🔥 SPH SHOP AUTO FIX فعال شد");

    document.addEventListener("DOMContentLoaded", function () {

        const form = document.getElementById("itemForm");
        const products = document.getElementById("products");
        const listingOverlay =
            document.getElementById("listingOverlay");
        const listingDetails =
            document.getElementById("listingDetails");

        console.log("FORM:", form);
        console.log("PRODUCTS:", products);
        console.log("LISTING OVERLAY:", listingOverlay);
        console.log("LISTING DETAILS:", listingDetails);

        if (!form) {
            console.error("❌ itemForm پیدا نشد");
        }

        if (!products) {
            console.error("❌ products پیدا نشد");
        }

        if (!listingOverlay) {
            console.error("❌ listingOverlay پیدا نشد");
        }

        if (!listingDetails) {
            console.error("❌ listingDetails پیدا نشد");
        }

    });

})();

