import React from 'react';
import { DataGrid } from './components/DataGrid';
import { AudioQueue } from './components/AudioQueue';
import { FlashSaleEngine } from './components/FlashSaleEngine';

function App() {
  return (
    <div style={{ backgroundColor: '#f3f4f6', paddingBottom: 50 }}>
      <DataGrid />
      <hr style={{ margin: '40px 0' }} />
      <AudioQueue />
      <hr style={{ margin: '40px 0' }} />
      <FlashSaleEngine />
    </div>
  );
}

export default App;