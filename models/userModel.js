const  { mongoose, Schema, model } = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/'
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Not Active'],
        default: 'Not Active'
    },
    password: {
        type: String,
        required: true,
    },
    referralCode: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ReferralCode' 
    },
    referralLink: {
        type: String,
    },
    walletBalance: {
        type: String,
        default: 10000
    },
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' 
    }],
}, { timestamps: true });


// Verify the password of the user
userSchema.methods.verifyPassword = async function(password) {
    const user = this
    return await bcrypt.compare(password, user.password)

}

const User = model('User', userSchema);

module.exports = User;