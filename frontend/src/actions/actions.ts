import axios from 'axios';
import { Dispatch } from 'react';
import { IMapBounds } from '../constants/interfaces';

const baseURL = 'http://localhost:8081';

export const fetchAllBoatRamps = () => (dispatch: Dispatch<any>) => {
  console.log('fetch boat ramps');
  const url = `${baseURL}/data`;

  return axios.get(url)
    .then(({data}) => {
      dispatch({type: 'FETCH_ALL_GEOJSON', payload: data})
    })
    .catch(err => console.error(err));
}

export const setMapBounds = (newBounds: IMapBounds, dispatch: Dispatch<any>) => {
  console.log(newBounds);
  dispatch({type: 'UPDATE_MAP_BOUNDS', payload: newBounds});
}

export const fetchRampsWithinBounds = (newBounds: IMapBounds) => (dispatch: Dispatch<any>) => {
  let {south, west, north, east} = newBounds;
  const url = `${baseURL}/data/filter?southWest=${south},${west}&northEast=${north},${east}`;
  return axios.get(url)
    .then(({data}) => {
      dispatch({type: 'FETCH_FILTERED_GEOJSON', payload: data})
    })
    .catch(err => console.error(err)); 
};