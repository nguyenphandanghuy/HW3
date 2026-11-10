import React, { useState } from 'react';

interface AudioTask {
  id: number;
  name: string;
  status: 'PROCESSING' | 'QUEUED';
}

export const AudioQueue: React.FC = () => {
  const [tasks, setTasks] = useState<AudioTask[]>([
    { id: 5, name: 'Demo audio task 5', status: 'PROCESSING' },
    { id: 6, name: 'Demo audio task 6', status: 'QUEUED' },
    { id: 7, name: 'Demo audio task 7', status: 'QUEUED' },
    { id: 8, name: 'Demo audio task 8', status: 'QUEUED' },
  ]);

  const addTask = () => {
    const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks([...tasks, { id: nextId, name: `Demo audio task ${nextId}`, status: 'QUEUED' }]);
  };

  const clearQueue = () => {
    setTasks([]);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: 30, borderRadius: 12, maxWidth: 800, margin: '20px auto' }}>
      <h2>Audio task queue</h2>
      <p style={{ color: '#94a3b8' }}>Queue execution in line by order</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={addTask} style={{ backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>
          Add demo task
        </button>
        <button onClick={clearQueue} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>
          Clear queue
        </button>
      </div>

      {/* Visualizer Waveform giả lập */}
      <div style={{ backgroundColor: '#1e293b', height: 120, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
        <div style={{ width: 8, height: 40, backgroundColor: '#38bdf8' }}></div>
        <div style={{ width: 8, height: 70, backgroundColor: '#38bdf8' }}></div>
        <div style={{ width: 8, height: 30, backgroundColor: '#38bdf8' }}></div>
        <div style={{ width: 8, height: 90, backgroundColor: '#818cf8' }}></div>
        <div style={{ width: 8, height: 50, backgroundColor: '#38bdf8' }}></div>
      </div>

      <h3>Queue Items ({tasks.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.map((t) => (
          <div key={t.id} style={{ backgroundColor: '#1e293b', padding: 12, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{t.name}</span>
            <span style={{ fontSize: 12, fontWeight: 'bold', color: t.status === 'PROCESSING' ? '#38bdf8' : '#94a3b8' }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};