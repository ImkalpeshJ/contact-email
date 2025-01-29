const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Updated contact endpoint
app.post('/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">
            New Contact Form Submission
          </h3>
          
          <table style="width: 100%; margin-top: 1.5rem;">
            <tr>
              <td style="padding: 0.5rem; width: 120px; color: #4a5568; font-weight: 500;">Name:</td>
              <td style="padding: 0.5rem;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; color: #4a5568; font-weight: 500;">Email:</td>
              <td style="padding: 0.5rem;">
                <a href="mailto:${email}" style="color: #4299e1; text-decoration: none;">
                  ${email}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; color: #4a5568; font-weight: 500;">Phone:</td>
              <td style="padding: 0.5rem;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; color: #4a5568; font-weight: 500;">Message:</td>
              <td style="padding: 0.5rem; line-height: 1.5;">${message}</td>
            </tr>
          </table>

          <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; color: #718096;">
            <small>Copyright © URVISA 2024 All Rights Reserved.</small>
          </div>
        </div>
      `,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}
      `,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});