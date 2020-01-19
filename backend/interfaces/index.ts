export interface IGeoJSON extends GeoJSON.FeatureCollection{
  totalFeatures: number,
  geometry_name: string
}