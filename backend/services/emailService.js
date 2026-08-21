const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("❌ Email service FAILED:", error.message);
  else console.log("✅ Email service connected:", process.env.EMAIL_USER);
});

// ── 1. Notify SELLER: buyer accepted listing ──────────────────
const sendBuyerAssignedEmail = async ({
  sellerEmail, sellerName,
  buyerName, buyerContact, buyerBusiness,
  wasteTitle, wasteCategory, estimatedPrice,
}) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#37B943,#81E68D);padding:28px 24px;text-align:center;">
        <h2 style="color:white;margin:0;font-size:22px;">♻️ WasteFreeIndia</h2>
        <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">A buyer has been found for your listing!</p>
      </div>
      <div style="padding:28px 24px;background:#fafafa;">
        <p style="color:#333;font-size:15px;margin:0 0 16px;">Hi <strong>${sellerName}</strong>,</p>
        <p style="color:#555;margin:0 0 20px;">A buyer has accepted your waste listing and will contact you soon.</p>
        <div style="background:white;border-radius:10px;padding:18px;margin-bottom:16px;border-left:4px solid #37B943;">
          <p style="font-weight:bold;color:#37B943;margin:0 0 10px;font-size:13px;text-transform:uppercase;">Your Listing</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Title:</b> ${wasteTitle}</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Category:</b> ${wasteCategory}</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Your Price:</b> ₹${estimatedPrice}</p>
        </div>
        <div style="background:white;border-radius:10px;padding:18px;margin-bottom:24px;border-left:4px solid #2196F3;">
          <p style="font-weight:bold;color:#2196F3;margin:0 0 10px;font-size:13px;text-transform:uppercase;">Buyer Details</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Name:</b> ${buyerName}</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Contact:</b> ${buyerContact || "Not provided"}</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Business:</b> ${buyerBusiness || "Not provided"}</p>
        </div>
        <div style="text-align:center;margin-bottom:20px;">
          <a href="${process.env.FRONTEND_URL}/user/my-listings" style="background:#37B943;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">View My Listings →</a>
        </div>
        <p style="color:#aaa;font-size:11px;text-align:center;margin:0;">© WasteFreeIndia · Making India Cleaner</p>
      </div>
    </div>`;
  return transporter.sendMail({
    from: `"WasteFreeIndia" <${process.env.EMAIL_USER}>`,
    to: sellerEmail,
    subject: `🎉 Buyer found for "${wasteTitle}" — WasteFreeIndia`,
    html,
  });
};

// ── 2. Notify BUYER: seller updated status ────────────────────
const sendStatusUpdateEmail = async ({
  buyerEmail, buyerName, sellerName, wasteTitle, newStatus,
}) => {
  const info = {
    collected: { label: "Collected",    color: "#9C27B0", msg: "The seller has marked this as collected." },
    completed: { label: "Completed ✅", color: "#37B943", msg: "This transaction is complete. Thank you!" },
    cancelled: { label: "Cancelled",    color: "#f44336", msg: "The seller has cancelled this listing." },
  }[newStatus] || { label: newStatus, color: "#555", msg: "Status has been updated." };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1976D2,#64B5F6);padding:28px 24px;text-align:center;">
        <h2 style="color:white;margin:0;font-size:22px;">♻️ WasteFreeIndia</h2>
        <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">Status update for your purchase</p>
      </div>
      <div style="padding:28px 24px;background:#fafafa;">
        <p style="color:#333;font-size:15px;margin:0 0 16px;">Hi <strong>${buyerName}</strong>,</p>
        <p style="color:#555;margin:0 0 20px;">${info.msg}</p>
        <div style="background:white;border-radius:10px;padding:18px;margin-bottom:24px;border-left:4px solid ${info.color};">
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Item:</b> ${wasteTitle}</p>
          <p style="margin:4px 0;color:#333;font-size:14px;"><b>Seller:</b> ${sellerName}</p>
          <span style="background:${info.color}22;color:${info.color};padding:3px 12px;border-radius:20px;font-weight:bold;font-size:13px;">${info.label}</span>
        </div>
        <div style="text-align:center;margin-bottom:20px;">
          <a href="${process.env.FRONTEND_URL}/buyer/my-accepted" style="background:#2196F3;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">View My Accepted →</a>
        </div>
        <p style="color:#aaa;font-size:11px;text-align:center;margin:0;">© WasteFreeIndia · Making India Cleaner</p>
      </div>
    </div>`;
  return transporter.sendMail({
    from: `"WasteFreeIndia" <${process.env.EMAIL_USER}>`,
    to: buyerEmail,
    subject: `📦 "${wasteTitle}" is now ${info.label} — WasteFreeIndia`,
    html,
  });
};

