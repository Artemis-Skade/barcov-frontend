import React from 'react';
import logo from './logo.svg';
import './App.css';

// Component imports
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import StartScreen from './components/StartScreen.js';

// States
let screen, setScreen;

function Screen() {
  let ret;

  if (screen === "start") {
    ret = <StartScreen />;
  }
  return ret;
}

function App() {
  [screen, setScreen] = React.useState("start");

  React.useEffect(() => {

  }, []);

  return (
    <div className="App">
      <Header />
      <Screen />
      <Footer />
    </div>
  );
}

export default App;
