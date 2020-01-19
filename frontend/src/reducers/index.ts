import { combineReducers } from 'redux';
import { IMapState } from "../constants/interfaces";

const mapState: IMapState = {
  boatRampsGeoJSON: {
    type: 'FeatureCollection',
    totalFeatures: 0,
    features: []
  },
  mapBounds: {
    north: 0,
    west: 0,
    south: 0,
    east: 0
  }
};

const geoJsonReducer = (state: IMapState = mapState, action: any) => {
  switch(action.type){
    case 'FETCH_ALL_GEOJSON':
      return {...state, boatRampsGeoJSON: action.payload};
    case 'UPDATE_MAP_BOUNDS':
      return {...state, mapBounds: action.payload};
    default: 
      return state;
  }
};

export default combineReducers({
  geoJson: geoJsonReducer
})