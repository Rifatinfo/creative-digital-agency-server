import PDFDocument from "pdfkit";
import AppError from "../middlewares/AppError";

export interface IInvoiceData {
  stripeSessionId: string;
  bookingDate: Date;
  fullName: string;
  customerEmail: string;
  company?: string;
  phone?: string;
  planName: string;
  amount: number;
  currency: string;
}

export const generatePdf = async (data: IInvoiceData): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

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
        .text(
          `Date: ${data.bookingDate.toDateString()}`,
          350,
          topY + 30
        );

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
        .text(
          `Total: ${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`,
          350,
          y
        );

      /* ================= FOOTER ================= */
      doc
        .fontSize(10)
        .fillColor("#777")
        .text(
          "Thank you for choosing our service.",
          50,
          760,
          { align: "center" }
        )
        .text(
          "This is a system generated invoice. No signature required.",
          50,
          775,
          { align: "center" }
        );

      doc.end();
    });
  } catch (error: any) {
    throw new AppError(500, `PDF creation error: ${error.message}`);
  }
};
