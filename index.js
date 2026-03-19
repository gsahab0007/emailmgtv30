const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const { connectDB, mongoDB } = require("./config/db");
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');



const port = process.env.PORT || 3000;
connectDB();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));




app.use(session({
    name: "emailSess.sid",
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60, // one hour
    store: MongoStore.create({
        // mongoUrl: process.env.MONGODB_URI,
        mongoUrl: mongoDB,        
        autoRemove: 'interval',
        ttl: 60 * 15 // 15 mint
    })
}));

app.use(express.json());
app.use(flash());
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', require('./routes/userRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/show', require('./routes/emailDataRoute'));


app.listen(port, () => {
    console.log(`Server running: http://localhost:${port}/api`);
});

module.exports = app;
