const { makeInvoker } = require('awilix-express');
const LeadController = require('../controllers/LeadController');

const api = makeInvoker(LeadController);

module.exports = (router) => {
  router.post('/import', api('import'));
};
