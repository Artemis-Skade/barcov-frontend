import React from 'react';
import logo from "../assets/img/logo.png";
import Cookies from 'universal-cookie';

import '../App.css';

function logout() {
    const cookies = new Cookies();
    cookies.remove("sessionKey");
    window.Vars.setScreen("entry");
}

function Footer (props) {
    return(
        <div className="Footer">
            <a>© BarCovid</a>
            {props.isLoggedIn && <a href="" onClick={logout}>Ausloggen</a>}
            <a href="/impressum">Impressum</a>
        </div>
    );
}

export default Footer;