const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/userModel')
const ReferralCode = require('../models/referralCodeModel')
const bcrypt = require('bcrypt')
const { generateReferralCode, getNextSequenceValue } = require('../middleware/generateCode')
require('dotenv').config()

passport.use(
    new JwtStrategy(
        {
            secretOrKey: process.env.JWT_SECRET_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async function (token, done) {
            try {
                return done(null, token.user)
            } catch (error) {
                done(error)
            }
        }
    )
)


passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const res = req.res
                const { fullname, phoneNumber, passwordConfirm, referralCode } = req.body

                console.log(req.body)
                if (!fullname || !password || !email || !phoneNumber || !passwordConfirm) {
                    return res.status(400).json({ message: 'All fields are required' })
                }

                // Check if the user already exists
                const user = await User.findOne({ email })
                if (user) {
                    return res.status(400).json({ message: 'User already exists' })
                }

                // Check if the password and passwordConfirm match
                if (password !== passwordConfirm) {
                    return res.status(400).json({ message: 'Passwords do not match' })
                }
                // Get the next sequential number
                const sequentialNumber = await getNextSequenceValue('userSeq');

                // Hash the password
                const hashPassword = await bcrypt.hash(password, 10)


                // Create a new user 
                const newUser = new User({ fullname, email, phoneNumber, password: hashPassword, })
                console.log(newUser)
                newUser.accountStatus = "Active"

                // Generate and assign a unique referral code to the new user
                const newReferralCode = new ReferralCode({
                    code: generateReferralCode(sequentialNumber),
                    owner: newUser._id
                });
                await newReferralCode.save();

                const referralLink = `${process.env.CLIENT_URL}/signup?referralCode=${newReferralCode.code}`;
                newUser.referralCode = newReferralCode._id;
                newUser.referralLink = referralLink;
                await newUser.save()  

                // If a referral code is provided, track the referral
                if (referralCode) {
                   const referringCode = await ReferralCode.findOne({ code: referralCode });
                   if (referringCode) {
                       referringCode.referredUsers.push(newUser._id);
                       await referringCode.save();
                   } else {
                       return res.status(400).json({ message: 'Invalid referral code.' });
                   }
                }

                return done(null, newUser)
            } catch (err) {
                const res = req.res
                res.status(500).json({ message: `Error creating user: ${err.message}` })
            }
        }
    )
)

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                // Get response object from request body
                const res = req.res

                // Find the user with the email
                const user = await User.findOne({ email })
                if (!user) {
                    return res.status(404).json({
                        status: false,
                        message: 'User not found'
                    })
                }

                const validate = await user.verifyPassword(password)
                if (!validate) {
                    return res.status(401).send({
                        status: false,
                        message: 'Wrong password'
                    })
                }

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    )
)