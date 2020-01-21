export interface IGeoJSON extends GeoJSON.FeatureCollection{
  totalFeatures: number
}

export interface IRampsMaterial {
  [key: string]: number
}

export interface IRampsSizeCategory {
  zeroTo50: number,
  fiftyTo200: number,
  twoHundredTo526: number
}