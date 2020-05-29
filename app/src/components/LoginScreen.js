import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';

import '../App.css';

let loginData, setLoginData;
let errMsg, setErrMsg;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newLoginData = loginData;
    newLoginData[name] = event.target.value;
    setLoginData(newLoginData);
}

function login(email, password) {
    return new Promise((resolve, reject) => {
        // Generate hash
        const myBitArray = sjcl.hash.sha256.hash(password + ":" + email);
        const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

        let data = {
            storeid: window.Vars.store_id,
            email: loginData.email,
            pw_hash: myHash,
        };

        fetch('https://barcov.id:5000/login', {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            console.log(res);

            if (res["auth"]) {
                // Read in session key
                //cookies.set('sessionKey', res["session_key"]);
                //window.Vars.setScreen("confirmation");
                resolve([true, res["session_key"]]);
            } else {
                //alert("Falsche E-Mail oder Passwort!");
                //setErrMsg(res["message"]);
                resolve([false, res["message"]]);
            }
            
        }).catch(err => console.log(err));
    })
}

function handleLoginSubmit() {
    const cookies = new Cookies();
    console.log("Submitted Login");

    login(loginData.email.toLowerCase(), loginData.password).then((ret) => {
        if (!ret[0]) {
            if (ret[1].charAt(0) === "B") {
                setErrMsg(ret[1]);
            } else {
                // Try again with upper case EMail as hash
                login(loginData.email.charAt(0).toUpperCase() + loginData.email.slice(1), loginData.password).then((ret_) => {
                    if (!ret_[0]) {
                        // Wrong login!!
                        setErrMsg(ret_[1]);
                    } else {
                        // Successful
                        cookies.set('sessionKey', ret_[1]);
                        window.Vars.setScreen("confirmation");
                    }
                });
            }
        } else {
            // Successful
            cookies.set('sessionKey', ret[1]);
            window.Vars.setScreen("confirmation");
        }
    })
}

function LoginScreen () {
    [loginData, setLoginData] = React.useState({
        email: undefined,
        password: undefined,
    });

    [errMsg, setErrMsg] = React.useState("");

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

                <p className="Errormsg">{errMsg}</p>

                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn" type='button' value="Anmelden" onClick={() => {handleLoginSubmit();}}/>
                </div>
            </form>
        </div>
    );
}

export default LoginScreen;