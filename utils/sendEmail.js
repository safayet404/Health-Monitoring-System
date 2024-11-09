const nodemailer = require("nodemailer");
const { evaluateHealthStatus } = require("./HealthUtils"); // Adjust path as necessary
require("dotenv").config(); // Load environment variables
const Health = require("../model/healthModel"); // Adjust path as necessary for your Health model

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Health alert email function
const sendHealthAlert = (
  email,
  userName,
  subject = "Health Alert",
  customMessage
) => {
  const message =
    customMessage ||
    `Dear ${userName}, your health status is concerning. Please take necessary actions.`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error occurred:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

// Function to monitor health data
const monitorHealthData = async () => {
  try {
    console.log("Fetching health data...");
    const usersData = await Health.find({}); // Fetch all records from the Health collection
    console.log("Fetched health data:", usersData);

    usersData.forEach((user) => {
      const { userEmail, userId } = user;
      evaluateHealthStatus(user);

      if (user.healthStatus === "Not well" && user.notWellReasons.length > 0) {
        const customMessage = `Dear User (${userId}), your recent health check indicates: \n- ${user.notWellReasons.join(
          "\n- "
        )}`;
        sendHealthAlert(
          userEmail,
          userId,
          "Unusual Health Alert",
          customMessage
        );
      }
    });
  } catch (error) {
    console.error("Error fetching health data:", error);
  }
};

// Export the monitorHealthData function
module.exports = { monitorHealthData };
