const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

const schemas = {
  discover: Joi.object({
    category: Joi.string().required().valid(
      'restaurant', 'salon', 'clinic', 'hotel', 'gym', 
      'accountant', 'lawyer', 'plumber', 'electrician', 
      'physiotherapist', 'chiropractor'
    ),
    location: Joi.string().required().min(3).max(100)
  }),
  sendEmail: Joi.object({
    leadId: Joi.string().uuid().required(),
    subject: Joi.string().required().min(5).max(200),
    body: Joi.string().required().min(20).max(5000)
  }),
  generateOutreach: Joi.object({
    leadId: Joi.string().uuid().required(),
    tone: Joi.string().required().valid('friendly', 'persuasive', 'formal'),
    serviceFocus: Joi.string().required().min(3).max(100)
  })
};

module.exports = {
  validateRequest,
  schemas
};
