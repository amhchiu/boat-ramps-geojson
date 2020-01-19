import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Map.css';

import { fetchAllBoatRamps, setMapBounds } from '../actions/actions';

import L from 'leaflet';
import { IState, IMapBounds } from '../constants/interfaces';

const Map: React.FC = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<any>(null);

  const mapPanTimeout = useRef<any>(null);
  const boatRampData = useSelector((state: IState) => state.geoJson.boatRampsGeoJSON);
  const currentBounds = useSelector((state: IState) => state.geoJson.mapBounds);

  useEffect(() => {
    const baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    mapRef.current = L.map('map', {
      center: [-28.0062, 153.4241],
      zoom: 10,
      layers: [
        baseLayer
      ]
    });

    dispatch(fetchAllBoatRamps());

    let mapInstance: L.Map = mapRef.current;
    mapInstance.on('moveend', () => {
      let latLngBounds = mapInstance.getBounds();
      const newBounds = {
        south: latLngBounds.getSouthWest().lat,
        west: latLngBounds.getSouthWest().lng,
        north: latLngBounds.getNorthEast().lat,
        east: latLngBounds.getNorthEast().lng
      };
      updateBounds(newBounds);
    });
  }, []);

  useEffect(() => {
    if (boatRampData.totalFeatures > 0) {
      console.log('reloading map with geojson')
      // Add GeoJSON to leaflet map with popup
      L.geoJSON(boatRampData, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup(buildPopup(feature), {
            maxHeight: 200,
            minWidth: 75,
            keepInView: true
          });
        }
      }).addTo(mapRef.current);
    }
  }, [boatRampData]);

  const buildPopup = (feature: GeoJSON.Feature) => {
    let popupContent = '<table>';
    popupContent += '<tr><th>Property</th><th>Value</th></tr>';
    for (let p in feature.properties) {
      popupContent += '<tr><td>' + p + '</td><td>' + feature.properties[p] + '</td></tr>';
    }
    popupContent += '</table>';
    return popupContent
  };

  const updateBounds = (newBounds: IMapBounds) => {
    let interval = 1000; //5 seconds
    if (newBounds != currentBounds) {
      // if timeoutRef is set
      if(mapPanTimeout){
        // clear the setTimeout id if it was set.
        clearTimeout(mapPanTimeout.current);
      };
      mapPanTimeout.current = setTimeout(function() {
        console.log('setting new bounds');
        setMapBounds(newBounds, dispatch);
      }, interval);
      console.log(mapPanTimeout.current);
    };
  };

  return (
    <div id='map' style={styles.map}>
    </div>
  );
};

export default Map;

const styles = {
  map: {
    textAlign: 'center' as const,
    width: '100%',
    height: '400px'
  }
};
