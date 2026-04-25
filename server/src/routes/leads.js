const express = require('express');
const leadController = require('../controllers/leadController');
const { heavyTaskLimiter } = require('../middleware/rateLimitMiddleware');
const { validateRequest, schemas } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', leadController.getAllLeads);
router.post('/', leadController.createLead);
router.post('/discover', heavyTaskLimiter, validateRequest(schemas.discover), leadController.discoverLeads);
router.get('/:id', leadController.getLeadById);
router.patch('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

module.exports = router;
