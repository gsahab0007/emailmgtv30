const express = require('express');
const { showallGetCtr, addClgGetCtr, addClgPostCtr, emailForCopyGetCtr, email50GetCtr, editClgGetCtr, editClgPostCtr, delClgGetCtr, delClgDelCtr, showSingleClgTypeGetCtr, hideClgGetCtr, hideClgPostCtr } = require('../controllers/emailDataCtr');
const router2 = express.Router();
const { isLogin, isLogout } = require('../config/auth');


router2.get('/showall', isLogin, showallGetCtr);

router2.get('/showsingleclgtype', isLogin, showSingleClgTypeGetCtr);

router2.get('/addclg', isLogin, addClgGetCtr);
router2.post('/addclg', isLogin, addClgPostCtr);

router2.get('/editclg', isLogin, editClgGetCtr);
router2.post('/editclg', isLogin, editClgPostCtr);

router2.get('/delclg', isLogin, delClgGetCtr);
router2.post('/delclg', isLogin, delClgDelCtr);


router2.get('/hideclg', isLogin, hideClgGetCtr);
router2.post('/hideclg', isLogin, hideClgPostCtr);

router2.get('/emailscp', isLogin, emailForCopyGetCtr);

router2.get('/email50', isLogin, email50GetCtr);







module.exports = router2;