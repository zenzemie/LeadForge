const express = require('express');
const leadRoutes = require('./leads');
const outreachRoutes = require('./outreach');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.use('/leads', leadRoutes);
router.use('/outreach', outreachRoutes);

module.exports = router;
