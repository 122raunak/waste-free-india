const { default: axios } = require("axios");

async function AutoCompleteSuggestion(query) {
  const apiKey = process.env.GOOGLE_MAP_API;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(
      "Error fetching autocomplete:",
      err.response?.data || err.message
    );
    throw new Error("Failed to fetch suggestions");
  }
}
exports.getAutoCompleteSuggestion = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const response = await AutoCompleteSuggestion(query);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
