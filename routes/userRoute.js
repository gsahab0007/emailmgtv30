const express = require('express');
const { homeGetCtr, dashGetCtr, loginPostCtr, logoutGetCtr } = require('../controllers/userCtr');
const { isLogin, isLogout } = require('../config/auth');
const router = express.Router();




router.get('/', isLogout, homeGetCtr);
router.post('/', isLogout, loginPostCtr);
router.get('/logout', logoutGetCtr);
router.get('/dashboard', isLogin, dashGetCtr);





module.exports = router;