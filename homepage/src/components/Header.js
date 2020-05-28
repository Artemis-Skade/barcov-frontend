import React from 'react';
import logo from "../assets/img/logo.png";
import burger from "../assets/img/burger.png";

import '../App.css';

function Header () {
    let [menuActivated, setMenuActivated] = React.useState(false);
    let menuStyles = "Menu MenuDeactivated";

    if (menuActivated) {
        menuStyles = "Menu";
    }

    return(
        <div className="Header">
            <a href="/"><img src={logo} className="Logo" alt="logo" /></a>
            <img src={burger} className="MenuBurger" alt="burger" onClick={() => {setMenuActivated(!menuActivated)}}/>
            <div className={menuStyles}>
                <a href="/">Unsere Idee</a>
                <a href="/unternehmen">Für Unternehmen</a>
                <a href="/gaeste">Für Gäste</a>
                <a href="/team">Team</a>
            </div>
        </div>
    );
}

export default Header;