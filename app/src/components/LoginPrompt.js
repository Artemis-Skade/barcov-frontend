import React from 'react';

import '../App.css';

function LoginPrompt () {
    return(
        <div className="LoginPrompt">
            <p>Schon registriert?</p>
            <a onClick={() => window.Vars.setScreen("login")}><div className="LoginBtn">Anmelden</div></a>
        </div>
    );
}

export default LoginPrompt;