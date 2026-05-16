import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import api from "../services/api";

function statusBadge(status) {
  if (status === "captured") return { label: "Paid", dot: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50" };
  if (status === "failed") return { label: "Failed", dot: "bg-red-400", text: "text-red-600", bg: "bg-red-50" };
  return { label: status ?? "Pending", dot: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
}

function generateInvoiceHTML(payment, userInfo) {
  const booking = payment?.booking || {};
  const vehicle = booking?.vehicle || {};
  const invoiceNo = payment?.invoiceNumber || "—";
  const amount = payment?.amount || 0;

  const fmt = (d, opts) => d ? new Date(d).toLocaleDateString("en-IN", opts) : null;
  const dateIssued = fmt(payment?.createdAt, { day: "numeric", month: "long", year: "numeric" }) || "—";
  const startDate = fmt(booking?.startDate, { day: "numeric", month: "short", year: "numeric" });
  const endDate = fmt(booking?.endDate, { day: "numeric", month: "short", year: "numeric" });
  const days = (booking?.startDate && booking?.endDate)
    ? Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000))
    : null;
  const pricePerDay = vehicle?.pricePerDay || (days ? Math.round(amount / days) : null);
  const vehicleName = vehicle?.title || vehicle?.model || "Vehicle Rental";
  const vehicleType = vehicle?.type || "";
  const customerName = userInfo?.name || "Customer";
  const customerEmail = userInfo?.email || "";
  const bookingStatus = booking?.bookingStatus || "confirmed";
  const ref = payment?.razorpayPaymentId || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>DriveNow Invoice · ${invoiceNo}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#eef2f7;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px}
.page{width:100%;max-width:780px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.14)}

