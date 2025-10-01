const express = require('express');
const router = express.Router();
const isoCtrl = require('../controllers/isoController');
const auth = require('../middleware/authMiddleware');

router.post('/register', isoCtrl.registerIso);
router.post('/login', isoCtrl.loginIsoUser);
router.get('/users', auth, isoCtrl.getIsoUsers);
router.get('/user/:id', auth, isoCtrl.getIsoUser);
router.delete('/user/:id', auth, isoCtrl.deleteIsoUser);

module.exports = router;
