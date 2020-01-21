import {
  getRampsPerMaterialInBounds,
  getRampsPerSizeCategoryInBounds
} from '../../actions/ChartActions/chartActions';

import {
  fetchRampsWithinBounds
} from '../../actions/MapActions/mapActions';

import { GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS, GET_RAMPS_MATERIALS_IN_BOUNDS, FETCH_ALL_GEOJSON, FETCH_GEOJSON_IN_BOUNDS } from '../../actions/actionTypes';

import { mockGeoData, mockFeaturesInBounds } from '../../resources/mockData';

import config from '../../FrontEndConfig.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { LatLngBounds, latLng } from 'leaflet';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Testing the Chart Actions', () => {
  it('Should get the number of ramps for each material and load them into store', () => {
    const expectedPayload = {
      'Gravel': 1,
      'Concrete': 2
    };
    const expectedActions = {
      type: GET_RAMPS_MATERIALS_IN_BOUNDS,
      payload: expectedPayload
    };
    const store = mockStore({});

    store.dispatch(getRampsPerMaterialInBounds(mockGeoData));

    const actions = store.getActions();
    expect(actions).toEqual([expectedActions])
  });

  it('Should get the number of ramps per area/size category', () => {
    const expectedPayload = {
      '0-50': 1,
      '50-200': 1,
      '200-526': 1
    };
    const expectedAction = {
      type: GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS,
      payload: expectedPayload
    };
    const store = mockStore({});
    const categories = [50, 200, 526];

    store.dispatch(getRampsPerSizeCategoryInBounds(mockGeoData, categories));

    const actions = store.getActions();
    expect(actions).toEqual([expectedAction])
  })
});

describe('Testing the Map Actions', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  })

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  })
  
  it('Should fetch all GeoJSON data within the provided LatLngBounds', () => {
    const bounds = {
      south: -28.6, 
      west: 152.2, 
      north: -27.5, 
      east: 154.6
    };
    const { south, west, north, east } = bounds;

    mock.onGet(`${config.ServerURL}/data/filter?southWest=${south},${west}&northEast=${north},${east}`)
    .replyOnce(200, mockFeaturesInBounds);
    
    const expectedAction = {
      type: FETCH_GEOJSON_IN_BOUNDS,
      payload: mockFeaturesInBounds
    }
    
    let southWest = latLng(south,west);
    let northEast = latLng(north,east)
    let latLngBounds: LatLngBounds = new LatLngBounds(southWest, northEast);

    const store = mockStore({});

    return store.dispatch(fetchRampsWithinBounds(latLngBounds)).then(() => {
      expect(store.getActions()).toEqual([expectedAction])
    })
  })
});