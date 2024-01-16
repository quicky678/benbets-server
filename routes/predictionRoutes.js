const express = require("express");
const predictionController = require("../controllers/predictionsController");

const router = express.Router();

router.get("/predictions", predictionController.getTodaysPredictions);
router.get("/updated-predictions", predictionController.getUpdatedPredictions);
router.patch("/update-prediction", predictionController.updateProbability);
router.delete("/discard/:game_id", predictionController.discardPrediction);

module.exports = router;
