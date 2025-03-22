const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="text-align: center; color: #444;">Reset Your Password</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Click the button below to proceed.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
            style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 16px;">If you did not request this, please ignore this email. This link will expire in <strong>1 hour</strong>.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 14px; color: #777; text-align: center;">Need help? Contact our support team.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
