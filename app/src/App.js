import React from 'react';
import { useCookies } from 'react-cookie';

import './App.css';

import Header from './components/Header.js';
import EntryForm from './components/EntryForm.js';
import LoginPrompt from './components/LoginPrompt.js';
import ConfirmationScreen from './components/ConfirmationScreen.js';
import LoginScreen from './components/LoginScreen.js';
import RegisterScreen from './components/RegisterScreen.js';

let screen, setScreen;
let storename, setStorename;
let formData, setFormData;

function getStoreName(store_id) {
  console.log("Store ID: " + store_id);

  fetch('http://18.195.117.32:5000/store', {
    method: 'POST',
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({
        id: store_id
    })
  }).then(res => res.json()).then(res => {
    console.log(res);
    window.Vars.setStorename(res["name"]);
  }).catch(err => {console.log(err)});
}

function Screen() {
  if (screen === "confirmation") return (<ConfirmationScreen />);
  console.log("Form: " + formData);
  if (screen === "confirmationwithregistration") return (<><ConfirmationScreen/><RegisterScreen formData={formData}/></>);
  if (screen === "login") return (<LoginScreen />);

  // Fallback
  return (<><LoginPrompt /><EntryForm storename={storename} setFormData={setFormData}/></>);
}

function App() {
  [screen, setScreen] = React.useState("entry");
  [storename, setStorename] = React.useState("Loading...");
  [formData, setFormData] = React.useState("None");
  const [cookies, setCookie] = useCookies(['sessionKey']);

  React.useEffect(() => {
    let store_id = window.location.pathname.slice(1);
    getStoreName(store_id); // Fetch store name from server

    window.Vars = {
      store_id: store_id,
      screen: screen,
      setScreen: setScreen,
      storename: storename,
      setStorename: setStorename,
      cookies: cookies,
      setCookie: setCookie,
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Screen />
    </div>
  );
}

export default App;
