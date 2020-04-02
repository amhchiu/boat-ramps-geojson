import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import config from '../../FrontEndConfig.json'
import { setMapBounds, fetchRampsWithinBounds } from '../../actions/actions';

import L, { LatLngBounds, LatLng, latLng } from 'leaflet';
import { IState, IMapBounds } from '../../constants/interfaces';
import { filterColourFromMaterialSelection, filterColourFromSizeCategorySelection } from '../utils';

import { Grid } from '@material-ui/core';
import './Map.styles'; 

const Map: React.FC = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<any>(null);

  const [featuresVisible, setFeaturesVisible] = useState(0);
  const mapPanTimeout = useRef<any>(null);
  const boatRampData = useSelector((state: IState) => state.mapData.boatRampsGeoJSON);
  const currentBounds = useSelector((state: IState) => state.mapData.mapBounds);
  const selectedMaterial = useSelector((state: IState) => state.mapData.selectedMaterial);
  const selectedSizeCategory = useSelector((state: IState) => state.mapData.selectedSizeCategory);


  /**
   * Creates the leaflet map instance with a base tile layer
   * Fetches the Boat Ramps within the map bounds.
   * Attaches a listener to the map instance. - On panning/zooming
   * the bounds will update x milliseconds after stopping the panning motion.
   * 
   */
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

    let mapInstance: L.Map = mapRef.current;
    // When map is first rendered, we want to fetch the ramps within the view only and then every time on panning
    dispatch(fetchRampsWithinBounds(mapInstance.getBounds()));
    // bind map panning to updating the view bounds in state
    mapInstance.on('moveend', () => {
      let latLngBounds = mapInstance.getBounds();
      updateBounds(latLngBounds, config.MapRefreshDelay);
    });
  }, []);

  /**
   * Whenever the map GeoData changes, or the chart data changes
   * This will remove and re-add the GeoJSON feature layers 
   * Adds the features onto the map. Filters based on chart material / sizeCategory
   * selection and binds the appropriate colour to the feature. 
   */
  useEffect(() => {
    let mapInstance: L.Map = mapRef.current;
    mapInstance.eachLayer(function(layer) {
      /* Features are build upon L.GeoJSON layers 
       Where as tile layers are L.TileLayer */ 
      if(layer instanceof L.GeoJSON){
        mapInstance.removeLayer(layer);
      }
    });
    if (boatRampData.totalFeatures > 0) {
      let newLayer = L.geoJSON(boatRampData, {
        filter: function (feature) {
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
        style: function () {
          let colour = '#0000FF';
          if(selectedMaterial) colour = filterColourFromMaterialSelection(selectedMaterial);
          if(selectedSizeCategory) colour = filterColourFromSizeCategorySelection(selectedSizeCategory);
          return { color: colour, weight: 5 }
        }
      }).addTo(mapRef.current);
      // Set the total visible ramps count.
      setFeaturesVisible(newLayer.getLayers().length);
    }
  }, [boatRampData, selectedMaterial, selectedSizeCategory]);

  /**
   * For a given feature; determines if the feature
   * has a matching material or area that falls within the size category
   * of the selected bar.
   * If either of these condtitions are met, return true.
   * @param feature Boat ramp Polygon feature
   */
  const filterFeatureFromChartSelection = (feature: GeoJSON.Feature<GeoJSON.Geometry, any>) => {
    let properties = feature.properties;
    const { material, area_ } = properties;
    // if material selected and feature has matching material
    if (selectedMaterial && material === selectedMaterial) {
      return true;
    }
    // if sizes selected and feature has area within sizes range
    else if (selectedSizeCategory) {
      let sizes = selectedSizeCategory.split('-');
      let lower = parseInt(sizes[0]);
      let upper = parseInt(sizes[1]);
      if (area_ > lower && area_ <= upper) return true
      else if (lower === 0 && lower === area_) return true;
      else return false;
    }
    else return false
  }

  /**
   * Returns the HTML table element populated with the properties
   * of the boat ramp feature.
   * @param feature Boat Ramp polygon feature
   */
  const buildPopup = (feature: GeoJSON.Feature) => {
    let popupContent = '<table>';
    popupContent += '<tr><th>Property</th><th>Value</th></tr>';
    for (let p in feature.properties) {
      popupContent += '<tr><td>' + p + '</td><td>' + feature.properties[p] + '</td></tr>';
    }
    popupContent += '</table>';
    return popupContent
  };

  /**
   * Updates the GeoJSON data in the map bounds to only render the features
   * which are in the visible bounds.
   * Sets the new map bounds
   * @param latLngBounds Bounds of the visible map
   * @param interval The delay after panning motion ends to trigger the update of map data.
   */
  const updateBounds = (latLngBounds: LatLngBounds, interval: number) => {
    let newBounds: IMapBounds = {
      south: latLngBounds.getSouthWest().lat,
      west: latLngBounds.getSouthWest().lng,
      north: latLngBounds.getNorthEast().lat,
      east: latLngBounds.getNorthEast().lng
    };
    if (newBounds !== currentBounds) {
      // if the time out reference is previously set
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
      <Grid item xs={12}>
        <div id='map' style={styles.map}>
        </div>
      </Grid>
      <Grid item xs={12}>
        Number of Ramps Visible - {featuresVisible}
      </Grid>
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
