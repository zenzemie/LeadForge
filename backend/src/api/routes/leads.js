const { makeInvoker, inject } = require('awilix-express');
const LeadController = require('../controllers/LeadController');
const LeadValidator = require('../validators/LeadValidator');
const validate = require('../middlewares/validatorMiddleware');
const auth = require('../middlewares/authMiddleware');

const api = makeInvoker(LeadController);

module.exports = (router) => {
  router.use(inject(auth));
  router.post('/import', LeadValidator.import, validate, api('import'));
  router.post('/forget', LeadValidator.forget, validate, api('forget'));
};
