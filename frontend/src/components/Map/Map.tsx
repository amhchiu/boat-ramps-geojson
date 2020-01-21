import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Map.css';
import config from '../../FrontEndConfig.json'
import { fetchAllBoatRamps, setMapBounds, fetchRampsWithinBounds } from '../../actions/actions';

import L, { LatLngBounds, LatLng, latLng } from 'leaflet';
import { IState, IMapBounds } from '../../constants/interfaces';
import { filterColourFromMaterialSelection, filterColourFromSizeCategorySelection } from '../utils';

const Map: React.FC = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<any>(null);

  const [featuresVisible, setFeaturesVisible] = useState(0);
  const mapPanTimeout = useRef<any>(null);
  const boatRampData = useSelector((state: IState) => state.mapData.boatRampsGeoJSON);
  const currentBounds = useSelector((state: IState) => state.mapData.mapBounds);
  const selectedMaterial = useSelector((state: IState) => state.mapData.selectedMaterial);
  const selectedSizeCategory = useSelector((state: IState) => state.mapData.selectedSizeCategory);

  useEffect(() => {
    const baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    const mapCenter = latLng(config.MapCenter[0], config.MapCenter[1]);
    mapRef.current = L.map('map', {
      center: mapCenter,
      zoom: 9,
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
      updateBounds(latLngBounds, config.MapRefreshDelay);
    });
  }, []);

  useEffect(() => {
    let mapInstance: L.Map = mapRef.current;
    mapInstance.eachLayer(function(layer) {
      if(layer instanceof L.GeoJSON){
        mapInstance.removeLayer(layer);
      }
    });
    if (boatRampData.totalFeatures > 0) {
      // Add GeoJSON data to leaflet map with popup      
      let newLayer = L.geoJSON(boatRampData, {
        filter: function (feature) {
          // neither selected
          if (!selectedMaterial && !selectedSizeCategory) {
            return true;
          }
          else if (selectedMaterial || selectedSizeCategory) {
            return filterFeatureFromChartSelection(feature);
          }
          else return false;
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(buildPopup(feature), {
            maxHeight: 200,
            minWidth: 75,
            keepInView: true
          });
        },
        style: function (feature) {
          let colour = '#0000FF';
          if(selectedMaterial) colour = filterColourFromMaterialSelection(selectedMaterial);
          if(selectedSizeCategory) colour = filterColourFromSizeCategorySelection(selectedSizeCategory);
          
          return { color: colour, weight: 5 }
        }
      }).addTo(mapRef.current);

      setFeaturesVisible(newLayer.getLayers().length);
    }
  }, [boatRampData, selectedMaterial, selectedSizeCategory]);



  const filterFeatureFromChartSelection = (feature: GeoJSON.Feature<GeoJSON.Geometry, any>) => {
    let properties = feature.properties;
    const { material, area_ } = properties;
    // if material selected and feature has matching material
    if (material === selectedMaterial) {
      return true;
    }
    // if sizes selected and feature has area within sizes range
    else if (selectedSizeCategory) {
      console.log('size category')
      let sizes = selectedSizeCategory.split('-');
      let lower = parseInt(sizes[0]);
      let upper = parseInt(sizes[1]);
      if (area_ > lower && area_ <= upper) return true
      else if (lower === 0 && lower === area_) return true;
      else return false;
    }
    else return false
  }

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
    if (newBounds !== currentBounds) {
      // if timeoutRef is set
      if (mapPanTimeout) {
        // clear the setTimeout id if it was set.
        clearTimeout(mapPanTimeout.current);
      };
      mapPanTimeout.current = setTimeout(function () {
        dispatch(fetchRampsWithinBounds(latLngBounds));
        dispatch(setMapBounds(newBounds));
      }, interval);
    };
  };

  return (
    <>
      <div id='map' style={styles.map}>
      </div>
      <div className='row'>
        Number of Ramps Visible - {featuresVisible}
      </div>
    </>
  );
};

export default Map;

const styles = {
  map: {
    textAlign: 'center' as const,
    width: '100%',
    height: '50vh'
  }
};
