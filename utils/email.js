const nodemailer = require("nodemailer");

async function sendVerificationCode(email, code) {
  try {
    // Настройки для отправки электронных писем через SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_SEND_EMAIL,
        pass: process.env.GOOGLE_SEND_PASS,
      },
    });

    // Опции письма
    const mailOptions = {
      from: process.env.GOOGLE_SEND_EMAIL,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${code}`,
    };

    // Отправка письма
    await transporter.sendMail(mailOptions);
    console.log("Verification code email sent successfully.");
    return true; // Успешно отправлено
  } catch (error) {
    console.error("Error sending verification code email:", error);
    return false; // Ошибка при отправке
  }
}

module.exports = sendVerificationCode;
