import React from 'react';
import Cookies from 'universal-cookie';
import settingsIcon from '../assets/img/settings.png';
import settingsIconBlack from '../assets/img/settingsIconBlack.png';
import Pencilimg from '../assets/img/pencil.png';
import addIconBlack from '../assets/img/addIconBlack.png';
import logobarcov from '../assets/img/logo.png';
import listIcon from '../assets/img/listIcon.png';
import closeIcon from '../assets/img/closeIcon.png';
import torrilogo from '../assets/img/torrilogo.jpeg';
import emilslogo from '../assets/img/emilslogo.png';
import flyerpreview from "../assets/img/flyertemplate.png";
import personIcon from "../assets/img/personIcon.png";
import storeIcon from "../assets/img/storeIcon.png";

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

import '../App.css';
import '../Dashboard.css';

let companies, setCompanies;
let popUpOpen, setPopUpOpen;
let image, setImage;
let data, setData;
let activeCompany, setActiveCompany;

function logout() {
    const cookies = new Cookies();
    cookies.remove("sessionKeyCompany");
}

function checkLogin(callback) {
    let cookies = new Cookies();
    console.log("Checking session key...");

    let data = {
        session_key: cookies.get("sessionKeyCompany"),
    }

    fetch('https://' + window.Vars.domain + ':5000/company_checklogin', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
        callback(res);
    }).catch(err => console.log(err));
}

function loadData(sessKey) {
    console.log({
        session_key: sessKey
    });
    // Fetch dashboard data
    fetch('https://' + window.Vars.domain + ':5000/dashboard_summary', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify({
            session_key: sessKey
        })
    }).then(res => res.json()).then(res => {
        console.log(res);
        setData(res);
    }).catch(err => {console.log(err)});
}

function MyData() {
    return (<div className="Card">
        <img src={personIcon}/><h2>Meine Daten</h2>
        <div className="inputField">
            <p>Vorname</p>
            <input type="text" value={data.data.fname}/>
        </div>
        <div className="inputField">
            <p>Nachname</p>
            <input type="text" value={data.data.lname}/>
        </div>

        <div className="inputField">
            <p>Telefonnummer</p>
            <input type="text" value={data.data.mobile}/>
        </div>

        <a onClick={changePassword}>Passwort ändern</a>

        <div className="button">Speichern</div>
    </div>
        );
}

function MyCompanies(props) {
    let companyRender = [];
    let key = 0;

    for (let company of data.data.companies) {
        let logo = "";

        if (key === 1) {
            logo = emilslogo;
        } else {
            logo = torrilogo;
        }

        companyRender.push(<div className="company" key={key}>
            <img src={"https://" + window.Vars.domain + ":5000/dashboard_icon?id=" + company.id} className="companyLogo"/>
            <p>{company.name}</p>
            <a href={"/data/" + company.id}>
                <div className="dataBtn">
                    <img src={listIcon} className="listIcon"/>
                    <p>Gästeliste</p>
                </div>
            </a>
            <img src={settingsIcon} className="settingsIcon" onClick={() => {props.setPopUpOpen(true); setActiveCompany(key)}}/>
        </div>);

        key++;
    }

    return (<div className="Card CompanyCard">
        <img src={storeIcon}/><h2>Meine Betriebe</h2>

        {companyRender}

        <div className="addbutton"><img src={addIconBlack}></img>Betrieb hinzufügen</div>
    </div>
        );
}

function changePassword() {
    console.log("Sending change password link...");
}

function handleChange(e) {
    if (e.target.files.length) {
        if(e.target.files[0].size > 5242880){
            alert("Die Logo-Datei ist größer als 5 MB. Bitte lade eine kleinere Datei hoch.");
            return;
        }
        console.log("Uploaded image");
        console.log(e.target.files[0]);
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
        });
    }
}

