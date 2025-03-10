require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Weather API is running!");
  });

// GET Current Weather
app.get("/api/weather/:city", async (req, res) => {
    try {
        const city = req.params.city;
        const response = await axios.get(`${BASE_URL}/current.json`, {
            params: { key: API_KEY, q: city }
        });

        res.json({
            city: response.data.location.name,
            country: response.data.location.country,
            temperature: response.data.current.temp_c,
            condition: response.data.current.condition.text,
            humidity: response.data.current.humidity,
            wind_speed: response.data.current.wind_kph
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid city name or API issue." });
    }
});

// GET Weather Forecast (3 Days)
app.get("/api/weather/forecast/:city", async (req, res) => {
    try {
        const city = req.params.city;
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: { key: API_KEY, q: city, days: 3 }
        });

        const forecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            max_temp: day.day.maxtemp_c,
            min_temp: day.day.mintemp_c,
            condition: day.day.condition.text
        }));

        res.json({ city: response.data.location.name, country: response.data.location.country, forecast });
    } catch (error) {
        res.status(400).json({ error: "Invalid city name or API issue." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.export = app;