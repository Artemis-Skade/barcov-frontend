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
            
            <div className="companyLogin" onClick={() => window.location.assign("/data")}>
                    <p>Firmenlogin</p>
            </div>

            <div className={menuStyles}>
                <a href="/">Unsere Idee</a>
                <a href="/unternehmen">Für Unternehmen</a>
                <a href="/gaeste">Für Gäste</a>
                <a href="/team">Team</a>
                <a href="/data" className="companyLoginBtnMenu"><span style={{fontWeight: 600, color: "#1f5db9"}}>Firmenlogin</span></a>
            </div>
        </div>
    );
}

export default Header;