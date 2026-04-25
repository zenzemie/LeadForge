const express = require('express');
const outreachController = require('../controllers/outreachController');

const router = express.Router();

router.post('/generate', outreachController.generateMessage);
router.post('/send', outreachController.sendEmailOutreach);

module.exports = router;
