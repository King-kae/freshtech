const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const ReferralCode = require('../models/referralCodeModel')
const { generateReferralCode, getNextSequenceValue } = require('../middleware/generateCode')
require('dotenv').config()




passport.serializeUser(function( user, done) {
    done(null, user)
});

passport.deserializeUser(function( user, done) {
    done(null, user)
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + '/auth/google/callback',
        passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        // return console.log(profile)
        try {
            const existingUser = await User.findOne({ email: profile.email });
            if (existingUser) {
                return done(null, existingUser)
            }

            const user = {
                fullname: profile.displayName,
                email: profile.email,
                password: await bcrypt.hash(profile.id, 10),
                phoneNumber: '000000',
            }
            const newUser = await new User(user)
            
            newUser.accountStatus = "Active"

            // Get the next sequential number
            const sequentialNumber = await getNextSequenceValue('userSeq');


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
            
            return done(null, newUser)

        } catch (err) {
            return done(err.message) 
        }
    }
))