export interface IMapProps {

}

export interface IState {
  geoJson: IMapState
}

export interface IMapState {
  boatRampsGeoJSON: IGeoJSON
}

export interface IGeoJSON extends GeoJSON.FeatureCollection{
  totalFeatures: number
}