import axios from 'axios';
import { Dispatch } from 'react';
import { IMapBounds, IGeoJSON, IRampsMaterial } from '../constants/interfaces';
import { LatLngBounds } from 'leaflet';
import { 
  FETCH_ALL_GEOJSON, 
  UPDATE_MAP_BOUNDS, 
  FETCH_GEOJSON_IN_BOUNDS, 
  GET_RAMPS_MATERIALS_IN_BOUNDS,
  GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS
} from './actionTypes';

const baseURL = 'http://localhost:8080';

export const fetchAllBoatRamps = () => (dispatch: Dispatch<any>) => {
  const url = `${baseURL}/data`;
  return axios.get(url)
    .then(({data}) => {
      dispatch({type: FETCH_ALL_GEOJSON, payload: data})
    })
    .catch(err => console.error(err));
}

export const setMapBounds = (newBounds: IMapBounds, dispatch: Dispatch<any>) => {
  dispatch({type: UPDATE_MAP_BOUNDS, payload: newBounds});
}

export const fetchRampsWithinBounds = (latLngBounds: LatLngBounds) => (dispatch: Dispatch<any>) => {
  const newBounds: IMapBounds = {
    south: latLngBounds.getSouthWest().lat,
    west: latLngBounds.getSouthWest().lng,
    north: latLngBounds.getNorthEast().lat,
    east: latLngBounds.getNorthEast().lng
  };
  const {south, west, north, east} = newBounds;
  const url = `${baseURL}/data/filter?southWest=${south},${west}&northEast=${north},${east}`;
  return axios.get(url)
    .then(({data}) => {
      const payload = {
        totalFeatures: data.length,
        features: data
      };
      dispatch({type: FETCH_GEOJSON_IN_BOUNDS, payload})
    })
    .catch(err => console.error(err)); 
};


export const getRampsPerMaterialInBounds = (geoData: IGeoJSON, dispatch: Dispatch<any>) => {
  const features = geoData.features;
  let rampsPerMaterial: {[key: string]: number} = {};
  features.forEach((feature: GeoJSON.Feature) => {
    if(feature.properties){
      const material = feature.properties.material;
      rampsPerMaterial[material] = (rampsPerMaterial[material] || 0) + 1;
    };
  });
  dispatch({type: GET_RAMPS_MATERIALS_IN_BOUNDS, payload: rampsPerMaterial})
}

export const getRampsPerSizeCategoryInBounds = (geoData: IGeoJSON, categories: number[], dispatch: Dispatch<any>) => {
  const features = geoData.features;
  let rampsPerSizeCategory: {[key: string]: number} = {};
  
  features.forEach((feature: GeoJSON.Feature) => {
    if(feature.properties && categories.length > 0){
      const area = feature.properties.area_;
      for(let i = 0; i < categories.length; i++){
        let upper = categories[i];
        let lower = i === 0 ?  0 : categories[i-1];
        if(area > lower && area <= upper) rampsPerSizeCategory[upper] = (rampsPerSizeCategory[upper] || 0) + 1;
        else if(i === 0 && area === 0) rampsPerSizeCategory[upper] = (rampsPerSizeCategory[upper] || 0) + 1;
      }
    }
  });
  dispatch({type: GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS, payload: rampsPerSizeCategory})
};

export const getRampsForSelectMaterialInBounds = (rampMaterial: IRampsMaterial, dispatch: Dispatch<any>) => {
  
};

export const fetchAllRampsPerMaterial = () => (dispatch: Dispatch<any>) => {

};

export const fetchAllRampsPerSizeCategory = (category: number[]) => {

};

export const fetchRampMaterialChartData = () => (dispatch: Dispatch<any>) => {
  
  const url = `${baseURL}/data/ramps-per-size?categories=`
};