function CompanyPopUp(props) {
    let classNames = "CompanyPopUp";
    console.log("Opened: " + props.opened);

    if (!props.opened) {
        classNames += " CompanyPopUpClosed";
    }

    let companyData = data.data.companies[activeCompany];

    if (!popUpOpen) {
        return (<></>);
    }

    return (<div className={classNames}>
        <img src={closeIcon} className="closeIcon" onClick={() => setPopUpOpen(false)}/>
        <h2>Betrieb bearbeiten</h2>

        <div className="dataBlock">
            <h3>Unternehmensadresse</h3>

            <div className="inputField">
                <p>Kurzname des Betriebs</p>
                <input type="text" value={companyData.name}/>
            </div>

            <div className="inputField">
                <p>Straße und Hausnnr.</p>
                <input type="text" value={companyData.street}/>
            </div>
            <div className="inputField">
                <p>PLZ</p>
                <input type="text" value={companyData.zip}/>
            </div>
            <div className="inputField">
                <p>Ort</p>
                <input type="text" value={companyData.town}/>
            </div>
        </div>

        <div className="dataBlock">
            <h3>Rechnungsadresse</h3>

            <div className="inputField">
                <p>Rechtlicher Name des Betriebs</p>
                <input type="text" value={companyData.rname}/>
            </div>
            <div className="inputField">
                <p>Straße und Hausnnr.</p>
                <input type="text" value={companyData.rstreet}/>
            </div>
            <div className="inputField">
                <p>PLZ</p>
                <input type="text" value={companyData.rzip}/>
            </div>
            <div className="inputField">
                <p>Ort</p>
                <input type="text" value={companyData.rtown}/>
            </div>
        </div>

        <div className="dataBlock">
            <h3>Zusätzliches</h3>

            <div className="inputField">
                <p>Link zu Speisekarte</p>
                <input type="text" value={companyData.menu_link}/>
            </div>
            <div className="inputField">
                <p>Link zu Instagram</p>
                <input type="text" value={companyData.instagram}/>
            </div>
        </div>

        <div className="dataBlock">
            <h3>Firmenlogo</h3>

            <div className="FileUpload FileUploadChange">
                <div className="BigButton">
                    <input
                        type="file"
                        className="UploadBtn"
                        accept="image/x-png,image/png,image/jpeg,image/jpg"
                        onChange={handleChange}
                        for="files"
                    />
                    <p>Logo hochladen</p>
                </div>

                <div className="BigButtonDownload" onClick={() => alert("Kommt bald!")}>
                    <p>Flyer herunterladen</p>
                </div>

                <div className="UploadPreview">
                    <img src={flyerpreview}/>
                    <img src={image.preview} className="Logoimgcenter"/>
                    <img src={image.preview} className="Logoimgcorner"/>
                </div>
                <p className="previewText">Flyer-Vorschau</p>
            </div>
        </div>


        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="button">Speichern</div>
    </div>);
}

function DashboardScreen () {
    const cookies = new Cookies();
    [companies, setCompanies] = React.useState([]);
    [popUpOpen, setPopUpOpen] = React.useState(false);
    [image, setImage] = React.useState({ preview: "", raw: ""});
    [data, setData] = React.useState({data: {fname: "fname", lname: "lname", mobile: "123", companies: []}});
    [activeCompany, setActiveCompany] = React.useState(0);

    React.useEffect(() => {
        let testCompanies = [{name: "Torri Eiscafe"}, {name: "Emil's Cafe"}];
        setCompanies(testCompanies);

        // Check if session key exists / is valid
        if (cookies.get("sessionKeyCompany") != undefined && cookies.get("sessionKeyCompany").length > 32) {
            // Check login
            checkLogin((data) => {
                if (data["auth"]) {
                    // Load dashboard data
                    loadData(cookies.get("sessionKeyCompany"));
                } else {
                    // Go to login screen
                    window.Vars.setScreen("logincompany");
                }
            });
        } else {
            // Go to login screen
            window.Vars.setScreen("logincompany");
        }
    }, []);

    let wrapperStyles = "Wrapper";

    if (popUpOpen) {
        wrapperStyles += " WrapperBlurred";
    }

    return (
        <>
        <CompanyPopUp opened={popUpOpen}/>
        <div className={wrapperStyles}>
            <h1>Guten Tag, <strong>{"Max Mustermann"}</strong>!</h1>

            <MyCompanies setPopUpOpen={setPopUpOpen}/>
            
            <MyData />

            <br />
            <br />

            <p>Kontakt zum Kundensupport (24/7 erreichbar): <strong>06742 8289977</strong></p>

            <br />
            <br />
            <br />
        </div>
        </>
    );
}

export default DashboardScreen;