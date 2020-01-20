import { IGeoJSON, IRampsMaterial, IRampsSizeCategory } from '../interfaces';

// s w n e
export const getGeoDataInBounds = (latMin: number, lngMin: number, latMax: number, lngMax: number, geoData: IGeoJSON) => {
  let filteredGeoData = geoData.features.filter((feature: GeoJSON.Feature) => {
    let isValid = false;
    const geometry = feature.geometry;
    if (geometry.type === 'MultiPolygon') {
      const coordinates = geometry.coordinates;
      // LngLat instead of LatLng 
      const [[lngLatArray]] = coordinates;
      lngLatArray.forEach(lngLat => {
        let [lng, lat] = lngLat;
        // Check all coordinates of the polygon are within the view latLngBounds;
        if (lat < latMax && lat > latMin && lng < lngMax && lng > lngMin) isValid = true;
      })
    } else {
      console.log(`Not a Multipolygon Geometry: ${geometry.type}`);
    }
    if(isValid) return feature;
  });
  return filteredGeoData
};

export const getRampsPerMaterial = (geoData: IGeoJSON) => {
  const features = geoData.features;
  let rampsPerMaterial: IRampsMaterial = {};
  features.forEach((feature: GeoJSON.Feature) => {
    if(feature.properties){
      const material = feature.properties.material;
      rampsPerMaterial[material] = (rampsPerMaterial[material] || 0) + 1;
    };
  });
  return rampsPerMaterial;
}

export const getRampsPerSizeCategory = (geoData: IGeoJSON, categories: number[]) => {
  const features = geoData.features;
  let rampsPerSizeCategory: IRampsMaterial = {};
  
  features.forEach((feature: GeoJSON.Feature) => {
    if(feature.properties){
      const area = feature.properties.area_;
      for(let i = 0; i < categories.length; i++){
        let upper = categories[i];
        let lower = i === 0 ?  0 : categories[i-1];
        if(area > lower && area <= upper) rampsPerSizeCategory[upper] = (rampsPerSizeCategory[upper] || 0) + 1;
        else if(i === 0 && area === 0) rampsPerSizeCategory[upper] = (rampsPerSizeCategory[upper] || 0) + 1;
      }
    }
  });
  return rampsPerSizeCategory;
}