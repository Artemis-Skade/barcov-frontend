import React from 'react';

import '../App.css';

let loginData, setLoginData;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newLoginData = loginData;
    newLoginData[name] = event.target.value;
    setLoginData(newLoginData);
}

function handleLoginSubmit() {
    console.log("Submitted Login");

    fetch('http://18.195.117.32:5000/login', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            email: loginData.email,
            pw_hash: loginData.password,
        })
    }).then(res => res.json()).then(res => {
        console.log(res);
        // Read in session key
        window.Vars.setCookie("sessionKey", res["session_key"])
    }).catch(err => console.log(err));
}

function LoginScreen () {
    [loginData, setLoginData] = React.useState({
        email: undefined,
        password: undefined,
    });

    return(
        <div className="EntryForm">
            <h1>Anmelden</h1>

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
                        name="password"
                        onChange={e => handleFieldChange("password", e)}
                    />
                </div>

                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn" type='button' value="Anmelden" onClick={() => {window.Vars.setScreen("confirmation"); handleLoginSubmit();}}/>
                </div>
            </form>
        </div>
    );
}

export default LoginScreen;