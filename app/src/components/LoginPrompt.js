import React from 'react';

import '../App.css';

function LoginPrompt () {
    return(
        <div className="LoginPrompt">
            <p>Schon registriert?</p>
            <a href="/"><div className="LoginBtn">Anmelden</div></a>
        </div>
    );
}

export default LoginPrompt;