const mongoose = require('mongoose');

const referralCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const ReferralCode = mongoose.model('ReferralCode', referralCodeSchema);

module.exports = ReferralCode;
