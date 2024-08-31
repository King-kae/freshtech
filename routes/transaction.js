const express = require('express');
const transactionRoute = express.Router();
const { createTransaction, getAllTransactions, getTransaction } = require('../controllers/transaction');


transactionRoute.post('/create', createTransaction);
transactionRoute.get('/all', getAllTransactions);
transactionRoute.get('/:id', getTransaction); 



module.exports = transactionRoute