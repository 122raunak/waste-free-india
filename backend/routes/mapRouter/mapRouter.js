const express = require("express");
const {
  getAutoCompleteSuggestion,
} = require("../../controllers/mapController/mapControl");
const router = express.Router();

router.get("/get-suggestion", getAutoCompleteSuggestion);

module.exports = router;
