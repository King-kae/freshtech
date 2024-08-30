const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors');
const PORT = 3000;
const session = require('express-session')
const { connectToMongoDB } = require('./db/connectToDB');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const transactionRouter = require('./routes/transaction');
const passport = require('passport');

connectToMongoDB();

require('./auth/auth');

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.json());

app.use(cookieParser())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());




app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/transaction', passport.authenticate('jwt', { session: false }), transactionRouter);


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    }
);