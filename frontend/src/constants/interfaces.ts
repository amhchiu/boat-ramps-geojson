export interface IMapProps {

}

export interface IState {
  geoJson: IMapState
}

export interface IMapState {
  boatRampsGeoJSON: IGeoJSON,
  mapBounds: IMapBounds
}

export interface IGeoJSON extends GeoJSON.FeatureCollection{
  totalFeatures: number
}

export interface IMapBounds {
  south: number,
  west: number,
  north: number,
  east: number
}