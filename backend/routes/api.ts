import express from 'express';
const router = express.Router();
import fs from 'fs';

import { getGeoDataInBounds } from '../processing';

const boatRampGeoJSON = JSON.parse(fs.readFileSync('./data/boat_ramps.geojson', 'utf8'));

router.get('/data', (req: any, res: any) => {
  res.json(boatRampGeoJSON);
});

/**
 * /data/filter?southWest=52.1,-152.3&northEast=53.1,-154.2
 */
router.get('/data/filter', function (req: any, res: any) {
    console.log('request to filter')
    let southWest = req.query.southWest.split(',');
    let northEast = req.query.northEast.split(',');
    let latMin = parseFloat(southWest[0]),
        lngMin = parseFloat(southWest[1]),
        latMax = parseFloat(northEast[0]),
        lngMax = parseFloat(northEast[1]);
    let filteredDataInBounds = getGeoDataInBounds(latMin, lngMin, latMax, lngMax, boatRampGeoJSON);
    res.json(filteredDataInBounds);
});

export default router;