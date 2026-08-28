const defaults = window.PAYMENT_CONFIG;
let config = structuredClone(defaults);

const ICONS = {
  instapay: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>`,
  vodafone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H4"/><circle cx="16" cy="13" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V10M9 21V10M15 21V10M19 21V10"/><path d="M2.5 10 12 4l9.5 6"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l-6 6 6 6"/></svg>`,
};

const detailsDialog = document.querySelector("#details-dialog");
const detailsContent = document.querySelector("#details-content");
const toast = document.querySelector("#toast");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHome() {
  document.querySelector("#owner-name").textContent = config.ownerName;
  document.querySelector("#avatar-initials").textContent = config.initials;
  document.querySelector("#welcome-text").textContent = config.welcomeText;
  document
    .querySelectorAll("[data-icon]")
    .forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] ?? ""));

  document.querySelectorAll("[data-method]").forEach((button) => {
    const data = config[button.dataset.method];
    button.hidden = data?.enabled === false;
  });

  const avatar = document.querySelector("#avatar");
  if (config.avatarImage) {
    const photo = new Image();
    photo.className = "avatar-photo";
    photo.alt = config.ownerName;
    photo.addEventListener("load", () => avatar.prepend(photo), {
      once: true,
    });
    photo.src = config.avatarImage;
  }
}

function copyRow(label, value) {
  if (!value) return "";
  return `<div class="data-row"><div><span>${label}</span><strong dir="ltr">${escapeHtml(value)}</strong></div><button data-copy="${escapeHtml(value)}" type="button">نسخ</button></div>`;
}

function renderWallet(name) {
  const data = config[name];
  const extra = data.paymentAddress
    ? copyRow("عنوان الدفع", data.paymentAddress)
    : "";
  const link = data.appLink
    ? `<a class="open-link" href="${escapeHtml(data.appLink)}">فتح رابط الدفع</a>`
    : `<p class="muted">أضف الرابط الرسمي الذي نسخته من التطبيق داخل config.js</p>`;

  detailsContent.innerHTML = `<header class="dialog-head ${name}"><b>${ICONS[name]}</b><div><small>طريقة التحويل</small><h2>${escapeHtml(data.title)}</h2></div></header><div class="dialog-body">${copyRow("رقم الهاتف", data.phone)}${extra}${link}<figure class="qr"><img src="${escapeHtml(data.qrImage)}" alt="QR ${escapeHtml(data.title)}"><figcaption>امسح الكود لإتمام التحويل</figcaption></figure></div>`;

  const image = detailsContent.querySelector(".qr img");
  image.addEventListener(
    "error",
    () =>
      (image.parentElement.innerHTML =
        "<div class='qr-empty'>أضف صورة QR داخل مجلد images</div>"),
    { once: true },
  );
  detailsDialog.showModal();
}

function renderBank() {
  const b = config.bank;
  detailsContent.innerHTML = `<header class="dialog-head bank"><b>${ICONS.bank}</b><div><small>طريقة التحويل</small><h2>${escapeHtml(b.title)}</h2></div></header><div class="dialog-body">${copyRow("اسم صاحب الحساب", b.accountName)}${copyRow("اسم البنك", b.bankName)}${copyRow("رقم الحساب", b.accountNumber)}${copyRow("IBAN", b.iban)}${copyRow("SWIFT / BIC", b.swift)}${copyRow("الفرع", b.branch)}${copyRow("العملة", b.currency)}</div>`;
  detailsDialog.showModal();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("تم النسخ بنجاح ✓");
  } catch {
    showToast("شغّل الصفحة عبر Live Server لتفعيل النسخ");
  }
}

document
  .querySelectorAll("[data-method]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      button.dataset.method === "bank"
        ? renderBank()
        : renderWallet(button.dataset.method),
    ),
  );
document.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) copyText(copyButton.dataset.copy);
  if (event.target.matches("[data-close]"))
    event.target.closest("dialog").close();
});

document.querySelectorAll("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  }),
);

renderHome();
