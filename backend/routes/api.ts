import express from 'express';
const router = express.Router();
import fs from 'fs';

import { getGeoDataInBounds, getRampsPerMaterial, getRampsPerSizeCategory } from '../processing';
import { IRampsMaterial } from '../interfaces';

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



/**
 * Get all materials and number of ramps
 */
router.get('/data/materials-ramps', (req: any, res: any) => {
  let rampsPerMaterial = getRampsPerMaterial(boatRampGeoJSON);
  res.json(rampsPerMaterial);
});

/**
 * Get number of ramps per categories provided in query
 * e.g. /data/ramps-per-size?categories=50,200,526
 */
router.get('/data/ramps-per-size', (req: any, res: any) => {
  let categoriesQuery = req.query.categories.split(',');
  let categories = categoriesQuery.map((n: string) => parseInt(n));
  console.log(categories);
  let rampsPerSizeCategory = getRampsPerSizeCategory(boatRampGeoJSON, categories);
  res.json(rampsPerSizeCategory);
});

export default router;