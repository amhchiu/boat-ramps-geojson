import React, { useEffect, useState } from 'react';
import Map from './components/Map/Map';
import MaterialChart from './components/MaterialChart/MaterialChart';
import AreaChart from './components/AreaChart/AreaChart';
import { Grid } from '@material-ui/core';

import { theme } from './constants';

import './App.css';
import { IState, IRampsMaterial, IRampsArea } from './constants/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { getRampsPerMaterialInBounds, getRampsPerSizeCategoryInBounds } from './actions/actions';

import config from './FrontEndConfig.json';

import { style } from 'typestyle';

const App: React.FC = () => {

  const dispatch = useDispatch();
  const [formattedRampMaterialChartData, setFormattedRampMaterialChartData] = useState<IRampsMaterial[]>([]);
  const [formattedRampsSizeChartData, setFormattedRampsSizeChartData] = useState<IRampsArea[]>([]);

  const boatRampData = useSelector((state: IState) => state.mapData.boatRampsGeoJSON);
  const rampsPerMaterialData = useSelector((state: IState) => state.chartData.rampsPerMaterial);
  const rampsPerSizeCategoryData = useSelector((state: IState) => state.chartData.rampsPerSizeCategory);

  // array of area size categories used by the Ramps per Size Category bar chart. 
  const areaCategories = config.AreaSizeCategories;

  /**
   * Every time the Map data changes, this fetches and updates 
   * the chart data in the store.
   */
  useEffect(() => {
    if (boatRampData.totalFeatures > 0) {
      dispatch(getRampsPerMaterialInBounds(boatRampData));
      dispatch(getRampsPerSizeCategoryInBounds(boatRampData, areaCategories));
    }
  }, [boatRampData]);

  /**
   * Every time the ramps per material data in global store changes
   * such as from the above useEffect; this will
   * create a formatted array of [{x: x1, y: y1},...] values
   * used by the d3 bar chart (kept in Local State);
   */
  useEffect(() => {
    if (Object.entries(rampsPerMaterialData).length > 0) {
      let barChartData = [];
      for (let material in rampsPerMaterialData) {
        barChartData.push({
          material: material,
          ramps: rampsPerMaterialData[material]
        });
      };
      setFormattedRampMaterialChartData(barChartData);
    }
  }, [rampsPerMaterialData]);

  /**
   * Every time the ramps per size category data in global store changes,
   * this creates a formatted array of [{x: x1, y: y1},...] values
   * used by the d3 bar chart (kept in Local State)
   */
  useEffect(() => {
    if (Object.entries(rampsPerSizeCategoryData).length > 0) {
      let barChartData = [];
      for (let area in rampsPerSizeCategoryData) {
        barChartData.push({
          area: area,
          ramps: rampsPerSizeCategoryData[area]
        });
      };
      setFormattedRampsSizeChartData(barChartData);
    }
  }, [rampsPerSizeCategoryData]);

  const HeaderRow = () => (
    <Grid item xs={12} className={headerRowFont}>
      Boat Ramps GeoJSON Visualisation
    </Grid>
  );

  const MaterialChartRow = () => (
    <>
      <Grid item xs={12} className={materialRowFont}>Ramps per Material</Grid>
      <Grid item xs={12} className={materialChartClass}>
        <MaterialChart
          data={formattedRampMaterialChartData}
          xLabel={'Materials'}
          yLabel={'Number of Ramps'}
        />
      </Grid>
    </>
  );

  const AreaChartRow = () => (
    <>
      <Grid item xs={12} className={materialRowFont}>Ramps per Area</Grid>
      <Grid item xs={12} className={materialChartClass}>
        <AreaChart
          data={formattedRampsSizeChartData}
          xLabel={'Area'}
          yLabel={'Number of Ramps'}
        />
      </Grid>
    </>
  );

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={3} />
        <Grid container item xs={12} sm={6}>
          <HeaderRow />
          <Map />
          <MaterialChartRow />
          <AreaChartRow />
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </div>
  );
}

export default App;

const fontSize = (value: number | string) => {
  const valueStr = typeof value === 'string' ? value : value + 'px';
  return {
    fontSize: valueStr
  }
}

const headerRowFont = style(
  fontSize(24),
  { fontWeight: 'bold' },
  { textAlign: 'center' }
);

const materialRowFont = style(
  fontSize(16),
  { textAlign: 'center' }
)

const materialChartClass = style(
  { border: 'solid' },
  { height: '500px' }
)