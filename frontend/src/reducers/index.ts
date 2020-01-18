import { combineReducers } from 'redux';
import { IMapState } from "../constants/interfaces";

const mapState: IMapState = {
  boatRampsGeoJSON: {
    type: 'FeatureCollection',
    totalFeatures: 0,
    features: []
  }
};

const geoJsonReducer = (state: IMapState = mapState, action: any) => {
  switch(action.type){
    case 'FETCH_ALL_GEOJSON':
      return {...state, boatRampsGeoJSON: action.payload};
    default: 
      return state;
  }
};

export default combineReducers({
  geoJson: geoJsonReducer
})