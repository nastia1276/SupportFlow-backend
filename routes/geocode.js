// routes/geocode

const express = require("express");
const axios = require("axios");
const router = express.Router();
const cache = new Map();

router.get("/", async (req, res) => {
  const { city, region } = req.query;

  if (!city || !region) {
    return res.status(400).json({ message: "Місто і область обов’язкові" });
  }

  const key = `${city.trim().toLowerCase()},${region.trim().toLowerCase()}`;

  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  const location = `${city}, ${region}`;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          "User-Agent": "SupportFlow/1.0 (admin@supportflow.com)",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (response.data?.[0]) {
      const place = {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon),
      };
      cache.set(key, place);
      return res.json(place);
    } else {
      return res.status(404).json({ message: "Координати не знайдено" });
    }
  } catch (err) {
    console.error("Geocode backend error:", err.message);
    res
      .status(500)
      .json({ message: "Помилка геокодування", error: err.message });
  }
});

module.exports = router;
