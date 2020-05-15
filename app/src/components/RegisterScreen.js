import React from 'react';
import sjcl from 'sjcl'

import '../App.css';

let registerData, setRegisterData;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newRegisterData = registerData;
    newRegisterData[name] = event.target.value;
    setRegisterData(newRegisterData);
}

function handleRegisterSubmit(formData) {
    // Handle wrong inputs
    if (registerData.password1 !== registerData.password2) {
        alert("Passwörter stimmen nicht überein!");
        return;
    } else if (registerData.password1 === "" || registerData.password2 === "" || registerData.email === "") {
        alert("Es sind nicht alle Felder ausgefüllt!");
        return;
    }

    console.log("Submitted Register");
    window.Vars.setScreen("enter");

    const myBitArray = sjcl.hash.sha256.hash(registerData.password1 + ":" + registerData.email);
    const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

    console.log("PW with salt: " + registerData.password1 + ":" + registerData.email +  " Hash: " + myHash);

    let data = {
        email: registerData.email,
        pw_hash: myHash,
    };

    Object.assign(data, formData);
    console.log(data);

    fetch('http://18.195.117.32:5000/register', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
        // Read in session key
        window.Vars.setCookie("sessionKey", res["session_key"])
    }).catch(err => console.log(err));

    // Login for session key
    
}

function RegisterScreen (props) {
    [registerData, setRegisterData] = React.useState({
        email: "",
        password1: "",
        password2: "",
    });

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

                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn" type='button' value="Registrieren" onClick={() => {handleRegisterSubmit(props.formData);}}/>
                </div>
            </form>
        </div>
    );
}

export default RegisterScreen;