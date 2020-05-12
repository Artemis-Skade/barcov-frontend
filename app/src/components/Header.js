import React from 'react';
import logo from "../assets/img/logo.png";

import '../App.css';

function Header () {
    return(
        <div className="Header">
            <img src={logo} className="Logo" alt="logo" />
        </div>
    );
}

export default Header;