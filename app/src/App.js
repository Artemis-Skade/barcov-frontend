import React from 'react';
import './App.css';

import Header from './components/Header.js';
import EntryForm from './components/EntryForm.js';
import LoginPrompt from './components/LoginPrompt.js';

function App() {
  return (
    <div className="App">
      <Header />
      <LoginPrompt />
      <EntryForm />
    </div>
  );
}

export default App;
