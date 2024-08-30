const express = require('express');
const userRoute = express.Router();
const {   updateProfile,
    changePassword,
    getUserTransactions,
    getUserProfileById, } = require('../controllers/user');

userRoute.post('/update/:id', updateProfile);
userRoute.put('/change-password/:id', changePassword);
userRoute.get('/transactions/:id', getUserTransactions);
userRoute.get('/profile/:id', getUserProfileById);




module.exports = userRoute