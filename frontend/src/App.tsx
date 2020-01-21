import React, { useEffect, useState } from 'react';
import Map from './components/Map/Map';
import MaterialChart from './components/MaterialChart/MaterialChart';
import AreaChart from './components/AreaChart/AreaChart';

import { theme } from './constants';

import './App.css';
import { IState, IRampsMaterial, IRampsArea } from './constants/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { getRampsPerMaterialInBounds, getRampsPerSizeCategoryInBounds } from './actions/actions';

import config from './FrontEndConfig.json';

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
    if (Object.entries(rampsPerMaterialData).length > 0){
      let barChartData = [];
      for(let material in rampsPerMaterialData){
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
    if (Object.entries(rampsPerSizeCategoryData).length > 0){
      let barChartData = [];
      for(let area in rampsPerSizeCategoryData){
        barChartData.push({
          area: area,
          ramps: rampsPerSizeCategoryData[area]
        });
      };
      setFormattedRampsSizeChartData(barChartData);
    }
  }, [rampsPerSizeCategoryData]);
  
  return (
    <div className="App" style={styles.container}>
      <div className="row">
        <div className="col-12">
          <h2>Boat Ramps GeoJSON Visualisation</h2>
        </div>
      </div>
      <div className="row" style={styles.mapRow}>
        <div className="col-12">
          <Map />
        </div>
      </div>
      <div className="row" style={styles.chartRow}>
        <div className="col-6">
          <div className='row'>
            <h3>Ramps per material</h3>
          </div>
          <div className='row' style={styles.rampsMaterialChart}>
            <MaterialChart 
              data={formattedRampMaterialChartData}
              xLabel={'Materials'}
              yLabel={'Number of Ramps'}
            />
          </div>
        </div>
        <div className="col-6" style={styles.areaChart}>
          <div className='row'>
            <h3>Ramps per Size Category</h3>
          </div> 
          <div className='row' style={styles.rampsMaterialChart}>
            <AreaChart
              data={formattedRampsSizeChartData}
              xLabel={'Area'}
              yLabel={'Number of Ramps'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    paddingLeft: theme.sizes.padding * 4,
    paddingRight: theme.sizes.padding * 4,
    textAlign: 'center' as const,
  },
  mapRow: {
    paddingBottom: theme.sizes.padding
  },
  chartRow: {
    height: '600px'
  },
  areaChart: {

  },
  rampsMaterialChart: {
    height: '100%'
  }
}