// ── 3. Notify SELLER: transaction completed with final price ──
const sendTransactionCompleteEmail = async ({
  sellerEmail, sellerName,
  buyerName, buyerBusiness,
  wasteTitle, wasteCategory,
  estimatedPrice, finalPrice, completedAt,
}) => {
  const date = new Date(completedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const diff = finalPrice - estimatedPrice;
  const diffText = diff > 0
    ? `<span style="color:#37B943;">+₹${diff} above your estimate</span>`
    : diff < 0
    ? `<span style="color:#f44336;">₹${Math.abs(diff)} below your estimate</span>`
    : `<span style="color:#555;">Exactly as estimated</span>`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#37B943,#81E68D);padding:28px 24px;text-align:center;">
        <h2 style="color:white;margin:0;font-size:22px;">♻️ WasteFreeIndia</h2>
        <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">Transaction Completed!</p>
      </div>
      <div style="padding:28px 24px;background:#fafafa;">
        <p style="color:#333;font-size:15px;margin:0 0 8px;">Hi <strong>${sellerName}</strong>,</p>
        <p style="color:#555;margin:0 0 20px;">Your waste has been collected. Here is your receipt:</p>
        <div style="background:white;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e0e0e0;">
          <p style="font-weight:bold;color:#333;margin:0 0 14px;font-size:15px;border-bottom:1px dashed #eee;padding-bottom:10px;">🧾 Transaction Receipt</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="color:#666;padding:5px 0;">Item</td><td style="color:#333;font-weight:600;text-align:right;">${wasteTitle}</td></tr>
            <tr><td style="color:#666;padding:5px 0;">Category</td><td style="color:#333;text-align:right;">${wasteCategory}</td></tr>
            <tr><td style="color:#666;padding:5px 0;">Buyer</td><td style="color:#333;text-align:right;">${buyerName}${buyerBusiness ? ` (${buyerBusiness})` : ""}</td></tr>
            <tr><td style="color:#666;padding:5px 0;">Your Estimate</td><td style="color:#333;text-align:right;">₹${estimatedPrice}</td></tr>
            <tr style="border-top:1px dashed #eee;">
              <td style="color:#333;font-weight:bold;padding:10px 0 5px;font-size:16px;">Final Price</td>
              <td style="color:#37B943;font-weight:bold;text-align:right;font-size:20px;">₹${finalPrice}</td>
            </tr>
            <tr><td colspan="2" style="text-align:right;font-size:12px;padding-top:2px;">${diffText}</td></tr>
            <tr><td style="color:#999;font-size:12px;padding-top:10px;">Completed on</td><td style="color:#999;font-size:12px;text-align:right;padding-top:10px;">${date}</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-bottom:20px;">
          <a href="${process.env.FRONTEND_URL}/user/my-listings" style="background:#37B943;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">View My Listings →</a>
        </div>
        <p style="color:#aaa;font-size:11px;text-align:center;margin:0;">© WasteFreeIndia · Making India Cleaner</p>
      </div>
    </div>`;
  return transporter.sendMail({
    from: `"WasteFreeIndia" <${process.env.EMAIL_USER}>`,
    to: sellerEmail,
    subject: `✅ Transaction complete — ₹${finalPrice} received for "${wasteTitle}"`,
    html,
  });
};

// ── 4. NEW: Notify BUYER: their own transaction receipt ───────
const sendBuyerReceiptEmail = async ({
  buyerEmail, buyerName,
  sellerName, sellerContact,
  wasteTitle, wasteCategory,
  finalPrice, completedAt,
}) => {
  const date = new Date(completedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1976D2,#64B5F6);padding:28px 24px;text-align:center;">
        <h2 style="color:white;margin:0;font-size:22px;">♻️ WasteFreeIndia</h2>
        <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">Purchase Complete!</p>
      </div>
      <div style="padding:28px 24px;background:#fafafa;">
        <p style="color:#333;font-size:15px;margin:0 0 8px;">Hi <strong>${buyerName}</strong>,</p>
        <p style="color:#555;margin:0 0 20px;">
          You have successfully completed a waste purchase. Here is your buyer receipt:
        </p>

        <!-- Receipt -->
        <div style="background:white;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e0e0e0;">
          <p style="font-weight:bold;color:#333;margin:0 0 14px;font-size:15px;border-bottom:1px dashed #eee;padding-bottom:10px;">
            🧾 Purchase Receipt
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="color:#666;padding:5px 0;">Item</td><td style="color:#333;font-weight:600;text-align:right;">${wasteTitle}</td></tr>
            <tr><td style="color:#666;padding:5px 0;">Category</td><td style="color:#333;text-align:right;">${wasteCategory}</td></tr>
            <tr><td style="color:#666;padding:5px 0;">Seller</td><td style="color:#333;text-align:right;">${sellerName}</td></tr>
            ${sellerContact ? `<tr><td style="color:#666;padding:5px 0;">Seller Contact</td><td style="color:#333;text-align:right;">${sellerContact}</td></tr>` : ""}
            <tr style="border-top:1px dashed #eee;">
              <td style="color:#333;font-weight:bold;padding:10px 0 5px;font-size:16px;">Amount Paid</td>
              <td style="color:#2196F3;font-weight:bold;text-align:right;font-size:20px;">₹${finalPrice}</td>
            </tr>
            <tr>
              <td style="color:#999;font-size:12px;padding-top:10px;">Completed on</td>
              <td style="color:#999;font-size:12px;text-align:right;padding-top:10px;">${date}</td>
            </tr>
          </table>
        </div>

        <p style="color:#555;font-size:13px;margin:0 0 20px;text-align:center;">
          Thank you for helping keep India clean! 🌱
        </p>

        <div style="text-align:center;margin-bottom:20px;">
          <a href="${process.env.FRONTEND_URL}/buyer/my-accepted"
            style="background:#2196F3;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">
            View My Accepted →
          </a>
        </div>
        <p style="color:#aaa;font-size:11px;text-align:center;margin:0;">© WasteFreeIndia · Making India Cleaner</p>
      </div>
    </div>`;

  return transporter.sendMail({
    from: `"WasteFreeIndia" <${process.env.EMAIL_USER}>`,
    to: buyerEmail,
    subject: `🛒 Purchase complete — ₹${finalPrice} paid for "${wasteTitle}"`,
    html,
  });
};

module.exports = {
  sendBuyerAssignedEmail,
  sendStatusUpdateEmail,
  sendTransactionCompleteEmail,
  sendBuyerReceiptEmail,   // ← new export
};