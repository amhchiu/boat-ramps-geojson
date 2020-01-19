import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Map.css';

import { fetchAllBoatRamps, setMapBounds, fetchRampsWithinBounds } from '../actions/actions';

import L, { LatLngBounds } from 'leaflet';
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
    
    // Fetch all ramp geodata. CHANGE TO FETCHING WITHIN BOUNDS !!!
    dispatch(fetchAllBoatRamps());

    // Get map bounds of view
    let mapInstance: L.Map = mapRef.current;
    // When map is first rendered, we want to fetch the ramps within the view only and then every time on panning
    dispatch(fetchRampsWithinBounds(mapInstance.getBounds()));
    // bind map panning to updating the view bounds in state
    mapInstance.on('moveend', () => {
      let latLngBounds = mapInstance.getBounds();
      updateBounds(latLngBounds, 1000);
    });
  }, []);

  useEffect(() => {
    if (boatRampData.totalFeatures > 0) {
      console.log('reloading map with geojson')
      console.log(boatRampData)
      // Add GeoJSON data to leaflet map with popup
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

  const updateBounds = (latLngBounds: LatLngBounds, interval: number) => {
    let newBounds: IMapBounds = {
      south: latLngBounds.getSouthWest().lat,
      west: latLngBounds.getSouthWest().lng,
      north: latLngBounds.getNorthEast().lat,
      east: latLngBounds.getNorthEast().lng
    };
    if (newBounds != currentBounds) {
      // if timeoutRef is set
      if(mapPanTimeout){
        // clear the setTimeout id if it was set.
        clearTimeout(mapPanTimeout.current);
      };
      mapPanTimeout.current = setTimeout(function() {
        console.log('setting new bounds');
        dispatch(fetchRampsWithinBounds(latLngBounds));
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
