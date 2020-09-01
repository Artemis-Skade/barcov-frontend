import React from 'react';

const StarterPackageCard = (props) => {
    return (
        <div className="SectionRight package-card" >
            <h2>BarCov Komfortpaket</h2>
            <p>Enthält:</p>
            <ul>
                <li>Verlinkung auf Social Media & eigene Website</li>
                <li>Online Speisekarte</li>
                <li>5 hochwertige, laminierte QR-Flyer</li>
                <li>digitale Kontaktdatenerfassung</li>
                <li>24/7 Support</li>
            </ul>
            <hr />

            <div style={{display: "flex",flexDirection: "column" }}>
                <h2>Preise</h2>
                <p>Einrichtungsgebühr: <strong>25€ (zzgl. 16 % MwSt.)</strong></p>
                <p>Monatliche Gebühr:<br />
                    <ul>
                        <li>für Mitglieder des DeHoGa RLP: <strong>10€ (zzgl. 16 % MwSt.)</strong></li>
                        <li>sonst <strong>20€ (zzgl. 16 % MwSt.)</strong></li>
                    </ul>
                </p>
            </div>


        </div>
    );
};


export default StarterPackageCard;
