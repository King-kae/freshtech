const UserModel = require('../models/userModel');
const TransactionModel = require('../models/transactionModel');




// Update User Profile

// PUT /api/user/profile
// @access private

const updateProfile = async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    const { fullname, email, phoneNumber } = req.body;
    try {
        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        await user.save();
        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Change Password 

// PUT /api/user/change-password
// @access private

const changePassword = async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    try {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get user transactions

// GET /api/user/transactions/:id
// @access private

const getUserTransactions = async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    try {
        const transactions = await TransactionModel.find({ user: user._id });
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getUserProfileById = async(req, res, next) => {
    const id = req.params.id
    try{
        const user = await UserModel.findById(id).populate('referralCode')
        if (user){
            return res.status(200).json({
                success: true,
                data: user,
            })
        } else{
            res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
    }catch(err){
        res.status(404).json(err.message)
    }
}




module.exports = {
    updateProfile,
    changePassword,
    getUserTransactions,
    getUserProfileById,
}
