import React from 'react';
import './App.css';

import Header from './components/Header.js';
import EntryForm from './components/EntryForm.js';
import LoginPrompt from './components/LoginPrompt.js';
import ConfirmationScreen from './components/ConfirmationScreen.js';
import LoginScreen from './components/LoginScreen.js';
import RegisterScreen from './components/RegisterScreen.js';

let screen, setScreen;
let storename, setStorename;

function getStoreName(store_id) {
  fetch('http://18.195.117.32:5000/store', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: store_id
    })
  }).then(response => response.json())
  .then(response => {
    window.Vars.setStorename(response.name);
  }).catch(err => {
    window.Vars.setStorename("Error while getting store name");
  });
}

function Screen() {
  if (screen === "confirmation") return (<ConfirmationScreen />);
  if (screen === "confirmationwithregistration") return (<><ConfirmationScreen /><RegisterScreen /></>);
  if (screen === "login") return (<LoginScreen />);

  // Fallback
  return (<><LoginPrompt /><EntryForm storename={storename}/></>);
}

function App() {
  [screen, setScreen] = React.useState("entry");
  [storename, setStorename] = React.useState("Loading...");

  React.useEffect(() => {
    let store_id = window.location.pathname.slice(1);
    alert("Store: " + store_id);

    window.Vars = {
      store_id: store_id,
      screen: screen,
      setScreen: setScreen,
      storename: storename,
      setStorename: setStorename,
    }

    getStoreName(); // Fetch store name from server
  }, []);

  return (
    <div className="App">
      <Header />
      <Screen />
    </div>
  );
}

export default App;
