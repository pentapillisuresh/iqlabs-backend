const express = require('express');
const router = express.Router();
const careerCtrl = require('../controllers/careerController');
const auth = require('../middleware/authMiddleware');

router.post('/register', careerCtrl.registerCareerUser);
router.post('/login', careerCtrl.loginCareerUser);
router.post('/submit-answers/:userId', auth, careerCtrl.submitAnswers);
router.get('/users', auth, careerCtrl.getCareerUsers);
router.get('/user/:id', auth, careerCtrl.getCareerUser);
router.get('/user/:id/pdf', auth, careerCtrl.getCareerPdf);

module.exports = router;
