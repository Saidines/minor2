// server.js
const express = require("express");
const app = express();

app.use(express.json()); // For parsing JSON POST body

// In-memory storage
let relayState = "off";
let sensorData = { temperature: null, humidity: null };

// Endpoint to set relay state
app.get("/api/setRelay", (req, res) => {
  const { state } = req.query;
  if (state === "on" || state === "off") {
    relayState = state;
    return res.json({ success: true, relay: relayState });
  }
  return res.status(400).json({ success: false, message: "Invalid state" });
});

// Endpoint to get relay state
app.get("/api/getRelay", (req, res) => {
  res.json({ relay: relayState });
});

// Endpoint to post temperature & humidity (from ESP32 or sensor device)
app.post("/api/setSensor", (req, res) => {
  const { temperature, humidity } = req.body;
  if (temperature !== undefined && humidity !== undefined) {
    sensorData = { temperature, humidity };
    return res.json({ success: true, sensor: sensorData });
  }
  return res.status(400).json({ success: false, message: "Invalid data" });
});

// Endpoint to get latest temperature & humidity
app.get("/api/getSensor", (req, res) => {
  res.json(sensorData);
});

// Start server (Render will set PORT automatically)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
