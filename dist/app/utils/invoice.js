"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../middlewares/AppError"));
const generatePdf = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffers = [];
            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);
            /* ================= HEADER ================= */
            const topY = 50;
            doc
                .fontSize(26)
                .fillColor("#C73450")
                .text("INVOICE", 50, topY);
            doc
                .fontSize(10)
                .fillColor("#333")
                .text(`Invoice ID: ${data.stripeSessionId}`, 350, topY)
                .text(`Date: ${data.bookingDate.toDateString()}`, 350, topY + 30);
            doc.moveTo(50, topY + 45).lineTo(545, topY + 45).stroke();
            /* ================= CUSTOMER INFO ================= */
            let y = topY + 65;
            doc.fontSize(13).fillColor("#000").text("Billed To", 50, y);
            y += 15;
            doc.fontSize(11).fillColor("#333");
            doc.text(`Name: ${data.fullName}`, 50, y);
            y += 15;
            doc.text(`Email: ${data.customerEmail}`, 50, y);
            y += 15;
            if (data.company) {
                doc.text(`Company: ${data.company}`, 50, y);
                y += 15;
            }
            if (data.phone) {
                doc.text(`Phone: ${data.phone}`, 50, y);
                y += 15;
            }
            /* ================= TABLE ================= */
            y += 25;
            const tableTop = y;
            const col1 = 50;
            const col2 = 350;
            const col3 = 460;
            // Header background
            doc
                .rect(50, tableTop, 495, 30)
                .fill("#C73450");
            doc
                .fillColor("#FFF")
                .fontSize(11)
                .text("Service Plan", col1 + 5, tableTop + 8)
                .text("Amount", col2 + 5, tableTop + 8)
                .text("Currency", col3 + 5, tableTop + 8);
            // Row
            const rowY = tableTop + 30;
            doc
                .fillColor("#000")
                .rect(50, rowY, 495, 35)
                .stroke();
            doc
                .fontSize(11)
                .text(data.planName, col1 + 5, rowY + 10)
                .text(data.amount.toFixed(2), col2 + 5, rowY + 10)
                .text(data.currency.toUpperCase(), col3 + 5, rowY + 10);
            /* ================= TOTAL ================= */
            y = rowY + 55;
            doc
                .fontSize(10)
                .fillColor("#000")
                .text(`Total: ${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`, 350, y);
            /* ================= FOOTER ================= */
            doc
                .fontSize(10)
                .fillColor("#777")
                .text("Thank you for choosing our service.", 50, 760, { align: "center" })
                .text("This is a system generated invoice. No signature required.", 50, 775, { align: "center" });
            doc.end();
        });
    }
    catch (error) {
        throw new AppError_1.default(500, `PDF creation error: ${error.message}`);
    }
});
exports.generatePdf = generatePdf;
