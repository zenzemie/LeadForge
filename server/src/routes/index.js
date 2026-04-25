const express = require('express');
const leadRoutes = require('./leads');

const router = express.Router();

router.use('/leads', leadRoutes);

module.exports = router;
