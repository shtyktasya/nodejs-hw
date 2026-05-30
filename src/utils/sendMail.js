import nodemailer from 'nodemailer';
import axios from 'axios';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    secure: Number(process.env.SMTP_PORT) === 465,
  },
});

export const sendMail = async (options) => {
  // Якщо є BREVO_API_KEY — використовуємо Brevo API (рекомендовано)
  if (process.env.BREVO_API_KEY) {
    try {
      console.log('📧 Відправка через Brevo API...');

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: "Notes App",
            email: options.from || process.env.SMTP_FROM
          },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html
        },
        {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('✅ Лист відправлено через Brevo API');
      return response.data;
    } catch (error) {
      console.error('❌ Brevo API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Якщо BREVO_API_KEY немає — fallback на старий SMTP
  console.log('📧 Відправка через SMTP (Nodemailer)...');
  return await transporter.sendMail(options);
};
