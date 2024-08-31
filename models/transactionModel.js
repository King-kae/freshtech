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
        enum: ['Airtime', 'Data', 'Electricity', 'Cable TV'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Card Payment', 'Wallet'],
        required: true
    },
    numberNetwork: {
        type: String,
        validate: {
            validator: function(v) {
                if (this.service === 'Airtime' || this.service === 'Data') {
                    return ['MTN', 'Glo', 'Airtel', '9mobile'].includes(v);  // Only validate if service is Airtime or Data
                }
                return true;  // Ignore validation if service is not Airtime or Data
            },
            message: props => `${props.value} is not a valid network!`
        }
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                if (this.service === 'Airtime' || this.service === 'Data') {
                    return /^[0-9]{10,15}$/.test(v);  // Only validate if service is Airtime or Data
                }
                return true;  // Ignore validation if service is not Airtime or Data
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    accountNumber: {
        type: String,
        validate: {
            validator: function(v) {
                if (this.service === 'Electricity' || this.service === 'Cable TV') {
                    return /^[0-9]{5,20}$/.test(v);  // Only validate if service is Electricity or Cable TV
                }
                return true;  // Ignore validation if service is not Electricity or Cable TV
            },
            message: props => `${props.value} is not a valid account number!`
        }
    }
}, { timestamps: true });

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;