import React from 'react';
import logo from './logo.svg';
import './App.css';

// Component imports
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import StartScreen from './components/StartScreen.js';
import ForGuestScreen from './components/ForGuestScreen.js';
import ForCompanyScreen from './components/ForCompanyScreen.js';
import TeamScreen from './components/TeamScreen.js';

// States
let screen, setScreen;

function Screen() {
  let ret;

  if (screen === "start") {
    ret = <StartScreen />;
  } else if (screen === "company") {
    ret = <ForCompanyScreen />;
  } else if (screen === "guest") {
    ret = <ForGuestScreen />;
  } else if (screen === "team") {
    ret = <TeamScreen />;
  }
  return ret;
}

function App() {
  [screen, setScreen] = React.useState("start");

  React.useEffect(() => {
    let pathname = window.location.pathname.slice(1);

    if (pathname.slice(0, 11) === "unternehmen") {
      setScreen("company");
      console.log("Company Page");
    } else if (pathname.slice(0, 11) === "gaeste") {
      setScreen("guest");
      console.log("Guest Page");
    } else if (pathname.slice(0, 11) === "team") {
      setScreen("team");
      console.log("Team Page");
    }
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