/* ── HEADER ── */
.hd{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#1d4ed8 80%,#3b82f6 100%);padding:40px 48px}
.hd-top{display:flex;justify-content:space-between;align-items:flex-start}
.brand{display:flex;align-items:center;gap:12px}
.brand-icon{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#c2410c,#f97316);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.brand-icon svg{display:block}
.brand-text h2{font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.5px}
.brand-text p{color:rgba(255,255,255,0.45);font-size:11px;margin-top:2px;letter-spacing:0.5px}
.inv-label{text-align:right}
.inv-label h1{font-size:38px;font-weight:900;color:#fff;letter-spacing:-1px}
.inv-label p{color:rgba(255,255,255,0.55);font-size:13px;margin-top:6px}
.inv-label span{font-family:monospace;font-size:12px;background:rgba(255,255,255,0.12);border-radius:6px;padding:3px 8px;color:rgba(255,255,255,0.75)}

.amount-strip{margin-top:28px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:18px;padding:22px 28px;display:flex;align-items:center;justify-content:space-between}
.amount-strip .lbl{color:rgba(255,255,255,0.55);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
.amount-strip .val{font-size:40px;font-weight:900;color:#fff;margin-top:4px;letter-spacing:-1px}
.paid-pill{display:flex;align-items:center;gap:9px;background:rgba(52,211,153,0.18);border:1px solid rgba(52,211,153,0.35);border-radius:14px;padding:12px 20px}
.paid-dot{width:10px;height:10px;border-radius:50%;background:#34d399}
.paid-txt{color:#6ee7b7;font-size:14px;font-weight:700}

/* ── BODY ── */
.bd{padding:44px 48px}

.info-row{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding-bottom:36px;border-bottom:1px solid #f1f5f9;margin-bottom:36px}
.sec-lbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700;margin-bottom:14px}
.bill-name{font-size:17px;font-weight:800;color:#0f172a}
.bill-email{color:#64748b;font-size:14px;margin-top:4px}
.detail-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;font-size:13px}
.detail-row .dlbl{color:#94a3b8}
.detail-row .dval{font-weight:600;color:#334155}
.detail-row .dval.mono{font-family:monospace;font-size:11px;background:#f8fafc;padding:2px 6px;border-radius:5px}
.detail-row .dval.green{color:#059669;background:#f0fdf4;padding:3px 9px;border-radius:100px;font-size:12px}
.detail-row .dval.blue{color:#2563eb;background:#eff6ff;padding:3px 9px;border-radius:100px;font-size:12px;text-transform:capitalize}

/* dates strip */
.dates-strip{background:linear-gradient(135deg,#1e3a5f,#1d4ed8);border-radius:18px;display:grid;grid-template-columns:repeat(4,1fr);overflow:hidden;margin-bottom:32px}
.dc{padding:20px 22px;border-right:1px solid rgba(255,255,255,0.1)}
.dc:last-child{border-right:none}
.dc-lbl{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.55);font-weight:700}
.dc-val{font-size:18px;font-weight:900;color:#fff;margin-top:6px;line-height:1.1}

/* table */
.tbl-lbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;font-weight:700;margin-bottom:12px}
table{width:100%;border-collapse:collapse;border-radius:14px;overflow:hidden}
thead tr{background:linear-gradient(90deg,#f8faff,#eff6ff)}
th{text-align:left;padding:13px 18px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:700}
th:last-child{text-align:right}
tbody tr:hover{background:#fafbff}
td{padding:16px 18px;font-size:14px;border-top:1px solid #f1f5f9;color:#334155;vertical-align:top}
td:last-child{text-align:right;font-weight:700;color:#0f172a}
.v-name{font-weight:800;color:#0f172a;font-size:15px}
.v-type{display:inline-block;margin-top:5px;font-size:11px;background:#eff6ff;color:#3b82f6;padding:3px 10px;border-radius:100px;font-weight:600;text-transform:capitalize}

/* totals */
.totals{display:flex;justify-content:flex-end;margin-top:24px}
.tot-box{width:290px}
.tot-row{display:flex;justify-content:space-between;padding:9px 0;font-size:13px;border-bottom:1px solid #f1f5f9}
.tot-row .tl{color:#94a3b8}.tot-row .tv{font-weight:600;color:#334155}
.tot-final{background:linear-gradient(135deg,#1e3a5f,#1d4ed8);border-radius:14px;padding:16px 20px;display:flex;justify-content:space-between;margin-top:10px}
.tot-final span{color:#fff;font-weight:900;font-size:17px}

/* confirmation */
.conf{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:18px;padding:22px 26px;display:flex;align-items:center;gap:18px;margin-top:36px}
.conf-icon{width:46px;height:46px;background:#22c55e;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.conf-t{font-weight:800;color:#166534;font-size:15px}
.conf-s{color:#16a34a;font-size:13px;margin-top:4px;line-height:1.4}

/* footer */
.ft{margin-top:44px;padding:24px 0 0;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between}
.ft-brand{display:flex;align-items:center;gap:9px}
.ft-icon{width:30px;height:30px;background:linear-gradient(135deg,#c2410c,#f97316);border-radius:9px}
.ft-name{font-weight:900;color:#0f172a;font-size:15px}
.ft-note{color:#94a3b8;font-size:12px;text-align:right;line-height:1.5}

@media print{body{background:#fff;padding:0}  .page{box-shadow:none;border-radius:0;max-width:100%}}
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="hd">
    <div class="hd-top">
      <div class="brand">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
          </svg>
        </div>
        <div class="brand-text">
          <h2>DriveNow</h2>
          <p>Vehicle Rental Services</p>
        </div>
      </div>
      <div class="inv-label">
        <h1>INVOICE</h1>
        <p>Issued on ${dateIssued}</p>
        <span>${invoiceNo}</span>
      </div>
    </div>

    <div class="amount-strip">
      <div>
        <div class="lbl">Amount Paid</div>
        <div class="val">₹${amount.toLocaleString("en-IN")}</div>
      </div>
      <div class="paid-pill">
        <div class="paid-dot"></div>
        <span class="paid-txt">Payment Confirmed</span>
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="bd">

    <!-- Bill to + Invoice details -->
    <div class="info-row">
      <div>
        <div class="sec-lbl">Bill To</div>
        <div class="bill-name">${customerName}</div>
        ${customerEmail ? `<div class="bill-email">${customerEmail}</div>` : ""}
      </div>
      <div>
        <div class="sec-lbl">Invoice Details</div>
        <div class="detail-row"><span class="dlbl">Invoice No.</span><span class="dval mono">${invoiceNo}</span></div>
        <div class="detail-row"><span class="dlbl">Issue Date</span><span class="dval">${dateIssued}</span></div>
        <div class="detail-row"><span class="dlbl">Payment</span><span class="dval green">Paid</span></div>
        <div class="detail-row"><span class="dlbl">Booking</span><span class="dval blue">${bookingStatus}</span></div>
        ${ref ? `<div class="detail-row"><span class="dlbl">Razorpay Ref</span><span class="dval mono">${ref}</span></div>` : ""}
      </div>
    </div>

    <!-- Booking dates strip -->
    ${(startDate && endDate && days) ? `
    <div class="dates-strip">
      <div class="dc"><div class="dc-lbl">Start Date</div><div class="dc-val">${startDate}</div></div>
      <div class="dc"><div class="dc-lbl">End Date</div><div class="dc-val">${endDate}</div></div>
      <div class="dc"><div class="dc-lbl">Total Days</div><div class="dc-val">${days}</div></div>
      <div class="dc"><div class="dc-lbl">Total Amount</div><div class="dc-val">₹${amount.toLocaleString("en-IN")}</div></div>
    </div>` : ""}

    <!-- Line items -->
    <div class="tbl-lbl">Rental Summary</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          ${days ? "<th style='text-align:center'>Days</th>" : ""}
          ${pricePerDay ? "<th style='text-align:center'>Price / Day</th>" : ""}
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="v-name">${vehicleName}</div>
            ${vehicleType ? `<div class="v-type">${vehicleType}</div>` : ""}
          </td>
          ${days ? `<td style="text-align:center;font-weight:700">${days}</td>` : ""}
          ${pricePerDay ? `<td style="text-align:center">₹${pricePerDay.toLocaleString("en-IN")}</td>` : ""}
          <td>₹${amount.toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="tot-box">
        <div class="tot-row"><span class="tl">Subtotal</span><span class="tv">₹${amount.toLocaleString("en-IN")}</span></div>
        <div class="tot-row"><span class="tl">Tax (0%)</span><span class="tv">₹0</span></div>
        <div class="tot-final"><span>Total</span><span>₹${amount.toLocaleString("en-IN")}</span></div>
      </div>
    </div>

    <!-- Confirmation -->
    <div class="conf">
      <div class="conf-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <div class="conf-t">Payment Successfully Received</div>
        <div class="conf-s">₹${amount.toLocaleString("en-IN")} paid on ${dateIssued}${ref ? ` · Ref: ${ref}` : ""}</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="ft">
      <div class="ft-brand">
        <div class="ft-icon"></div>
        <span class="ft-name">DriveNow</span>
      </div>
      <div class="ft-note">Thank you for choosing DriveNow!<br/>For support, contact us at support@drivenow.in</div>
    </div>

  </div>
</div>
</body>
</html>`;
}

function InvoiceViewer({ payment, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const openInBrowser = () => {
    const win = window.open("", "_blank");
    if (!win) { toast.error("Please allow popups to view the invoice."); return; }
    win.document.write(generateInvoiceHTML(payment, userInfo));
    win.document.close();
  };

  const handlePrint = () => {
    const iframe = document.getElementById("inv-frame");
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  const downloadPDF = () => {
    const booking       = payment?.booking || {};
    const vehicle       = booking?.vehicle || {};
    const invoiceNo     = payment?.invoiceNumber || "Invoice";
    const amount        = payment?.amount || 0;
    const customerName  = userInfo?.name  || "Customer";
    const customerEmail = userInfo?.email || "";
    const bookingStatus = booking?.bookingStatus || "confirmed";
    const ref           = payment?.razorpayPaymentId || "";

    const fmt = (d, opts) => d ? new Date(d).toLocaleDateString("en-IN", opts) : null;
    const dateIssued  = fmt(payment?.createdAt, { day: "numeric", month: "long",  year: "numeric" }) || "";
    const startDate   = fmt(booking?.startDate,  { day: "numeric", month: "short", year: "numeric" });
    const endDate     = fmt(booking?.endDate,    { day: "numeric", month: "short", year: "numeric" });
    const days        = (booking?.startDate && booking?.endDate)
      ? Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000)) : null;
    const pricePerDay = vehicle?.pricePerDay || (days ? Math.round(amount / days) : null);
    const vehicleName = vehicle?.title || vehicle?.model || "Vehicle Rental";
    const vehicleType = vehicle?.type  || "";
    const amtStr      = `Rs.${amount.toLocaleString("en-IN")}`;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210, M = 20, CW = W - M * 2;
    let y = 0;

    // ── helpers ──────────────────────────────────────────
    const hex2rgb = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];

    const fill  = (hex, x, ry, w, h) => { doc.setFillColor(...hex2rgb(hex)); doc.rect(x, ry, w, h, "F"); };
    const fillR = (hex, x, ry, w, h, r=3) => { doc.setFillColor(...hex2rgb(hex)); doc.roundedRect(x, ry, w, h, r, r, "F"); };
    const stroke = (hex, x1, y1, x2, y2, lw=0.3) => {
      doc.setDrawColor(...hex2rgb(hex)); doc.setLineWidth(lw); doc.line(x1, y1, x2, y2);
    };
    const txt = (hex, size, bold, str, x, ry, opts) => {
      doc.setTextColor(...hex2rgb(hex));
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.text(str, x, ry, opts || {});
    };
    // Simulate smooth horizontal gradient
    const gradH = (x, ry, w, h, c1, c2, steps = 50) => {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        doc.setFillColor(
          Math.round(c1[0] + (c2[0]-c1[0])*t),
          Math.round(c1[1] + (c2[1]-c1[1])*t),
          Math.round(c1[2] + (c2[2]-c1[2])*t)
        );
        doc.rect(x + w*i/steps, ry, w/steps + 0.5, h, "F");
      }
    };

    // ── HEADER (0–76mm) ─────────────────────────────────
    const HDR = 76;
    gradH(0, 0, W, HDR, [15,23,42], [59,130,246]);

    // Orange logo icon (rounded)
    fillR("#ea580c", M, 12, 13, 13, 3);
    fill("#fed7aa", M + 2.5, 15, 8, 1.5);
    fill("#fed7aa", M + 2.5, 18, 8, 1.5);
    fill("#fed7aa", M + 2.5, 21, 8, 1.5);

    txt("#ffffff", 18, true,  "DriveNow",               M + 17, 21);
    txt("#93c5fd",  7, false, "Vehicle Rental Services", M + 17, 27);

    txt("#ffffff", 26, true,  "INVOICE",               W - M, 20, { align: "right" });
    txt("#93c5fd",  8, false, `Issued on ${dateIssued}`, W - M, 28, { align: "right" });
    fillR("#1e3a8a", W - M - 52, 31, 46, 7, 2);
    txt("#bfdbfe",  7, false, invoiceNo, W - M - 4, 36.5, { align: "right" });

    // Amount strip
    fillR("#0f172a", M, 44, CW, 24, 3);
    gradH(M + CW * 0.5, 44, CW * 0.5, 24, [15,23,42], [30,58,138]);
    fillR("#0f172a", M, 44, CW * 0.5, 24, 0);
    txt("#64748b",  7, true,  "AMOUNT PAID", M + 6, 52);
    txt("#ffffff",  20, true, amtStr,         M + 6, 63);
    fillR("#14532d", W - M - 50, 51, 44, 11, 5);
    doc.setFillColor(74,222,128); doc.circle(W - M - 44, 56.5, 2, "F");
    txt("#86efac",  8, true, "Confirmed", W - M - 6, 58.5, { align: "right" });

    // ── BODY (starts at 84mm) ────────────────────────────
    y = HDR + 8;

    // Bill To / Invoice Details
    txt("#94a3b8",  7, true,  "BILL TO", M, y);
    txt("#0f172a", 13, true,  customerName, M, y + 8);
    if (customerEmail) txt("#64748b", 8, false, customerEmail, M, y + 15);

    const RX = W / 2 + 8;
    txt("#94a3b8",  7, true, "INVOICE DETAILS", RX, y);
    const details = [
      ["Invoice No.", invoiceNo],
      ["Issue Date",  dateIssued],
      ["Payment",     "Paid"],
      ["Booking",     bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)],
    ];
    if (ref) details.push(["Ref ID", ref.length > 22 ? ref.slice(0,22) + "…" : ref]);
    details.forEach(([label, val], i) => {
      const dy = y + 8 + i * 7;
      txt("#94a3b8", 8, false, label, RX,    dy);
      txt("#1e293b", 8, true,  val,   W - M, dy, { align: "right" });
    });

    y += 38;
    stroke("#e2e8f0", M, y, W - M, y); y += 8;

    // Booking dates strip
    if (startDate && endDate && days) {
      gradH(M, y, CW, 22, [30,58,138], [37,99,235]);
      const cols = [
        { l: "START DATE",   v: startDate },
        { l: "END DATE",     v: endDate },
        { l: "TOTAL DAYS",   v: String(days) },
        { l: "TOTAL AMOUNT", v: amtStr },
      ];
      const cW = CW / 4;
      cols.forEach(({ l, v }, i) => {
        const cx = M + i * cW + 4;
        if (i > 0) stroke("#3b82f6", M + i * cW, y + 3, M + i * cW, y + 19);
        txt("#bfdbfe", 6, true,  l, cx, y + 8);
        txt("#ffffff", 10, true, v, cx, y + 17);
      });
      y += 29;
    }

    // Rental summary
    txt("#94a3b8", 7, true, "RENTAL SUMMARY", M, y); y += 5;
    fillR("#eff6ff", M, y, CW, 9, 2);
    txt("#475569", 8, true, "DESCRIPTION",   M + 4,        y + 6.5);
    if (days)        txt("#475569", 8, true, "DAYS",     M + CW*0.55, y + 6.5, { align: "center" });
    if (pricePerDay) txt("#475569", 8, true, "PRICE/DAY",M + CW*0.73, y + 6.5, { align: "center" });
    txt("#475569", 8, true, "AMOUNT",        W - M - 4, y + 6.5, { align: "right" });
    y += 9;

    stroke("#e2e8f0", M, y, W - M, y); y += 2;
    txt("#0f172a", 11, true, vehicleName, M + 4, y + 7);
    if (vehicleType) {
      fillR("#eff6ff", M + 4, y + 9, vehicleType.length * 2.2 + 5, 5, 2);
      txt("#2563eb", 7, true, vehicleType.toUpperCase(), M + 7, y + 13);
    }
    if (days)        txt("#334155", 10, true,  String(days), M + CW*0.55, y + 7, { align: "center" });
    if (pricePerDay) txt("#64748b",  9, false, `Rs.${pricePerDay.toLocaleString("en-IN")}`, M + CW*0.73, y + 7, { align: "center" });
    txt("#0f172a",  10, true, amtStr, W - M - 4, y + 7, { align: "right" });
    y += vehicleType ? 20 : 16;

    stroke("#e2e8f0", M, y, W - M, y); y += 8;

    // Totals
    const TX = W / 2 + 22, TW = W - M - TX;
    txt("#94a3b8", 8, false, "Subtotal",    TX, y);
    txt("#475569", 8, true,  amtStr,        W - M, y, { align: "right" });
    y += 6; stroke("#e2e8f0", TX, y, W - M, y); y += 5;
    txt("#94a3b8", 8, false, "Tax (GST 0%)", TX, y);
    txt("#475569", 8, true,  "Rs.0",        W - M, y, { align: "right" });
    y += 6; stroke("#e2e8f0", TX, y, W - M, y); y += 4;
    gradH(TX, y, TW, 13, [30,58,138], [37,99,235]);
    txt("#ffffff", 10, true, "Total",  TX + 4,    y + 9);
    txt("#ffffff", 10, true, amtStr,   W - M - 4, y + 9, { align: "right" });
    y += 19;

    // Payment confirmation
    fillR("#f0fdf4", M, y, CW, 17, 3);
    fill("#16a34a", M, y, 4, 17);
    doc.setFillColor(34,197,94); doc.circle(M + 11, y + 8.5, 3.5, "F");
    txt("#166534", 10, true,  "Payment Successfully Received", M + 18, y + 7);
    const confSub = `${amtStr} paid on ${dateIssued}${ref ? `  ·  Ref: ${ref}` : ""}`;
    txt("#15803d",  7, false, confSub, M + 18, y + 13);
    y += 23;

    // Footer
    stroke("#e2e8f0", M, y, W - M, y); y += 7;
    fillR("#ea580c", M, y - 1, 8, 8, 2);
    txt("#0f172a", 11, true,  "DriveNow",                        M + 12, y + 5.5);
    txt("#94a3b8",  8, false, "Thank you for choosing DriveNow!", W - M, y + 3,   { align: "right" });
    txt("#cbd5e1",  7, false, "support@drivenow.in",              W - M, y + 7.5, { align: "right" });

    const blob = doc.output("blob");
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast.success("Invoice opened — click the download icon in the PDF viewer to save.");
  };

  const previewSrc = (() => {
    const html = generateInvoiceHTML(payment, userInfo);
    const blob = new Blob([html], { type: "text/html" });
    return URL.createObjectURL(blob);
  })();

  const booking = payment?.booking || {};
  const invoiceNo = payment?.invoiceNumber || "—";
  const amount = payment?.amount || 0;
  const dateIssued = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden"
        style={{ height: "92vh" }}>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1d4ed8 100%)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Invoice #{invoiceNo}</p>
              <p className="text-white/55 text-xs">{dateIssued} · ₹{amount.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/12 hover:bg-white/22 text-white text-xs font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print
            </button>

            <button onClick={openInBrowser}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/12 hover:bg-white/22 text-white text-xs font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open
            </button>

            <button onClick={downloadPDF}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Save Invoice
            </button>

            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/12 hover:bg-white/22 flex items-center justify-center text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice preview via iframe (same window = blob URL works) */}
        <iframe
          id="inv-frame"
          src={previewSrc}
          title="Invoice Preview"
          className="flex-1 w-full border-0 bg-slate-100"
          onLoad={() => URL.revokeObjectURL(previewSrc)}
        />
      </div>
    </div>
  );
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePayment, setActivePayment] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/dashboard");
        setPayments(data.payments || []);
      } catch {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPaid = payments.filter((p) => p.status === "captured").reduce((s, p) => s + (p.amount || 0), 0);
  const paidCount = payments.filter((p) => p.status === "captured").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl h-40 animate-pulse" style={{ background: "linear-gradient(135deg,#1e3a5f,#3b82f6)" }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 flex gap-5 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 bg-slate-100 rounded-full w-2/3" />
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
              <div className="h-3 bg-slate-100 rounded-full w-1/4" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-7 bg-slate-100 rounded-full w-24" />
              <div className="h-9 bg-slate-100 rounded-xl w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {activePayment && (
        <InvoiceViewer payment={activePayment} onClose={() => setActivePayment(null)} />
      )}

      <div className="space-y-6">
        {/* Hero */}
        <div className="rounded-3xl relative overflow-hidden text-white shadow-xl"
          style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#1d4ed8 80%,#3b82f6 100%)" }}>
          <div className="relative z-10 p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">Your Payments</p>
                <h1 className="text-4xl font-extrabold tracking-tight">Payment History</h1>
                <p className="mt-2 text-white/65 text-base">{payments.length} transaction{payments.length !== 1 ? "s" : ""} recorded</p>
              </div>
              {totalPaid > 0 && (
                <div className="bg-white/12 backdrop-blur-sm rounded-2xl px-6 py-4 text-right border border-white/15">
                  <p className="text-white/55 text-xs uppercase tracking-wide font-bold">Total Paid</p>
                  <p className="text-3xl font-extrabold mt-0.5">₹{totalPaid.toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
            {payments.length > 0 && (
              <div className="mt-5 flex gap-3 flex-wrap">
                {paidCount > 0 && (
                  <div className="bg-emerald-400/15 border border-emerald-400/25 rounded-xl px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-200 text-sm font-semibold">{paidCount} Successful</span>
                  </div>
                )}
                {failedCount > 0 && (
                  <div className="bg-red-400/15 border border-red-400/25 rounded-xl px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-red-200 text-sm font-semibold">{failedCount} Failed</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/6 rounded-full pointer-events-none" />
          <div className="absolute right-20 bottom-0 w-36 h-36 bg-white/6 rounded-full pointer-events-none" />
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="card py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <p className="font-semibold text-slate-700">No payments yet</p>
              <p className="text-sm text-slate-400 mt-1">Your payment transactions will appear here.</p>
            </div>
          ) : payments.map((payment) => {
            const { label, dot, text, bg } = statusBadge(payment.status);
            const isPaid = payment.status === "captured";
            const isFailed = payment.status === "failed";
            const dateStr = payment.createdAt
              ? new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "";
            const timeStr = payment.createdAt
              ? new Date(payment.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
              : "";

            return (
              <div key={payment._id} className="card card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: isPaid ? "linear-gradient(135deg,#eff6ff,#dbeafe)" : isFailed ? "linear-gradient(135deg,#fef2f2,#fee2e2)" : "linear-gradient(135deg,#fffbeb,#fef3c7)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={isPaid ? "text-blue-600" : isFailed ? "text-red-500" : "text-yellow-600"}>
                    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 text-base truncate">
                      {payment.booking?.vehicle?.title || "Vehicle"}
                    </p>
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      <span className={text}>{label}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    {payment.invoiceNumber && (
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">#{payment.invoiceNumber}</span>
                    )}
                    {dateStr && <p className="text-sm text-slate-400">{dateStr}{timeStr && ` · ${timeStr}`}</p>}
                  </div>
                  {payment.razorpayPaymentId && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">Ref: {payment.razorpayPaymentId}</p>
                  )}
                </div>

                {/* Amount + action */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                  <p className="text-2xl font-extrabold text-slate-900">₹{payment.amount?.toLocaleString("en-IN")}</p>
                  {isPaid && (
                    <button
                      onClick={() => setActivePayment(payment)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", boxShadow: "0 2px 8px rgba(29,78,216,0.3)" }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(29,78,216,0.45)"}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(29,78,216,0.3)"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      View Invoice
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
