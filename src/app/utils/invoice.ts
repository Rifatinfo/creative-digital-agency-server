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

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffers: Uint8Array[] = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));

            // ===== HEADER =====
            doc
                .fontSize(28)
                .fillColor("#1a1a1a")
                .text("INVOICE", { align: "center" });

            doc.moveDown(0.5);
            doc
                .fontSize(12)
                .fillColor("#555")
                .text(`Date: ${invoiceData.bookingDate.toLocaleDateString()}`, { align: "right" })
                .text(`Invoice #: ${invoiceData.stripeSessionId}`, { align: "right" });

            doc.moveDown(2);

            // ===== CUSTOMER INFO =====
            doc.fontSize(14).fillColor("#000").text("Billed To:");
            doc.moveDown(0.2);
            doc.fontSize(12).fillColor("#333");
            doc.text(`Name: ${invoiceData.fullName}`);
            doc.text(`Email: ${invoiceData.customerEmail}`);
            if (invoiceData.company) doc.text(`Company: ${invoiceData.company}`);
            if (invoiceData.phone) doc.text(`Phone: ${invoiceData.phone}`);

            doc.moveDown(2);

            // ===== PAYMENT INFO =====
            doc.fontSize(14).fillColor("#000").text("Payment Details:");
            doc.moveDown(0.5);

            const startY = doc.y;
            const column1X = 50;
            const column2X = 300;
            const column3X = 450;

            // Table Header
            doc.fontSize(12).fillColor("#000").text("Plan", column1X, startY);
            doc.text("Amount", column2X, startY);
            doc.text("Currency", column3X, startY);

            doc.moveDown(0.5);

            // Table Row
            doc.fontSize(12).fillColor("#333");
            doc.text(invoiceData.planName, column1X, doc.y);
            doc.text(invoiceData.amount.toFixed(2), column2X, doc.y);
            doc.text(invoiceData.currency, column3X, doc.y);

            doc.moveDown(3);

            // ===== FOOTER =====
            doc
                .fontSize(12)
                .fillColor("#1a1a1a")
                .text("Thank you for your business!", { align: "center" });

            doc.moveDown(0.5);
            doc
                .fontSize(10)
                .fillColor("#888")
                .text("This is a system generated invoice and does not require a signature.", { align: "center" });

            doc.end();
        });
    } catch (error: any) {
        console.log(error);
        throw new AppError(500, `PDF creation error: ${error.message}`);
    }
};
