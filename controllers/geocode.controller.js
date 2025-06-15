// controllers/geocode.controller

const axios = require("axios");

exports.geocode = async (req, res) => {
  const { city, region } = req.query;

  if (!city || !region) {
    return res.status(400).json({ error: "City and region required" });
  }

  const query = `${city}, ${region}, Україна`;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: "json",
          q: query,
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          "User-Agent": "SupportFlow/1.0",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const { lat, lon } = response.data[0];

    res.json({ lat: parseFloat(lat), lon: parseFloat(lon) });
  } catch (err) {
    console.error("Geocode error:", err.message);
    res.status(500).json({ error: "Failed to geocode" });
  }
};
