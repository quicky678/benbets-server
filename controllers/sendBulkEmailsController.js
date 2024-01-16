const pool = require("../db/db");
const constants = require("../constants/constants");
const compileHTMLPayload = require("../lib/compileHTMLPayload");
const sendEmail = require("../lib/sendEmail");

const categories = constants.CATEGORIES; // prediction categories

const getEmailAddressesByCategory = async (category) => {
  try {
    // Use parameterized queries to safely handle user input
    const emailsResult = await pool.query(
      "SELECT user_email FROM users WHERE user_category = $1",
      [category]
    );

    // Extract email addresses from the result
    const emailsArray = emailsResult.rows.map((row) => row.user_email);

    return emailsArray;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error fetching emails:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

const getTodaysPredictions = async (category) => {
  try {
    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Use parameterized queries to safely handle user input
    const predictionsResult = await pool.query(
      "SELECT home_team, away_team, league, html_response FROM predictions WHERE category = $1 AND DATE(date) = $2",
      [category, today]
    );

    // Return the predictions retrieved for today
    return predictionsResult.rows;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error fetching predictions:", error);
    return [];
  }
};

const updateEmailsAudit = async (category, emailsCount) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const status = true;

    // Check if the entry for today and the category exists in the emails_audit table
    const existingAuditResult = await pool.query(
      "SELECT * FROM emails_audit WHERE date = $1 AND category = $2",
      [today, category]
    );

    if (existingAuditResult.rows.length > 0) {
      console.log("Audit already exists.");
      return;
    } else {
      // Insert a new entry for today and the category if it doesn't exist
      await pool.query(
        "INSERT INTO emails_audit (date, category,status, emails_sent) VALUES ($1, $2, $3)",
        [today, category, status, emailsCount]
      );
      console.log("Audit created.");
      return;
    }
  } catch (error) {
    console.error("Error updating emails audit:", error);
    return;
  }
};

const sendBulkEmails = async (req, res) => {
  try {
    const { category } = req.body;
    let emailsCount = 0;

    // Check if valid category
    if (categories.includes(category.toUpperCase())) {
      const emails = await getEmailAddressesByCategory(category);
      const predictionsData = await getTodaysPredictions(category);

      if (predictionsData.length) {
        // Get HTML Payload
        const payload = compileHTMLPayload(predictionsData);
        const emailSubject = `Analysis/Predictions ${
          new Date().toISOString().split("T")[0]
        }`;
        //send emails
        emails.forEach((email) => {
          // Call the sendEmail method
          sendEmail(email, emailSubject, payload)
            .then((response) => {
              emailsCount++;
              console.log("Email sent:", response);
            })
            .catch((error) => {
              console.error("Failed to send email:", error);
            });
        });

        // update emails audit
        updateEmailsAudit(category.toLowerCase(), emailsCount);

        res.status(200).json({ message: "Emails sent successfully" }); // Respond with success message
      } else {
        // Handle case when predictions are not found for today
        res.status(404).json({ error: "Predictions not found for today" });
      }
    } else {
      res.status(400).json({ error: "Invalid category" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTodaysEmailAudit = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await pool.query(
      "SELECT * FROM emails_audit WHERE date=$1",
      [today]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching email audit:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendBulkEmails,
  getTodaysEmailAudit,
};
