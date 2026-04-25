const { makeInvoker } = require('awilix-express');
const CampaignController = require('../controllers/CampaignController');

const api = makeInvoker(CampaignController);

module.exports = (router) => {
  router.post('/', api('create'));
  router.get('/', api('list'));
  router.get('/:id', api('get'));
  router.post('/:id/start', api('start'));
  router.post('/:id/pause', api('pause'));
  router.post('/:id/cancel', api('cancel'));
  router.get('/:id/stats', api('stats'));
};
