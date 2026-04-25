const { makeInvoker, inject } = require('awilix-express');
const CampaignController = require('../controllers/CampaignController');
const CampaignValidator = require('../validators/CampaignValidator');
const validate = require('../middlewares/validatorMiddleware');
const auth = require('../middlewares/authMiddleware');

const api = makeInvoker(CampaignController);

module.exports = (router) => {
  router.use(inject(auth));
  router.post('/', CampaignValidator.create, validate, api('create'));
  router.get('/', api('list'));
  router.get('/:id', CampaignValidator.idParam, validate, api('get'));
  router.post('/:id/start', CampaignValidator.idParam, validate, api('start'));
  router.post('/:id/pause', CampaignValidator.idParam, validate, api('pause'));
  router.post('/:id/cancel', CampaignValidator.idParam, validate, api('cancel'));
  router.get('/:id/stats', CampaignValidator.idParam, validate, api('stats'));
};
