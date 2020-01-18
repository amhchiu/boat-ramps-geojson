import axios from 'axios';
import { Dispatch } from 'react';


export const fetchAllBoatRamps = () => (dispatch: Dispatch<any>) => {
  console.log('fetch boat ramps');
  const url = `http://localhost:8081/all`
  return axios.get(url)
    .then(({data}) => {
      dispatch({type: 'FETCH_ALL_GEOJSON', payload: data})
    })
    .catch(err => console.error(err));
}