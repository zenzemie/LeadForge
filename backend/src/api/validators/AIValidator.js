const { body } = require('express-validator');

exports.generateMessage = [
  body('name').optional().isString().trim(),
  body('industry').optional().isString().trim(),
  body('template').optional().isString().trim(),
  body().custom((value) => {
    if (!value.name && !value.industry && !value.template) {
      throw new Error('At least one parameter (name, industry, or template) is required');
    }
    return true;
  }),
];

exports.triggerNexus = [
  body('target').optional().isString().trim(),
];
