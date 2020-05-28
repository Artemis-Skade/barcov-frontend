import React from 'react';
import logo from "../assets/img/logo.png";

import '../App.css';

function Footer (props) {
    return(
        <div className="Footer">
            <a>© BarCovid</a>
            <a href="/impressum">Impressum</a>
            <a href="/privacypolicy">Datenschutzerklärung</a>
        </div>
    );
}

export default Footer;