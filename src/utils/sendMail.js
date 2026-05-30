import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    secure: Number(process.env.SMTP_PORT) === 465,
  },
  tls: {
    rejectUnauthorized: false
  },
});

export const sendMail = async (options) => {
  return await transporter.sendMail(options);
};
