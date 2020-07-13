import React from 'react';
import iphone from '../assets/img/iphone.png';
import playbtn from '../assets/img/playBtn.png';
import phoneicon from '../assets/img/phoneIcon.png';
import samplepage from '../assets/img/samplepage.png';

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
                    <p>BarCov erfasst durch das Scannen des QR-Codes beim Kommen und Gehen die Kontaktdaten Ihrer Kunden und übermittelt diese verschlüsselt an unseren Server. </p>
                    <p>Nach Betriebsende sind alle Gastdaten vom Unternehmensleiter online einsehbar. Auf Wunsch kann außerdem eine Zusammenfassung des Tages heruntergeladen werden.</p>
                </div>
            </div>

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
    );
}

export default StartScreen;