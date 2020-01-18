const express = require('express');
const router = express.Router();
const fs = require ('fs');

router.get('/all', (req, res) => {
  const boatRampGeoJSON = JSON.parse(fs.readFileSync('./data/boat_ramps.geojson', 'utf8'));
  res.json(boatRampGeoJSON);
});

module.exports = router;