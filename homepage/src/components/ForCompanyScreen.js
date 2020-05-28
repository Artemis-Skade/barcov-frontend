import React from 'react';
import { Player } from 'video-react';
import tutorial from "../assets/video/tutorial.mp4";

import '../App.css';

function ForCompanyScreen () {
    return(
        <div className="Wrapper">
            <h1 className="companyH1">Einrichtung für Ihren Betrieb – ganz einfach:</h1>
            <video className="Tutorialvideo" id="samp" width="640" height="480" autoPlay>
                <source src={tutorial} type="video/mp4">
                </source>
            </video>
            <h2 className="companyH2">Erklärvideo – Erstellt von <strong><a href="https://epic-film.de">e.pic. Film</a></strong></h2>
            
            <a href="/company" style={{textDecoration: "none"}}>
                <div className="companyRegisterBtn">
                    <p>Jetzt Betrieb einrichten</p>
                </div>
            </a>
        </div>
    );
}

export default ForCompanyScreen;