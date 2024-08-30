const express = require('express');
const authRoute = express.Router();
const { signup, login, logOut, googleSignIn, googleSignInCallback, googleSignInRedirect } = require('../controllers/auth.controller');
const passport = require('passport');

require('../auth/auth')

authRoute.post('/signup', signup);
authRoute.post('/login', login)
authRoute.post('/logout', passport.authenticate('jwt', { session: false }), logOut)
authRoute.get('/google', googleSignIn)
authRoute.get('/google/callback', googleSignInCallback)
authRoute.get('/success', googleSignInRedirect)

module.exports = authRoute