import React from 'react';
import Map from './components/Map';
import { theme } from './constants';

const App: React.FC = () => {

  return (
    <div className="App" style={styles.container}>
      <div style={styles.titleRow}>
        <h1>Vortexa technical exercise</h1>
      </div>
      <div style={styles.mapRow}>     
        <Map />
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    padding: theme.sizes.padding,
    textAlign: 'center' as const
  },
  titleRow: {
    display: 'flex',
    flex: 1,
  },
  mapRow: {
    display: 'flex',
    flex: 1,
    width: '60vw',
    border: 'solid',
  }
}