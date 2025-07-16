const express = require("express");
const router = express.Router();
const { getRecommendations, getRecommendationsReal, getLeads, updateLeads } = require("../controllers/recommendationcontroller");

//router.get("/", getRecommendations);

router.get("/", getRecommendationsReal);

router.get("/leadtracking", getLeads);

router.post("/updateLeads/:id",updateLeads);

module.exports = router;