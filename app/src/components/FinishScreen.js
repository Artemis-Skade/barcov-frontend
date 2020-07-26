import React from 'react';
import sound from "../assets/sounds/ding.mp3";
import addIcon from '../assets/img/addIcon.png';
import checkPersonIcon from '../assets/img/checkpersonIcon.png';
import Cookies from 'universal-cookie';

import instagram_icon from '../assets/img/instagram_icon.png';
import facebook_icon from '../assets/img/facebook_icon.png';
import website_icon from '../assets/img/website_icon.png';

import '../App.css';
import '../Success.css';
import './FinishScreen.css';

function OptionBox (props) {
    if (!props.enabled) {
        return (<></>);
    }

    return (
        <div className="OptionBox" onClick={props.action}>
            <p>{props.name}</p>
        </div>
    )
}

function FinishScreen (props) {
    const openPopUp = () => {alert("Teagesanbeot")};
    const [companyInfo, setCompanyInfo] = React.useState("not-fetched");
    let pathname = window.location.pathname.slice(1);
    let storeid = pathname.split("/")[0];

    React.useEffect(() => {
        fetch('https://' + window.Vars.domain + ':5000/get_company_info', {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({id: storeid})
        }).then(res => res.json()).then(res => {
            if (res["success"]) {
                setCompanyInfo(res);
            } else {
                console.log(res["message"]);
            }
        }).catch(err => {
            console.log(err);
        });
    });

    return (
        <div className="EntryForm">
            <audio autoPlay src={sound} type="audio/wav"/>
            <div className="success-checkmark">
                <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                </div>
            </div>
            <h1 style={{textAlign: "center"}}>{"Du wurdest erfolgreich eingetragen."}</h1>

            <br />

            {companyInfo !== "not-fetched" && 
                <>
                    <OptionBox enabled={true} name="Tagesangebot" action={() => openPopUp()}/>
                    <OptionBox enabled={true} name="Speisekarte" action={() => window.location = "menu/" + storeid}/>

                    <br />
                    <br />
                    <h2>Folgt uns auch auf Social Media!</h2>
                    <br />
                    <div className="SocialMediaWrapper">
                        <div className="SocialMediaOption" onClick={() => window.location = "https://instagram.com/" + companyInfo.social_media.instagram}>
                            <img src={instagram_icon} className="socialIcon" alt="img"/>
                            <p>@ {companyInfo.social_media.instagram}</p>
                        </div>
                        <div className="SocialMediaOption" onClick={() => window.location = companyInfo.social_media.facebook}>
                            <img src={facebook_icon} className="socialIcon" alt="img"/>
                            <p>@ {window.Vars.storename}</p>
                        </div>
                        <div className="SocialMediaOption" onClick={() => window.location = companyInfo.website}>
                            <img src={website_icon} className="socialIcon" alt="img"/>
                            <p>Website von {window.Vars.storename}</p>
                        </div>
                    </div>
                </>
            }

            {companyInfo === "not-fetched" && 
                <>
                    <p>Social Media wird geladen...</p>
                </>
            }
        </div>
    );
}

export default FinishScreen;