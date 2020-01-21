import axios from 'axios';
import { Dispatch } from 'react';
import { IMapBounds, IGeoJSON } from '../../constants/interfaces';
import { LatLngBounds } from 'leaflet';
import { 
  FETCH_ALL_GEOJSON, 
  UPDATE_MAP_BOUNDS, 
  FETCH_GEOJSON_IN_BOUNDS,
  UPDATE_SELECTED_MATERIAL,
  CLEAR_SELECTED_MATERIAL,
  UPDATE_SELECTED_SIZECAT,
  CLEAR_SELECTED_SIZECAT
} from '../actionTypes';

import config from '../../FrontEndConfig.json';

const baseURL = config.ServerURL;

const fetchAllBoatRampsSuccess = (geoData: IGeoJSON) => (
  {type: FETCH_ALL_GEOJSON, payload: geoData}
)

const setMapBoundsSuccess = (newBounds: IMapBounds) => (
  {type: UPDATE_MAP_BOUNDS, payload: newBounds}
);

const fetchRampsWithinBoundsSuccess = (features: GeoJSON.Feature[]) => (
  {type: FETCH_GEOJSON_IN_BOUNDS, payload: features}
)

export const fetchAllBoatRamps = (): any => (dispatch: Dispatch<any>) => {
  const url = `${baseURL}/data`;
  return axios.get(url)
    .then(({data}) => {
      const geoData: IGeoJSON = data;
      dispatch(fetchAllBoatRampsSuccess(geoData))
    })
    .catch(err => console.error(err));
}

export const setMapBounds = (newBounds: IMapBounds): any => (dispatch: Dispatch<any>) => {
  dispatch(setMapBoundsSuccess(newBounds));
}

export const fetchRampsWithinBounds = (latLngBounds: LatLngBounds): any => (dispatch: Dispatch<any>) => {
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
      const features: GeoJSON.Feature[] = data;
      dispatch(fetchRampsWithinBoundsSuccess(features))
    })
    .catch(err => console.error(err)); 
};

export const setSelectedMaterial = (material: string): any => (dispatch: Dispatch<any>) => {
  dispatch({type: UPDATE_SELECTED_MATERIAL, payload: material});
}

export const clearSelectedMaterial = (): any => (dispatch: Dispatch<any>) => {
  dispatch({type: CLEAR_SELECTED_MATERIAL});
}

export const setSelectedSizeCategory = (sizeCategory: string): any => (dispatch: Dispatch<any>) => {
  dispatch({type: UPDATE_SELECTED_SIZECAT, payload: sizeCategory});
};

export const clearSelectedSizeCategory = (): any => (dispatch: Dispatch<any>) => {
  dispatch({type: CLEAR_SELECTED_SIZECAT});
};