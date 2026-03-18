function isLogin(req, res, next) {
    try {
        if (req.session.user) {
            next();
        }
        else {
            res.redirect("/api/");
        }
    } catch (error) {
        console.log("from islogin-", error.message);
    }
}
function isLogout(req, res, next) {
    try {
        if (req.session.user) {
            return res.redirect("/api/dashboard");
        } else {
            next();
        }

    } catch (error) {
        // console.log("from islogout-", error.message);
    }

}

module.exports = { isLogin, isLogout }