const { Schema, model } = require('mongoose');


const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['Deposit', 'Withdrawal'],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Initiated', 'Completed', 'Failed'],
        default: ''
    },
    transactionId: {
        type: String,
        required: true
    },
    service: {
        type: String,
        enum: ['Airtime', 'Data', 'Electricity', 'Cable TV', 'Transfer'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Card Payment', 'Wallet'],
        required: true
    },
})

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;