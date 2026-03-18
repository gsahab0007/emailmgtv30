const userModel = require('../models/userModel');
// const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// GET login page
homeGetCtr = (req, res) => {

    res.status(200).render('login', { title: "login", message: req.flash("message") });
}

// POST login 
loginPostCtr = async (req, res) => {
    try {
        const { username, password } = req.body;

        const isUser = await userModel.findOne({ username, password });
        if (!isUser) {
            req.flash("message", "Use right credentials !");
            return res.status(401).redirect('/api/');
        }

        try {
            req.session.user = {
                username, isLoggedIn: true
            }
            await req.session.save();
            res.status(200).redirect('/api/dashboard');
        } catch (error) {
            console.log("Error in save session: ", error.message);
            res.status(500).redirect(/api/);
        }

        // res.status(200).redirect('/api/');
    } catch (error) {
        req.flash("message", "login failed..!");
        // console.log('logn post err: ', error.message);
        res.status(500).redirect('/api');
    }
}

dashGetCtr = (req, res) => {
    res.status(200).render('dashboard', { title: "Dashboard" });
}

logoutGetCtr = async (req, res) => {
    await req.session.destroy((err) => {
        if (err) {
            res.status(500).redirect('/api/dashboard');
        }
        else {
            res.status(200).redirect('/api/');
        }
    });
}
module.exports = { homeGetCtr, dashGetCtr, loginPostCtr, logoutGetCtr }