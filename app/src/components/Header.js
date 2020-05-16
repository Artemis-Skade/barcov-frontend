import React from 'react';
import logo from "../assets/img/logo.png";

import '../App.css';

function Header () {
    return(
        <div className="Header">
            <a href=""><img src={logo} className="Logo" alt="logo" /></a>
        </div>
    );
}

export default Header;