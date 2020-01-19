import { IGeoJSON } from '../interfaces';

// s w n e
export const getGeoDataInBounds = (latMin: number, lngMin: number, latMax: number, lngMax: number, geoData: IGeoJSON) => {
  console.log('length = ' + geoData.features.length);

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
      console.log(geometry.type);
    }
    if(isValid) return feature;
  });
  console.log('new length = ' + filteredGeoData.length);
  return filteredGeoData
};

