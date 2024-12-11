require('dotenv').config()

const africastalking = require('africastalking');

const credentials = {
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME
};

const AT = africastalking(credentials);
module.exports = AT.SMS;

