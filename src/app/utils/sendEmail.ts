import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
// import AppError from "../middlewares/AppError";

const transporter =  nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
});

// transporter.verify();
console.log("✅ SMTP Server is ready");


interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envVars.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })
        console.log(`\u20709\uFE0F Email send to ${to} : ${info.messageId}`);

    } catch (error) {
        console.error("❌ Email send failed:", error);
        return false;
    }

}