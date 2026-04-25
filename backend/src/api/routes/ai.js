const { makeInvoker, inject } = require('awilix-express');
const AIController = require('../controllers/AIController');
const AIValidator = require('../validators/AIValidator');
const validate = require('../middlewares/validatorMiddleware');
const auth = require('../middlewares/authMiddleware');

const api = makeInvoker(AIController);

module.exports = (router) => {
  router.use(inject(auth));
  router.post('/generate', AIValidator.generateMessage, validate, api('generate'));
  router.post('/nexus/trigger', AIValidator.triggerNexus, validate, api('triggerNexus'));
};
