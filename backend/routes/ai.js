/* global require, module */
const express = require('express');
const { generateDashboardRecommendation } = require('../services/aiRecommendationService');

function createAiRouter(dependencies = {}) {
  const router = express.Router();

  router.post('/dashboard-recommendation', async (req, res) => {
    const recommendation = await generateDashboardRecommendation(req.body || {}, dependencies);
    res.json(recommendation);
  });

  return router;
}

module.exports = {
  createAiRouter,
};
