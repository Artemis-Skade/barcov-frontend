import React from 'react';
import iphone from '../assets/img/iphone.png';
import playbtn from '../assets/img/playBtn.png';
import phoneicon from '../assets/img/phoneIcon.png';
import samplepage from '../assets/img/samplepage.png';

import '../App.css';

function StartScreen () {
    return(
        <div className="Wrapper">
            <div className="FirstSection">
                <div className="Textfield">
                    <h1>Check in, get in</h1>
                    <h2>Verabschieden Sie sich von der Zettelwirtschaft!</h2>
                    <h2><strong>BarCov</strong> – Ihre digitale Software zur Datenspeicherung in der Coronakrise.</h2>
                    <br />
                    <a href="unternehmen">
                        <div className="mainBtn">
                            <img src={playbtn} className="PlayBtn" alt="playbtn" /> <p>Einrichtung für Ihre Firma</p>
                        </div>
                    </a>
                </div>
                <div className="PhonePreview">
                    <img src={iphone} className="PhonePreviewImg" alt="phone" />
                </div>
            </div>

            <h1>Versuche es selbst!</h1>
            <div className="TestImgBox">
                <img src={samplepage} className="TestImg" alt="samplepage" />
            </div>
            <a href="oG2XgdBc">
                <div className="tryBtn">
                    <img src={phoneicon} className="PlayBtn" alt="playbtn" /> <p>Ausprobieren</p>
                </div>
            </a>
        </div>
    );
}

export default StartScreen;