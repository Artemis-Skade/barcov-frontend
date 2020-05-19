import React from 'react';
import sound from "../assets/sounds/ton.wav";

import '../App.css';
import '../Success.css';

function ConfirmationScreen (props) {
    let message = "";

    if (props.type === "entry") {
        message = <>Vielen Dank! Du wurdest erfolgreich bei <strong style={{color: "#07256b"}}>{window.Vars.storename}</strong> eingetragen!</>;
    } else if (props.type === "register") {
        message = "Du wurdest erfolgreich registriert! Verifiziere dein BarCov-Konto mit der Aktivierungsmail, die wir dir zugeschickt haben.";
    } else if (props.type === "companyregister") {
        message = "Das Unternehmen wurde erfolgreich registriert.";
    }

    return(
        <div className="EntryForm">
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

export default ConfirmationScreen;