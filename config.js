/* هذا هو ملف بياناتك. عدّل النصوص بين علامتي التنصيص فقط. */
window.PAYMENT_CONFIG = {
  ownerName: "George Hanna",
  initials: "GH",
  avatarImage: "images/avatar.jpg",
  welcomeText: "اختار طريقة التحويل المناسبة ليك",
  instapay: {
    enabled: true, /* غيّرها لـ false عشان تخفي طريقة التحويل دي مؤقتًا */
    title: "إنستاباي",
    phone: "01273301171",
    paymentAddress: "",
    appLink: "https://ipn.eg/S/georgehanna45/instapay/7wVgFg",
    qrImage: "images/instapay-qr.jpg"
  },
  vodafone: {
    enabled: true, /* غيّرها لـ false عشان تخفي طريقة التحويل دي مؤقتًا */
    title: "فودافون كاش",
    phone: "01068206106",
    appLink: "http://vf.eg/vfcash?id=mt&qrId=bbbDLI",
    qrImage: "images/vodafone-qr.jpg"
  },
  bank: {
    enabled: false, /* غيّرها لـ false عشان تخفي طريقة التحويل دي مؤقتًا */
    title: "التحويل البنكي",
    accountName: "جورج حنا شفيق مهني سمعان",
    bankName: "بنك الإسكندرية",
    accountNumber: "155009513001",
    iban: "EG510005105500000155009513001",
    swift: "ALEXEGCXXXX",
    branch: "",
    currency: "EGP"
  }
};
