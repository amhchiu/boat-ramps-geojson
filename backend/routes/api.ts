const express = require('express');
const router = express.Router();
const fs = require ('fs');

router.get('/all', (req: any, res: any) => {
  const boatRampGeoJSON = JSON.parse(fs.readFileSync('./data/boat_ramps.geojson', 'utf8'));
  res.json(boatRampGeoJSON);
});

/**
 * /data/filter?southWest=52.1,-152.3&northEast=53.1,-154.2
 */
router.get('/data/filter', function (req: any, res: any) {
    var southWest = req.query.southWest.split(',');
    var northEast = req.query.northEast.split(',');
    console.log(southWest);
    console.log(northEast);
});

export default router;