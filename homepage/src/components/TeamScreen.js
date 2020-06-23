import React from 'react';
import teampic from "../assets/img/team.jpg";

import '../App.css';

function TeamScreen () {
    return(
        <div className="Wrapper">
            <h1>Team</h1>
            
            <img src={teampic} className="teampic"/>
            
            <h2 className="teamdesc">V.l.n.r.: Max Schild, Kimberly Hellen, Max von Wolff, Jonathan Fritz, Christopher Fritz</h2>
        </div>
    );
}

export default TeamScreen;