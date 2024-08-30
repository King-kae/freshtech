const Counter = require('../models/counterModel');

function generateSequentialPart(number) {
    return String(number).padStart(2, '0'); // Pads the number to 2 digits
} 

// Function to generate a random alphanumeric part
function generateRandomPart(length = 7) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomPart = '';
    for (let i = 0; i < length; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomPart;
}

// Function to generate the referral code
const generateReferralCode = (sequentialNumber) => {
    const sequentialPart = generateSequentialPart(sequentialNumber);
    const randomPart = generateRandomPart();
    return `${sequentialPart}/${randomPart}`;
}

// Function to get and increment the sequential number
const getNextSequenceValue = async(sequenceName) => {
    const counter = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}


module.exports = {
    generateReferralCode,
    getNextSequenceValue
}