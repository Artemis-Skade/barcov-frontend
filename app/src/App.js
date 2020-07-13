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
import LoadingScreen from './components/LoadingScreen';
import DiningcardScreen from './components/DiningcardScreen';
import AGBScreen from './components/AGBScreen';
import DashboardScreen from './components/DashboardScreen';

let screen, setScreen;
let storename, setStorename;
let formData, setFormData;
let store_id, confirmation_id;
let scanid, setScanid;
let tables, setTables;

function getStore(store_id) {
  console.log("Store ID: " + store_id);

  fetch('https://' + window.Vars.domain + ':5000/store', {
    method: 'POST',
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({
        id: store_id,
    })
  }).then(res => res.json()).then(res => {
    console.log("Res:");
    console.log(res);
    window.Vars.setStorename(res["name"]);
    window.Vars.storename = storename;
    setTables(res['tables']);
  }).catch(err => {console.log(err)});
}

function Screen() {
  if (screen === "confirmation") return (<ConfirmationScreen type="entry" scanid={scanid}/>);
  if (screen === "confirmationwithregistration") return (<><ConfirmationScreen type="entry"/><RegisterScreen formData={formData}/></>);
  if (screen === "registrationsuccess") return (<ConfirmationScreen type="register"/>);
  if (screen === "login") return (<LoginScreen />);
  if (screen === "emailconfirmation") return (<EMailConfirmation id={confirmation_id}/>);
  if (screen === "companyregistration") return (<CompanyRegisterScreen />);
  if (screen === "registrationcompanysuccess") return (<ConfirmationScreen type="companyregister"/>);
  if (screen === "impressumscreen") return (<ImpressumScreen />);
  if (screen === "agbscreen") return (<AGBScreen />);
  if (screen === "datascreen") return (<DataScreen />);
  if (screen === "logincompany") return (<LoginCompany />);
  if (screen === "privacypolicyscreen") return (<PrivacyPolicyScreen />);
  if (screen === "loading") return (<LoadingScreen />);
  if (screen === "speisekarte") return (<DiningcardScreen />);
  if (screen === "dashboard") return (<DashboardScreen />);

  // Fallback
  return (<><LoginPrompt /><EntryForm storename={storename} setFormData={setFormData} tables={tables}/></>);
}

function checkIfLoggedIn(session_key) {
  let data = {
    storeid: window.Vars.store_id,
    session_key: session_key,
  };

  console.log(data);

  fetch('https://' + window.Vars.domain + ':5000/checklogin', {
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

        setScanid(res["id"]);
        console.log("test");

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
  [scanid, setScanid] = React.useState();
  [tables, setTables] = React.useState([]);
  const [sessionKey, setSessionKey] = React.useState("not-fetched");
  const cookies = new Cookies();

  React.useEffect(() => {
    // Setup global vars
    let domain = window.location.hostname;

    if (domain === "localhost") {
      domain = "test.barcov.id";
    }
    
    window.Vars = {
      domain: domain,
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
    } else if (pathname.slice(0, 3) === "agb") {
      setScreen("agbscreen");
      console.log("AGB");
    } else if (pathname.slice(0, 4) === "data") {
      setScreen("datascreen");
      console.log("Data Screen");
    } else if (pathname.slice(0, 4) === "menu") {
      setScreen("speisekarte");
      console.log("Speisekarte");
    } else if (pathname.slice(0, 9) === "dashboard") {
      setScreen("dashboard");
      console.log("Dashboard");
    } else {
      let pathparts = pathname.split("/");

      let store_id = pathparts[0];

      window.Vars.store_id = store_id;
      getStore(store_id); // Fetch store name and table names from server

      // load in cookie if present
      setSessionKey(cookies.get('sessionKey'));

      // Check if still logged in
      checkIfLoggedIn(cookies.get('sessionKey'));
    }
  }, []);

  let sessionKeyCompany = cookies.get("sessionKeyCompany");

  return (
    <div className="App">
      <Header />
      <Screen />
      <Footer isLoggedIn={(sessionKey !== undefined && sessionKey.length > 30) || (sessionKeyCompany !== undefined && sessionKeyCompany.length > 30)}/>
    </div>
  );
}

export default App;
