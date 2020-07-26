import React, { useState } from 'react';
import Navigation from './Navigation/Navigation';
import Settings from './Settings/Settings';
import Main from './Main/Main'
import './App.css';

function App() {
  const [ShowSettings, setShowSettings] = useState(false)
  const [SettingsData, setSettingsData] = useState({ 
    reimburseFleetLoss: true,
    reimburseDeutConsumption: true,
    weightedCut: false, 
    convertConsumption: false, 
    conversationRate: ["3", "2"] })
  return (
    <div className="app">
      <Navigation />
      <Main
        settingsData={SettingsData}
        setShowSettings={setShowSettings} />
      {ShowSettings ?
        <Settings
          settingsData={SettingsData}
          setSettingsData={setSettingsData}
          setShowSettings={setShowSettings} /> : ""}
    </div>
  );
}

export default App;
