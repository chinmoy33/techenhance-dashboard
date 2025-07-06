const express = require("express");
const router = express.Router();
const { getRecommendations, getRecommendationsReal } = require("../controllers/recommendationcontroller");

//router.get("/", getRecommendations);

router.get("/", getRecommendationsReal);

module.exports = router;