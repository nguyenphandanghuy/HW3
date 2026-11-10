import React from 'react';
import { DataGrid } from './components/DataGrid';
import { AudioQueue } from './components/AudioQueue';

function App() {
  return (
    <div>
      <DataGrid />
      <hr style={{ margin: '40px 0' }} />
      <AudioQueue />
    </div>
  );
}

export default App;