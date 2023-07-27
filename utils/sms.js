const twilio = require("twilio");

const sendSms = async (toNumber, message) => {
  try {
    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: toNumber,
    });
    console.log("SMS sent succesfully!");
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
};

module.exports = sendSms;
