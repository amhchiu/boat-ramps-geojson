const express = require('express');
const router = express.Router();

const boatRampsGeoJSON = require('../data/boat_ramps.geojson');

router.get('/boat_ramps', (req, res, next) => {
  res.json(boatRampsGeoJSON);
})