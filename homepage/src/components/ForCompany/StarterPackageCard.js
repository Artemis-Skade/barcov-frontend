import React from 'react';

const StarterPackageCard = (props) => {
    return (
        <div className="SectionRight package-card" style={{justifyContent: "flex-end", marginTop: "60px"}}>
            <h2>BarCov Basispaket</h2>
            <p>Enthält:</p>
            <ul>
                <li>5 hochwertige, laminierte QR-Flyer</li>
                <li>digitale Kontaktdatenerfassung</li>
                <li>24/7 Support</li>
            </ul>
            <hr/>
            <div style={{display: "flex",flexDirection: "column" }}>
                <h2>Preise</h2>
                <p>Einrichtungsgebühr: <strong>25€ (zzgl. 16 % MwSt.)</strong></p>
                <p>Monatliche Gebühr:<br />
                    <ul>
                        <li>für Mitglieder des DeHoGa RLP: <strong>kostenlos</strong></li>
                        <li>sonst <strong>10€ (zzgl. 16 % MwSt.)</strong></li>
                    </ul>
                </p>
            </div>


        </div>
    );
};


export default StarterPackageCard;
