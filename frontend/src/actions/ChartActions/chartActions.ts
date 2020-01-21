import { Dispatch } from 'react';
import { IGeoJSON } from '../../constants/interfaces';
import {
  GET_RAMPS_MATERIALS_IN_BOUNDS,
  GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS
} from '../actionTypes';

interface IGetRampsPerXInBoundsSuccess {
  type: string,
  payload: { [key: string]: number }
}

export const getRampsPerMaterialInBoundsSuccess = (rampsPerMaterial: { [key: string]: number }): IGetRampsPerXInBoundsSuccess => ({
  type: GET_RAMPS_MATERIALS_IN_BOUNDS,
  payload: rampsPerMaterial
});

export const getRampsPerSizeCategoryInBoundsSuccess = (rampsPerSizeCategory: { [key: string]: number }) => ({
  type: GET_RAMPS_PER_SIZE_CATEGORY_IN_BOUNDS, 
  payload: rampsPerSizeCategory
});

/**
 * From the GeoJSON, get the number of ramps for each material. 
 * @param geoData - GeoJSON data 
 * @param dispatch 
 */
export const getRampsPerMaterialInBounds = (geoData: IGeoJSON): any => (dispatch: Dispatch<IGetRampsPerXInBoundsSuccess>) => {
  const features = geoData.features;
  let rampsPerMaterial: { [key: string]: number } = {};
  features.forEach((feature: GeoJSON.Feature) => {
    if (feature.properties) {
      const material = feature.properties.material;
      rampsPerMaterial[material] = (rampsPerMaterial[material] || 0) + 1;
    };
  });
  return dispatch(getRampsPerMaterialInBoundsSuccess(rampsPerMaterial));
}

export const getRampsPerSizeCategoryInBounds = (geoData: IGeoJSON, categories: number[]): any => (dispatch: Dispatch<IGetRampsPerXInBoundsSuccess>) => {
  const features = geoData.features;
  let rampsPerSizeCategory: { [key: string]: number } = {};

  features.forEach((feature: GeoJSON.Feature) => {
    if (feature.properties && categories.length > 0) {
      const area = feature.properties.area_;
      for (let i = 0; i < categories.length; i++) {
        let upper = categories[i];
        let lower = i === 0 ? 0 : categories[i - 1];
        if (area > lower && area <= upper) rampsPerSizeCategory[`${lower}-${upper}`] = (rampsPerSizeCategory[`${lower}-${upper}`] || 0) + 1;
        else if (i === 0 && area === 0) rampsPerSizeCategory[`${lower}-${upper}`] = (rampsPerSizeCategory[`${lower}-${upper}`] || 0) + 1;
      }
    }
  });
  dispatch(getRampsPerSizeCategoryInBoundsSuccess(rampsPerSizeCategory))
};