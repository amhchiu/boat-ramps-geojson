import { combineReducers } from 'redux';
import { IMapState, IChartState } from "../constants/interfaces";
import { 
  FETCH_GEOJSON_IN_BOUNDS,
  FETCH_ALL_GEOJSON,
  UPDATE_MAP_BOUNDS,
  GET_RAMPS_MATERIALS_IN_BOUNDS,
  GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS,
  UPDATE_SELECTED_MATERIAL,
  CLEAR_SELECTED_MATERIAL,
  UPDATE_TOTAL_FEATURES,
  UPDATE_SELECTED_SIZECAT,
  CLEAR_SELECTED_SIZECAT

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
  },
  selectedMaterial: '',
  selectedSizeCategory: ''
};

const chartState: IChartState = {
  rampsPerMaterial: {},
  rampsPerSizeCategory: {}
}

const geoJsonReducer = (state: IMapState = mapState, action: any) => {
  switch(action.type){
    case FETCH_ALL_GEOJSON:
      return {...state, boatRampsGeoJSON: action.payload};
    case FETCH_GEOJSON_IN_BOUNDS:
      return { ...state, boatRampsGeoJSON: {
        ...state.boatRampsGeoJSON,
        totalFeatures: action.payload.length,
        features: action.payload
      }}
    case UPDATE_MAP_BOUNDS:
      return {...state, mapBounds: action.payload};
    case UPDATE_SELECTED_MATERIAL:
      return {...state, selectedMaterial: action.payload};
    case CLEAR_SELECTED_MATERIAL: 
      return {...state, selectedMaterial: ''};
    case UPDATE_SELECTED_SIZECAT:
      return {...state, selectedSizeCategory: action.payload};
    case CLEAR_SELECTED_SIZECAT:
      return {...state, selectedSizeCategory: ''};
    case UPDATE_TOTAL_FEATURES:
      return {...state, boatRampsGeoJSON: {
        ...state.boatRampsGeoJSON,
        totalFeatures: action.payload
      }};
    default: 
      return state;
  }
};

const chartDataReducer = (state: IChartState = chartState, action: any) => {
  switch(action.type){
    case GET_RAMPS_MATERIALS_IN_BOUNDS:
      console.log(action.payload);
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