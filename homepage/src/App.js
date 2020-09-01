import React from 'react';
import logo from './logo.svg';
import CookieConsent from "react-cookie-consent";

import './App.css';

// Component imports
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import StartScreen from './components/StartScreen.js';
import ForGuestScreen from './components/ForGuestScreen.js';
import ForCompanyScreen from './components/ForCompany/ForCompanyScreen.js';
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
      <CookieConsent
        location="bottom"
        buttonText="Zustimmen"
        cookieName="cookieconsent"
        style={{background: "rgb(42, 42, 42)", boxShadow: "0px 0px 20px #00000030" }}
        buttonStyle={{ background: "rgb(9, 113, 254)",
          fontWeight: 600,
          borderRadius: 5,
          color: "white",
         }}
        expires={150}
      >
        Wir verwenden Cookies. Um Dir einen uneingeschränkten Service zu gewährleisten, stimme der Cookie-Nutzung zu.
      </CookieConsent>
      <Header />
      <Screen />
      <Footer />
    </div>
  );
}

export default App;
