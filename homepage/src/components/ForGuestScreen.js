import React from 'react';
import sjcl from 'sjcl';
import sound from "../assets/sounds/ding.mp3";
import Cookies from 'universal-cookie';

import '../App.css';
import '../Success.css';

let formData, setFormData;
let errormsg, setErrormsg;
let acceptedPrivacyPolicy, setAcceptedPrivacyPolicy;

let registerData, setRegisterData;
let registered, setRegistered;

function handleRegisterFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newRegisterData = registerData;
    newRegisterData[name] = event.target.value;
    setRegisterData(newRegisterData);
}

function register() {
    const cookies = new Cookies();

    console.log("Submitting Register");

    // Handle E-mail in lowercase
    registerData.email = registerData.email.toLowerCase();

    const myBitArray = sjcl.hash.sha256.hash(registerData.password1 + ":" + registerData.email);
    const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

    //console.log("PW with salt: " + registerData.password1 + ":" + registerData.email +  " Hash: " + myHash);

    let data = {
        email: registerData.email,
        pw_hash: myHash,
    };

    Object.assign(data, formData);
    //console.log(data);

    fetch('https://barcov.id:5000/register', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log("Registered:");
        console.log(res);

        // Check if registration was successful
        if (res["success"]) {
            setRegistered(true);
        } else {
            alert(res["message"]);
        }
        
    }).catch(err => console.log(err));
}

function EntryField (props){
    let className = "EntryField";
    let type = "text";
    if (props.type === "inline1") { className += " InlineField1"; type="number" }
    if (props.type === "inline2") className += " InlineField2";

    return (
        <div className={className}>
            <p>{props.displayname}</p>
            <input
                type={type}
                name={props.name}
                onChange={e => handleFieldChange(props.name, e)}
            />
        </div>
    );
}

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newFormData = formData;
    newFormData[name] = event.target.value;
    setFormData(newFormData)
}

function handleCheckClick(event) {
    setAcceptedPrivacyPolicy(!acceptedPrivacyPolicy);
}

function handleSubmit () {
    // First: Send personal data to /entry endpoint
    if (!acceptedPrivacyPolicy) {
        setErrormsg("Bestätige zuerst die Datenschutzerklärung!");
        return;
    }

    //console.log("Submitting Entry: " + JSON.stringify(entry));
    console.log("Submitting personal data...");

    // Check if all fields are filled out
    for (let key of Object.keys(formData)) {
        if (formData[key] === "") {
            setErrormsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }
    }

    // Account data checking
    if (registerData.password1 !== registerData.password2) {
        setErrormsg("Passwörter stimmen nicht überein!");
        return;
    } else if (registerData.password1 === "" || registerData.password2 === "" || registerData.email === "") {
        setErrormsg("Es sind nicht alle Felder ausgefüllt!");
        return;
    }

    fetch('https://barcov.id:5000/enter', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(formData)
    }).then(res => res.json()).then(res => {
        console.log(res);

        // Then: Send register data
        register();
    }).catch(err => {
        console.log(err)
        setErrormsg("Fehler beim Eintragen. Bitte überprüfe deine Internetverbindung oder versuche es später noch einmal.");
    });
}

function ForGuestScreen (props) {
    [formData, setFormData] = React.useState({
        fname: "",
        lname: "",
        phone: "",
        street: "",
        zip: "",
        town: "",
    });
    [registerData, setRegisterData] = React.useState({
        email: "",
        password1: "",
        password2: "",
    });

    [registered, setRegistered] = React.useState(false);
    [errormsg, setErrormsg] = React.useState("");
    [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = React.useState(false);

    let submitClassNames = "EntrySubmit";

    if (!acceptedPrivacyPolicy) {
        submitClassNames += " EntrySubmitDisabled";
    }

    let registeredStyle = (flag) => {if(registered === flag) {return {display: "none"};} else {return {display: "block"};}};

    return(
        <div className="Wrapper">
            <h1>Für Gäste</h1>

            <div className="RegisterWrapper" style={registeredStyle(true)}>
                <h2 style={{textAlign: "center"}}>Registriere Dich schon einmal als Gast</h2>

                <div className="EntryForm">
                <form>
                    <h2>Persönliche Daten</h2>
                    <EntryField name="fname" displayname="Vorname"/>
                    <EntryField name="lname" displayname="Nachname"/>
                    <EntryField name="phone" displayname="Telefonnummer"/>
                    <EntryField name="street" displayname="Straße und Hausnr."/>
                    <EntryField type="inline1" name="zip" displayname="PLZ"/>
                    <EntryField type="inline2" name="town" displayname="Ort"/>

                    <h2 style={{marginTop: 200}}>Benutzerkonto</h2>

                    <div className="EntryField">
                        <p>E-Mail Adresse</p>
                        <input
                            type="text"
                            name="email"
                            onChange={e => handleRegisterFieldChange("email", e)}
                        />
                    </div>
                    <div className="EntryField">
                        <p>Passwort</p>
                        <input
                            type="password"
                            name="password1"
                            onChange={e => handleRegisterFieldChange("password1", e)}
                        />
                    </div>
                    <div className="EntryField">
                        <p>Passwort wiederholen</p>
                        <input
                            type="password"
                            name="password2"
                            onChange={e => handleRegisterFieldChange("password2", e)}
                        />
                    </div>

                    <div className="CheckboxWrapper">
                        <input type="checkbox" id="acceptprivacypolicy" name="vehicle1" className="Checkbox" value={acceptedPrivacyPolicy} checked={acceptedPrivacyPolicy} onClick={handleCheckClick}/> <p className="CheckboxText">Ich habe die <a href="/privacypolicy">Datenschutzerklärung</a> gelesen und bin einverstanden.</p>
                    </div>

                    <p className="Errormsg">{errormsg}</p>
                    <div className={submitClassNames}>
                        <input className="EntrySubmitBtn" type='button' value="Registrieren" onClick={() => {handleSubmit();}}/>  
                    </div>
                </form>
                </div>
            </div>

            <div className="RegisterWrapper" style={registeredStyle(false)}>
                <div className="success-checkmark">
                    <div className="check-icon">
                        <span className="icon-line line-tip"></span>
                        <span className="icon-line line-long"></span>
                        <div className="icon-circle"></div>
                        <div className="icon-fix"></div>
                    </div>
                </div>

                <h1 style={{textAlign: "center"}}>Du wurdest erfolgreich registriert! Verifiziere dein BarCov-Konto mit der Aktivierungsmail, die wir dir zugeschickt haben.</h1>
            </div>
        </div>
    );
}

export default ForGuestScreen;