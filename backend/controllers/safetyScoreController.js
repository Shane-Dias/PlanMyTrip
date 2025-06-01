const { GoogleGenerativeAI } = require("@google/generative-ai");
const Incident = require("../models/Incident");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeRouteSafety(coordinates) {
  // 1. Find incidents near the route coordinates (simplified bounding box query)
  const incidents = await Incident.find({
    latitude: { $gte: coordinates.minLat, $lte: coordinates.maxLat },
    longitude: { $gte: coordinates.minLng, $lte: coordinates.maxLng },
  }).limit(50); // Limit to recent 50 incidents for context

  // 2. Prepare prompt for Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze traffic incident data to calculate a safety score (0-100) for a route with the following parameters:
    
    Route Coordinates: ${JSON.stringify(coordinates)}
    Nearby Incidents (${incidents.length}): ${JSON.stringify(
    incidents.map((i) => ({
      location: i.location,
      cause: i.cause,
      casualties: i.casualties,
      weather: i.weather_condition,
      road: i.road_condition,
    }))
  )}
    
    Consider these factors:
    - Number and severity of nearby incidents
    - Common causes of accidents
    - Weather and road conditions
    - Time of day (if available)
    
    Return ONLY a JSON object with this structure:
    {
      "score": [0-100],
      "factors": ["list", "of", "key", "factors"],
      "warning": "optional warning if score < 40"
    }
  `;

  const result = await model.generateContent(prompt);
  console.log("Raw Gemini Response:", result);

  if (!result || !result.response) {
    throw new Error("Gemini API did not return a response.");
  }
  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
}

exports.calculateSafetyScore = async (req, res) => {
  console.log("Request received at calculate-safety-score", req.body); // Debug incoming request

  try {
    const coordinates = req.body.coordinates;
    if (!coordinates) {
      throw new Error("Missing coordinates in request.");
    }

    const analysis = await analyzeRouteSafety(coordinates);
    res.json(analysis);
  } catch (error) {
    console.error("Safety score error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
