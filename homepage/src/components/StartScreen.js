import React from 'react';
import iphone from '../assets/img/iphone.png';
import playbtn from '../assets/img/playBtn.png';
import phoneicon from '../assets/img/phoneIcon.png';
import samplepage from '../assets/img/samplepage.jpg';
import phonepreview from '../assets/img/phonepreview.png';

import '../App.css';

function StartScreen () {
    return(
        <div className="SiteWrapper">
            <div className="Wrapper">
                <div className="FirstSection">
                    <div className="Textfield">
                        <h1>Check in, get in</h1>
                        <h2>Verabschieden Sie sich von der Zettelwirtschaft!</h2>
                        <h2><strong>BarCov</strong> – Ihre digitale Software zur Datenspeicherung in der Coronakrise.</h2>
                        <br />
                        <a href="unternehmen">
                            <div className="mainBtn">
                                <img src={playbtn} className="PlayBtn" alt="playbtn" /> <p>Firmeneinrichtung</p>
                            </div>
                        </a>
                    </div>
                    <div className="PhonePreview">
                        <img src={iphone} className="PhonePreviewImg" alt="phone" />
                    </div>
                </div>
            </div>
                
            <div className="Section2">
                <div className="Explanation">
                    <h1>Das ist BarCov</h1>
                    <p><strong>Sie sind Gastronom, Friseur oder Betreiber von Sportstätten?</strong></p>
                    <p>BarCov erfasst durch das Scannen eines QR-Codes beim Kommen und Gehen ganz einfach die Kontaktdaten Ihrer Kunden. </p>
                    <a href="/unternehmen"><img src={playbtn} className="PlayBtn" alt="playbtn" /> &nbsp;&nbsp; Mehr erfahren</a>
                </div>

                <img src={phonepreview} className="phonepreview" alt="phonepreview" />
            </div>

            <div className="Section3">
                <h1>Versuchen Sie es selbst!</h1>
                <div className="TestImgBox">
                    <img src={samplepage} className="TestImg" alt="samplepage" />
                </div>
                <a href="oG2XgdBc">
                    <div className="tryBtn">
                        <img src={phoneicon} className="PlayBtn" alt="playbtn" /> <p>Ausprobieren</p>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default StartScreen;