import { combineReducers } from 'redux';
import { IMapState } from "../constants/interfaces";
import { 
  FETCH_GEOJSON_IN_BOUNDS,
  FETCH_ALL_GEOJSON,
  UPDATE_MAP_BOUNDS,
  GET_RAMPS_MATERIALS_IN_BOUNDS,
  GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS

} from '../actions/actionTypes';

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

const chartState: any = {
  rampsPerMaterial: {},
  rampsPerSizeCategory: {}
}

const geoJsonReducer = (state: IMapState = mapState, action: any) => {
  switch(action.type){
    case FETCH_ALL_GEOJSON:
      return {...state, boatRampsGeoJSON: action.payload};
    case FETCH_GEOJSON_IN_BOUNDS:
      const { totalFeatures, features } = action.payload;
      return { ...state, boatRampsGeoJSON: {
        ...state.boatRampsGeoJSON,
        totalFeatures: totalFeatures,
        features: features
      }}
    case UPDATE_MAP_BOUNDS:
      return {...state, mapBounds: action.payload};
    default: 
      return state;
  }
};

const chartDataReducer = (state: IMapState = chartState, action: any) => {
  switch(action.type){
    case GET_RAMPS_MATERIALS_IN_BOUNDS:
      return {...state, rampsPerMaterial: action.payload};
    case GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS:
      console.log(action.payload)
      return {...state, rampsPerSizeCategory: action.payload};
    default:
      return state;
  }
}

export default combineReducers({
  mapData: geoJsonReducer,
  chartData: chartDataReducer
})