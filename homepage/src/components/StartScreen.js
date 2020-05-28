import React from 'react';
import iphone from '../assets/img/iphone.png';
import playbtn from '../assets/img/playBtn.png';
import samplepage from '../assets/img/samplepage.png';

import '../App.css';

function StartScreen () {
    return(
        <div className="Wrapper">
            <div className="FirstSection">
                <div className="Textfield">
                    <h1>Check in, get in</h1>
                    <h2>Trage dich ganz einfach mit BarCov bei allen unterstützten Restaurants und Frisören ein!</h2>
                    <h2>Schnell, einfach, gegen Corona!</h2>

                    <a href="unternehmen">
                        <div className="mainBtn">
                            <img src={playbtn} className="PlayBtn" alt="playbtn" /> <p>Einführung für Ihre Firma</p>
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
        </div>
    );
}

export default StartScreen;