import React from 'react';

import SatelliteMap from './components/mindmap/SatelliteMap';
import {data, config} from "./data/SatelliteData";

function App() {

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <SatelliteMap data={data} config={config} />
    </div>
  );
}

export default App;
