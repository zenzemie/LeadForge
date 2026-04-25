const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

router.get('/', leadController.getAllLeads);
router.post('/', leadController.createLead);
router.post('/discover', leadController.discoverLeads);
router.get('/:id', leadController.getLeadById);
router.patch('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

module.exports = router;
