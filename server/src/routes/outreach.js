const express = require('express');
const outreachController = require('../controllers/outreachController');
const { heavyTaskLimiter } = require('../middleware/rateLimitMiddleware');
const { validateRequest, schemas } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/generate', validateRequest(schemas.generateOutreach), outreachController.generateMessage);
router.post('/send', heavyTaskLimiter, validateRequest(schemas.sendEmail), outreachController.sendEmailOutreach);

module.exports = router;
