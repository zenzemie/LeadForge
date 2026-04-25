const express = require('express');
const leadRoutes = require('./leads');
const outreachRoutes = require('./outreach');

const router = express.Router();

router.use('/leads', leadRoutes);
router.use('/outreach', outreachRoutes);

module.exports = router;
