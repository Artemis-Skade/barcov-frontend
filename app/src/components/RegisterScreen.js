import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';

import '../App.css';

let registerData, setRegisterData;
let errorMsg, setErrorMsg;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newRegisterData = registerData;
    newRegisterData[name] = event.target.value;
    setRegisterData(newRegisterData);
}

function nextScreen() {
    // Go to next screen
    window.Vars.setScreen("finishscreen");
}

function handleRegisterSubmit(formData) {
    const cookies = new Cookies();
    // Handle wrong inputs
    if (registerData.password1 !== registerData.password2) {
        setErrorMsg("Passwörter stimmen nicht überein!");
        return;
    } else if (registerData.password1 === "" || registerData.password2 === "" || registerData.email === "") {
        setErrorMsg("Es sind nicht alle Felder ausgefüllt!");
        return;
    }

    console.log("Submitted Register");

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

    fetch('https://' + window.Vars.domain + ':5000/register', {
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
            window.Vars.registerMsg = res["message"];
            window.Vars.setScreen("finishscreen");
        } else {
            setErrorMsg(res["message"]);
        }
        
    }).catch(err => {
        console.log(err);
        setErrorMsg("Fehler beim Eintragen. Bitte überprüfe deine Internetverbindung oder versuche es später noch einmal.");
    });
}

function RegisterScreen (props) {
    [registerData, setRegisterData] = React.useState({
        email: "",
        password1: "",
        password2: "",
    });

    [errorMsg, setErrorMsg] = React.useState("");

    return(
        <div className="EntryForm">
            <h1>Registriere dich für's nächste mal!</h1>

            <form>
                <div className="EntryField">
                    <p>E-Mail Adresse</p>
                    <input
                        type="text"
                        name="email"
                        onChange={e => handleFieldChange("email", e)}
                    />
                </div>
                <div className="EntryField">
                    <p>Passwort</p>
                    <input
                        type="password"
                        name="password1"
                        onChange={e => handleFieldChange("password1", e)}
                    />
                </div>
                <div className="EntryField">
                    <p>Passwort wiederholen</p>
                    <input
                        type="password"
                        name="password2"
                        onChange={e => handleFieldChange("password2", e)}
                    />
                </div>

                <p className="ErrorMsg">{errorMsg}</p>

                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn" type='button' value="Jetzt Registrieren" onClick={() => {handleRegisterSubmit(props.formData);}}/>
                </div>

                <a className="gowithoutregistration" onClick={() => {nextScreen();}}>Eintragen ohne Registrierung</a>
            </form>
        </div>
    );
}

export default RegisterScreen;