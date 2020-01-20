import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import BarChart from './components/BarChart';

import { theme } from './constants';

import './App.css';
import { IState, IRampsMaterial } from './constants/interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { getRampsPerMaterialInBounds, getRampsPerSizeCategoryInBounds } from './actions/actions';

const App: React.FC = () => {

  const dispatch = useDispatch();
  const [formattedRampMaterialChartData, setFormattedRampMaterialChartData] = useState<IRampsMaterial[]>([]);
  const [formattedRampsSizeChartData, setFormattedRampsSizeChartData] = useState<any>([]);

  const boatRampData = useSelector((state: IState) => state.mapData.boatRampsGeoJSON);
  const rampsPerMaterialData = useSelector((state: IState) => state.chartData.rampsPerMaterial);
  const rampsPerSizeCategoryData = useSelector((state: IState) => state.chartData.rampsPerSizeCategory);
  const areaCategories = [50, 200, 526];

  useEffect(() => {
    console.log('updating ramps per materials')
    if (boatRampData.totalFeatures > 0) {
      getRampsPerMaterialInBounds(boatRampData, dispatch);
      getRampsPerSizeCategoryInBounds(boatRampData, areaCategories, dispatch);
    }
  }, [boatRampData]);

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
        <div className="col-6 border">
          <div className='row'>
            <h3>Ramps per material</h3>
          </div>
          <div className='row' style={styles.rampsMaterialChart}>
            <BarChart 
              data={formattedRampMaterialChartData}
              xLabel={'Materials'}
              yLabel={'Number of Ramps'}
            />
          </div>
        </div>
        <div className="col-6 border">
          <div className='row'>
            <h3>Ramps per Size Category</h3>
          </div> 
          <div className='row' style={styles.rampsMaterialChart}>
            <BarChart
              data={formattedRampsSizeChartData}
              xLabel={'Area (m^2)'}
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
    textAlign: 'center' as const
  },
  mapRow: {
    paddingBottom: theme.sizes.padding
  },
  chartRow: {
    height: '600px'
  },
  rampsMaterialChart: {
    height: '100%'
  }
}