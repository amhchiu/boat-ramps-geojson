import axios from 'axios';
import { Dispatch } from 'react';
import { IMapBounds } from '../../constants/interfaces';
import { LatLngBounds } from 'leaflet';
import { 
  FETCH_ALL_GEOJSON, 
  UPDATE_MAP_BOUNDS, 
  FETCH_GEOJSON_IN_BOUNDS,
  UPDATE_SELECTED_MATERIAL,
  CLEAR_SELECTED_MATERIAL
} from '../actionTypes';

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

export const setSelectedMaterial = (material: string, dispatch: Dispatch<any>) => {
  dispatch({type: UPDATE_SELECTED_MATERIAL, payload: material});
}

export const clearSelectedMaterial = (dispatch: Dispatch<any>) => {
  dispatch({type: CLEAR_SELECTED_MATERIAL});
}