import React from 'react';
import Cookies from 'universal-cookie';

import './App.css';

import Header from './components/Header.js';
import Footer from './components/Footer.js';
import EntryForm from './components/EntryForm.js';
import LoginPrompt from './components/LoginPrompt.js';
import ConfirmationScreen from './components/ConfirmationScreen.js';
import LoginScreen from './components/LoginScreen.js';
import RegisterScreen from './components/RegisterScreen.js';
import CompanyRegisterScreen from './components/CompanyRegisterScreen.js';
import EMailConfirmation from './components/EMailConfirmation';
import ImpressumScreen from './components/ImpressumScreen';
import DataScreen from './components/DataScreen';
import LoginCompany from './components/LoginCompany';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen';

let screen, setScreen;
let storename, setStorename;
let formData, setFormData;
let store_id, confirmation_id;

function getStoreName(store_id) {
  console.log("Store ID: " + store_id);

  fetch('https://barcov.id:5000/store', {
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
    window.Vars.storename = storename;
  }).catch(err => {console.log(err)});
}

function Screen() {
  if (screen === "confirmation") return (<ConfirmationScreen type="entry"/>);
  if (screen === "confirmationwithregistration") return (<><ConfirmationScreen type="entry"/><RegisterScreen formData={formData}/></>);
  if (screen === "registrationsuccess") return (<ConfirmationScreen type="register"/>);
  if (screen === "login") return (<LoginScreen />);
  if (screen === "emailconfirmation") return (<EMailConfirmation id={confirmation_id}/>);
  if (screen === "companyregistration") return (<CompanyRegisterScreen />);
  if (screen === "registrationcompanysuccess") return (<ConfirmationScreen type="companyregister"/>);
  if (screen === "impressumscreen") return (<ImpressumScreen />);
  if (screen === "datascreen") return (<DataScreen />);
  if (screen === "logincompany") return (<LoginCompany />);
  if (screen === "privacypolicyscreen") return (<PrivacyPolicyScreen />);

  // Fallback
  return (<><LoginPrompt /><EntryForm storename={storename} setFormData={setFormData}/></>);
}

function checkIfLoggedIn(session_key) {
  let data = {
    storeid: window.Vars.store_id,
    session_key: session_key,
  };

  console.log(data);

  fetch('https://barcov.id:5000/checklogin', {
      method: 'POST',
      headers: {
          "Content-Type": "text/plain"
      },
      body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
      console.log(res);
      if (res["valid"]) {
        // Session Key is valid
        console.log("Session key valid. Automatically entering store.");

        // Display confirmation
        window.Vars.setScreen("confirmation");
      } else {
        // Session Key is invalid
        console.log(res["message"]);
        window.Vars.setScreen("entry");
      }
  }).catch(err => console.log(err));
}

function App() {
  [screen, setScreen] = React.useState("entry");
  [storename, setStorename] = React.useState("Loading...");
  [formData, setFormData] = React.useState("None");
  const [sessionKey, setSessionKey] = React.useState("not-fetched");
  const cookies = new Cookies();

  React.useEffect(() => {
    // Setup global vars
    window.Vars = {
      store_id: store_id,
      screen: screen,
      setScreen: setScreen,
      storename: storename,
      setStorename: setStorename,
      sessionKey: sessionKey,
      setSessionKey: setSessionKey,
    }

    let pathname = window.location.pathname.slice(1);

    if (pathname.slice(0, 12) === "confirmation") {
      setScreen("emailconfirmation");
      confirmation_id = pathname.slice(13);
      console.log("Confirmation ID: " + confirmation_id);
    } else if (pathname.slice(0, 7) === "company") {
      setScreen("companyregistration");
      console.log("Company Registration");
    } else if (pathname.slice(0, 9) === "impressum") {
      setScreen("impressumscreen");
      console.log("Impressum");
    } else if (pathname.slice(0, 13) === "privacypolicy") {
      setScreen("privacypolicyscreen");
      console.log("Privacy Policy");
    } else if (pathname.slice(0, 4) === "data" && !(cookies.get('sessionKeyCompany').length > 32)) {
      setScreen("logincompany");
      console.log("Data Screen Login");
    } else if (pathname.slice(0, 4) === "data" && (cookies.get('sessionKeyCompany').length > 32)) {
      setScreen("datascreen");
      console.log("Data Screen");
    } else {
      let store_id = pathname;
      window.Vars.store_id = store_id;
      getStoreName(store_id); // Fetch store name from server

      // load in cookie if present
      setSessionKey(cookies.get('sessionKey'));

      // Check if still logged in
      checkIfLoggedIn(cookies.get('sessionKey'));
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Screen />
      <Footer isLoggedIn={sessionKey !== undefined && sessionKey.length > 30}/>
    </div>
  );
}

export default App;
