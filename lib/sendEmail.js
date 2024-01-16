require("dotenv").config();
const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
  {
    config: {},
    options: {},
  }
);

const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.FROM_EMAIL,
          },
          To: [
            {
              Email: toEmail,
            },
          ],
          Subject: subject,
          HTMLPart: htmlContent, // HTML content of the email
        },
      ],
    });

    const result = await request;
    return result.body;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
