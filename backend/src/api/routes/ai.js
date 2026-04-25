const { makeInvoker } = require('awilix-express');
const AIController = require('../controllers/AIController');

const api = makeInvoker(AIController);

module.exports = (router) => {
  router.post('/generate', api('generate'));
  router.post('/nexus/trigger', api('triggerNexus'));
};
