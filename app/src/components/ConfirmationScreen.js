import React from 'react';
import sound from "../assets/sounds/ton.wav";

import '../App.css';
import '../Success.css';

function ConfirmationScreen () {

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
            <h1 style={{textAlign: "center"}}>Vielen Dank! Du wurdest erfolgreich eingetragen!</h1>
        </div>
    );
}

export default ConfirmationScreen;