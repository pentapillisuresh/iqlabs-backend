const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.adminLogin);

module.exports = router;
