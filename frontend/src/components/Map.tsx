import React, { useEffect, useRef } from 'react';
import {  useSelector, useDispatch } from 'react-redux';
import './Map.css';

import { fetchAllBoatRamps } from '../actions/actions';

import L from 'leaflet';
import { IState } from '../constants/interfaces';

const Map: React.FC = () => {
  const dispatch = useDispatch();
  
  const mapRef = useRef<any>(null);

  const boatRampData = useSelector((state: IState) => state.geoJson.boatRampsGeoJSON);

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
    
    const fetchData = async () => {
      await dispatch(fetchAllBoatRamps());
    };
    fetchData();
  }, []);

  useEffect(() => {
    if(boatRampData.totalFeatures > 0) {
      console.log('reloading map with geojson')

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
    for(let p in feature.properties){
      popupContent += '<tr><td>' + p + '</td><td>' + feature.properties[p] + '</td></tr>'; 
    }
    popupContent += '</table>';
    return popupContent
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
