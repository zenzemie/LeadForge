const { body, param } = require('express-validator');

exports.create = [
  body('name').isString().trim().notEmpty(),
  body('industry').isString().trim().notEmpty(),
  body('messageTemplate').isString().trim().notEmpty(),
];

exports.idParam = [
  param('id').isUUID(),
];
