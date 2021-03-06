import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';

import '../App.css';

let loginData, setLoginData;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newLoginData = loginData;
    newLoginData[name] = event.target.value;
    setLoginData(newLoginData);
}

function handleLoginSubmit() {
    const cookies = new Cookies();
    console.log("Submitted Login");

    // TAKE OUT
    //window.Vars.setScreen("datascreen");
    //return;
    // TAKE OUT

    // Generate hash
    const myBitArray = sjcl.hash.sha256.hash(loginData.password + ":" + loginData.email);
    let myHash = String(sjcl.codec.hex.fromBits(myBitArray));

    let data = {
        email: loginData.email,
        pw_hash: myHash,
    };

    console.log(data);

    fetch('https://' + window.Vars.domain + ':5000/logincompany', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);

        if (res["auth"]) {
            // Read in session key
            cookies.set('sessionKeyCompany', res["session_key"], {path: "/"});
            window.Vars.setScreen("dashboard");
            console.log(res["companies"])
            window.Vars.companies = res["companies"];
        } else {
            alert("Falsche E-Mail oder Passwort!");
        }

    }).catch(err => console.log(err));
}

function LoginCompany () {
    [loginData, setLoginData] = React.useState({
        email: undefined,
        password: undefined,
    });

    return(
        <div className="EntryForm">
            <h1>Unternehmensanmeldung</h1>

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
                    <input className="EntrySubmitBtn EntrySubmitBtnCompany" type='button' value="Anmelden" onClick={() => {handleLoginSubmit();}}/>
                </div>
                <p>Registrieren Sie ihren eigenen Betrieb <a href="/unternehmen">hier</a>!</p>
                <br />
            </form>
        </div>
    );
}

export default LoginCompany;
