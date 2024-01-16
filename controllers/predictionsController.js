const pool = require("../db/db");
const constants = require("../constants/constants");

const categories = constants.CATEGORIES; // prediction categories

const getTodaysPredictions = async (req, res) => {
  try {
    const predictions = await pool.query(
      `SELECT * FROM predictions WHERE DATE(date) = CURRENT_DATE AND category='-'`
    );
    const rows = predictions.rows;
    res.status(200).json({ rows });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUpdatedPredictions = async (req, res) => {
  try {
    const predictions = await pool.query(
      `SELECT * FROM predictions WHERE DATE(date) = CURRENT_DATE AND category <> '-'`
    );
    const rows = predictions.rows;
    res.status(200).json({ rows });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProbability = async (req, res) => {
  try {
    const { game_id, category } = req.body;
    // Check if valid category
    if (categories.includes(category.toUpperCase())) {
      // Update the database
      const updateProbabilityQuery = await pool.query(
        `UPDATE predictions SET category='${category}' WHERE game_id=${game_id}`
      );

      if (updateProbabilityQuery.rowCount > 0) {
        res.status(200).json({ message: "Probability updated successfully" });
      } else {
        res.status(404).json({ error: "Record not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid category" });
    }
  } catch (error) {
    console.error("Error updating probability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const discardPrediction = async (req, res) => {
  try {
    const { game_id } = req.params; // Assuming game_id is retrieved from the endpoint path

    // Delete from database
    const deletePredictionQuery = await pool.query(
      `DELETE FROM predictions WHERE game_id=${game_id}`
    );

    if (deletePredictionQuery.rowCount > 0) {
      res.status(200).json({ message: "Prediction discarded successfully" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    console.error("Error deleting prediction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTodaysPredictions,
  getUpdatedPredictions,
  updateProbability,
  discardPrediction,
};
