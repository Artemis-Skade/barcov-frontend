import React from 'react';
import sound from "../assets/sounds/ding.mp3";
import Cookies from 'universal-cookie';

import '../App.css';

function sendConfirmation(id) {
    const cookies = new Cookies();

    console.log("Sending ID: " + id);
    fetch('https://' + window.Vars.domain + ':5000/confirmation', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            link: id
        })
    }).then(res => res.json()).then(res => {
        console.log(res);

        if (res["success"]) {
            console.log("User confirmed! Logging in..");

            let recEmail = res["email"];
            let recHash = res["pw_hash"];

            // Login for session key
            fetch('https://' + window.Vars.domain + ':5000/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    email: recEmail,
                    pw_hash: recHash,
                })
            }).then(res => res.json()).then(res => {
                console.log("LogIn:");
                console.log(res);
                if (res["auth"]) {
                    // Read in session key
                    cookies.set('sessionKey', res["session_key"], {path: "/", secure: true});
                    console.log("Login successful!");
                } else {
                    console.log("Login denied!");
                }
            }).catch(err => console.log(err));
        }
    }).catch(err => {console.log(err)});
}

function EMailConfirmation (props) {
    let message = "Dein Account wurde erfolgreich aktiviert!";

    sendConfirmation(props.id);

    return(
        <div className="EMailConfirmation">
            <audio autoPlay src={sound} type="audio/wav"/>
            <div className="success-checkmark">
                <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                </div>
            </div>
            <h1 style={{textAlign: "center"}}>{message}</h1>
        </div>
    );
}

export default EMailConfirmation;