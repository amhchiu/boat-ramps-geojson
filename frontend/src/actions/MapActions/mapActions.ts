import axios from 'axios';
import { Dispatch } from 'react';
import { IMapBounds } from '../../constants/interfaces';
import { LatLngBounds } from 'leaflet';
import { 
  UPDATE_MAP_BOUNDS, 
  FETCH_GEOJSON_IN_BOUNDS,
  UPDATE_SELECTED_MATERIAL,
  CLEAR_SELECTED_MATERIAL,
  UPDATE_SELECTED_SIZECAT,
  CLEAR_SELECTED_SIZECAT
} from '../actionTypes';

import config from '../../FrontEndConfig.json';

const baseURL = config.ServerURL;

const setMapBoundsSuccess = (newBounds: IMapBounds) => (
  {type: UPDATE_MAP_BOUNDS, payload: newBounds}
);

const fetchRampsWithinBoundsSuccess = (features: GeoJSON.Feature[]) => (
  {type: FETCH_GEOJSON_IN_BOUNDS, payload: features}
)

export const setMapBounds = (newBounds: IMapBounds): any => (dispatch: Dispatch<any>) => {
  dispatch(setMapBoundsSuccess(newBounds));
}

/**
 * GETs the filtered array of GeoJSON Features within the
 * provided rectangular LatLngBounds.
 * @param latLngBounds 
 */
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

/**
 * Action to Set the selected material to state.
 * @param material material of a Boat Ramp
 */
export const setSelectedMaterial = (material: string): any => (dispatch: Dispatch<any>) => {
  dispatch({type: UPDATE_SELECTED_MATERIAL, payload: material});
}

/**
 * Action to clear the selected material in state.
 */
export const clearSelectedMaterial = (): any => (dispatch: Dispatch<any>) => {
  dispatch({type: CLEAR_SELECTED_MATERIAL});
}

/**
 * Action to set selected area size Category (e.g. 50-200) in state
 * @param sizeCategory Category of 
 */
export const setSelectedSizeCategory = (sizeCategory: string): any => (dispatch: Dispatch<any>) => {
  dispatch({type: UPDATE_SELECTED_SIZECAT, payload: sizeCategory});
};

/**
 * Action clear selected area size category in state
 */
export const clearSelectedSizeCategory = (): any => (dispatch: Dispatch<any>) => {
  dispatch({type: CLEAR_SELECTED_SIZECAT});
};