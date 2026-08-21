// controllers/mapController/mapControl.js
const axios = require("axios");

// Track last request time to respect Nominatim's 1 req/sec limit
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1100; // 1.1 seconds between requests

exports.getAutoCompleteSuggestion = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length < 2) {
    return res.status(200).json({ predictions: [], status: "OK" });
  }

  // Server-side rate limiting
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_INTERVAL_MS) {
    // Too soon — return empty rather than hammering Nominatim
    return res.status(200).json({ predictions: [], status: "OK" });
  }
  lastRequestTime = Date.now();

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query.trim(),
          format: "json",
          countrycodes: "in",
          limit: 5,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "WasteFreeIndia/1.0 (student-project)",
          "Accept-Language": "en",
        },
        timeout: 6000,
      }
    );

    const predictions = response.data.map((place) => ({
      description: place.display_name,
      place_id: String(place.place_id),
      structured_formatting: {
        main_text: place.name || place.display_name.split(",")[0],
        secondary_text: place.display_name.split(",").slice(1, 3).join(",").trim(),
      },
    }));

    return res.status(200).json({ predictions, status: "OK" });
  } catch (err) {
    if (err.response?.status === 429) {
      console.warn("Nominatim rate limit hit — slow down requests");
      return res.status(200).json({ predictions: [], status: "RATE_LIMITED" });
    }
    console.error("Nominatim error:", err.message);
    return res.status(200).json({ predictions: [], status: "ERROR" });
  }
};