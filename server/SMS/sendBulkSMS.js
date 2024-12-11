const SMS = require('./atclient'); // Import the initialized SMS client

async function sendBulkSMS(recipients, message) {
    try {
        const response = await SMS.send({
            to: recipients, // Array of phone numbers
            message: message,
        });
        console.log('SMS sent successfully:', response);
    } catch (error) {
        console.error('Failed to send SMS:', error);
    }
}

module.exports = sendBulkSMS;
