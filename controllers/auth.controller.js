const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

require('../auth/auth')
require('../auth/google')



// Signup a new user
// POST /api/auth/signup
// @access public
const signup = async(req, res, next) => {
    passport.authenticate('signup', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (info) {
            return res.status(400).json({ message: info.message })
        }
        // console.log(user)
        return res.status(201).json({ 
            success: true,
            data: user,
            message: 'User created successfully' 
        })
    })(req, res, next)
}


const googleSignIn = async(req, res, next) => {
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })(req, res, next) 
}

const googleSignInCallback = async(req, res, next) => {
    passport.authenticate('google', {
        successRedirect: '/auth/success',
        // failureRedirect: '/failure'
    })(req, res, next)
}


const googleSignInRedirect = async(req, res, next) => {
    const body = { _id: req.user._id };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h"
      })
      if (!token) {
          res.send({
              message: "Invalid token"
          })
      }
      console.log(req.user)
      res.status(200).json({
        success: true,
        user: req.user,
        data: token
    })
}

// Login as an existing user
// POST /api/auth/login
// @access public
const login = async(req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try{
            if (err) {
                return next(err)
            }
            if (info) {
                return res.status(400).json({ message: info.message })
            }
            req.login(user, { session: false},
                async (error) => {
                    if (error) return next(error)
                
                    const body = { _id: user._id }
                    const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY, { expiresIn: '8h'})
                    res.cookie("jwt", token, {
                        httpOnly: false,
                        expiresIn: "8h",
                    });
                    console.log(token)
                    // return next(user, null)
                    return res.status(200).json({ 
                        success: true,
                        data: token,
                        user,
                        message: 'User logged in successfully' 
                    })
                })
            
            
        } catch (err) {
            return res.status(500).json({ message: 'Error logging in user' })
        }
    })(req, res, next)
}


// Private Route
// @route GET /api/auth/profile
// @access private



const logOut = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { accountStatus: 'not active' });
      res.cookie("jwt", "none", {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
      });
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error.message, "error in logout controller");
    }
};

module.exports = { 
    signup, 
    googleSignIn,
    googleSignInCallback,
    googleSignInRedirect,
    login, 
    logOut
}