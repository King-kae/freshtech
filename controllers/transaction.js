const UserModel = require('../models/userModel');
const TransactionModel = require('../models/transactionModel');;



// Create a new transaction

// POST /api/transaction
// @access private
const createTransaction = async (req, res) => {
console.log(req.user._id)
    const currentUser = await UserModel.findById(req.user._id);
    // console.log(currentUser)
    const { amount, transactionType, service, phoneNumber, accountNumber, paymentMethod, numberNetwork } = req.body;

    try {
        if(!amount || !transactionType || !service || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

         // Conditional validation based on service type
         if ((service === 'Airtime' || service === 'Data') && !phoneNumber && !numberNetwork) {
            return res.status(400).json({ message: 'Phone number and network is required for Airtime or Data services' });
        }

        if ((service === 'Electricity' || service === 'Cable TV') && !accountNumber) {
            return res.status(400).json({ message: 'Account number is required for Electricity or Cable TV services' });
        }

        const userId = currentUser._id;
        const status = "Initiated"
        const transactionId = Math.floor(100000 + Math.random() * 900000000000000).toString();
        const charges = Math.floor(Math.random() * 10);
        const totalAmount = amount + charges;

        const transaction = new TransactionModel({
            amount,
            totalAmount: totalAmount,
            transactionType,
            user: userId,
            status: status || 'Initiated',
            transactionId: transactionId,
            service,
            paymentMethod
        });
        
        if(currentUser.walletBalance < amount + 100) {
            transaction.status = 'Failed'
            transaction.save()
            await UserModel.findByIdAndUpdate(userId, { $push: { transactions: transaction._id } });
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        currentUser.walletBalance -= totalAmount;
        transaction.status = 'Completed'
        await transaction.save();
        await UserModel.findByIdAndUpdate(userId, { $push: { transactions: transaction._id } });
        await currentUser.save();
        res.status(201).json({
            success: true,
            data: transaction,
            message: 'Transaction created successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// Get all transactions

const getAllTransactions = async(req, res) => {
    try {
        const transactions = await TransactionModel.find();
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



// Get a single transaction
const getTransaction = async(req, res) => {
    const { id } = req.params;
    try {
        const transaction = await TransactionModel.findById(id);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




module.exports = {
    createTransaction,
    getAllTransactions,
    getTransaction
} 