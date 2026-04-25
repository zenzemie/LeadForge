const { body } = require('express-validator');

exports.import = [
  body('campaignId').isUUID(),
  body('leads').isArray().notEmpty(),
  body('leads.*.email').isEmail(),
  body('leads.*.name').optional().isString().trim(),
];

exports.forget = [
  body('email').isEmail(),
];
