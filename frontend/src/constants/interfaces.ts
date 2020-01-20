export interface IMapProps {

}

export interface IState {
  mapData: IMapState,
  chartData: IChartState
}

export interface IMapState {
  boatRampsGeoJSON: IGeoJSON,
  mapBounds: IMapBounds,
  selectedMaterial: string,
  selectedSizeCategory: string
}

export interface IChartState {
  rampsPerMaterial: {
    [key: string]: number
  },
  rampsPerSizeCategory: {
    [key: string]: number
  }
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

export interface IRampsMaterial {
  material: string,
  ramps: number
}

export interface IRampsArea {
  area: string,
  ramps: number
}