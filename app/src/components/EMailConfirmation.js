import React from 'react';
import sound from "../assets/sounds/ton.wav";

import '../App.css';

function sendConfirmation(id) {
    console.log("Sending ID: " + id);
    fetch('https://barcov.id:5000/confirmation', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            link: id
        })
    }).then(res => res.json()).then(res => {
        console.log(res);
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