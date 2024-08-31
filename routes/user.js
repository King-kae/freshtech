const express = require('express');
const userRoute = express.Router();
const upload = require('../middleware/fileUpload')
const {   updateProfile, changePassword, getUserTransactions, getUserProfileById, } = require('../controllers/user');

userRoute.post('/update/:id', upload.single('avatar'), updateProfile);
userRoute.put('/change-password/:id', changePassword);
userRoute.get('/transactions/:id', getUserTransactions);
userRoute.get('/profile/:id', getUserProfileById);




module.exports = userRoute