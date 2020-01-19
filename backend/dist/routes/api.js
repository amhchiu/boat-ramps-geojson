"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var fs = require('fs');
router.get('/all', function (req, res) {
    var boatRampGeoJSON = JSON.parse(fs.readFileSync('./data/boat_ramps.geojson', 'utf8'));
    res.json(boatRampGeoJSON);
});
/**
 * /data/filter?southWest=52.1,-152.3&northEast=53.1,-154.2
 */
router.get('/data/filter', function (req, res) {
    var southWest = req.query.southWest.split(',');
    var northEast = req.query.northEast.split(',');
    console.log(southWest);
    console.log(northEast);
});
exports.default = router;
