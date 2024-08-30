const UserModel = require('../models/userModel');
const TransactionModel = require('../models/transactionModel');;



// Create a new transaction

// POST /api/transaction
// @access private
const createTransaction = async (req, res) => {

    const currentUser = await UserModel.findById(req.user.id);
    const { amount, totalAmount, transactionType, status, transactionId, service, paymentMethod } = req.body;
    try {
        const userId = currentUser._id;
        const transaction = new TransactionModel({
            amount,
            totalAmount,
            transactionType,
            user: userId,
            status,
            transactionId,
            service,
            paymentMethod
        });
        if(currentUser.walletBalance < amount) {
            transaction.status = 'Failed'
            transaction.save()
            await UserModel.findByIdAndUpdate(userId, { $push: { transactions: transaction._id } });
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        currentUser.walletBalance -= amount;
        await transaction.save();
        await UserModel.findByIdAndUpdate(userId, { $push: { transactions: transaction._id } });
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