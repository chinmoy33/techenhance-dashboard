const twilio = require('twilio');

const dotenv = require('dotenv');

dotenv.config();

// Replace with your Twilio trial credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

module.exports = {client};