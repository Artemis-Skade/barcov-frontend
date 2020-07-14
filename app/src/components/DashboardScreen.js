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
import sjcl from 'sjcl';
 
import "react-datepicker/dist/react-datepicker.css";

import '../App.css';
import '../Dashboard.css';

let companies, setCompanies;
let popUpOpen, setPopUpOpen;
let pwPopUpOpen, setPwPopUpOpen;
let eMailPopUpOpen, setEMailPopUpOpen;
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

    const saveData = () => {
        console.log("Saving personal data...");

        if (data.data.fname === "" || data.data.lname === "" || data.data.mobile === "") {
            alert("Füllen Sie bitte alle Felder aus!");
            return;
        }

        const cookies = new Cookies();

        let toSend = {
            session_key: cookies.get("sessionKeyCompany"),
            fname: data.data.fname,
            lname: data.data.lname,
            phone: data.data.mobile,
        }

        console.log(toSend);
        
        fetch('https://' + window.Vars.domain + ':5000/change_owner_data', {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(toSend)
            }).then(res => res.json()).then(res => {
                // Send other persons
                console.log(res);
                
                let success = res["success"];

                if (success) {
                    alert("Daten der Ansprechperson erfolgreich geändert!");
                } else {
                    alert(res["message"]);
                }
            }).catch(err => {
                console.log(err);
            });
    }

    const changeVal = (event) => {
        console.log("Changed");
        let tmp = Object.assign({}, data);
        tmp.data[event.target.name] = event.target.value;
        setData(tmp);
    }

    return (<div className="Card">
        <img src={personIcon}/><h2>Meine Daten</h2>
        <div className="inputField">
            <p>Vorname</p>
            <input type="text" name="fname" value={data.data.fname} onChange={(e) => changeVal(e)}/>
        </div>
        <div className="inputField">
            <p>Nachname</p>
            <input type="text" name="lname" value={data.data.lname} onChange={(e) => changeVal(e)}/>
        </div>

        <div className="inputField">
            <p>Telefonnummer</p>
            <input type="text" name="mobile" value={data.data.mobile} onChange={(e) => changeVal(e)}/>
        </div>
        
        <div className="links">
            <a onClick={() => setPwPopUpOpen(true)}>Passwort ändern</a> • <a onClick={() => setEMailPopUpOpen(true)}>E-Mail ändern</a>
        </div>

        <div className="button" onClick={saveData}>Speichern</div>
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
            {false && <img src={settingsIcon} className="settingsIcon" onClick={() => {props.setPopUpOpen(true); setActiveCompany(key)}}/>}
            <img src={settingsIcon} className="settingsIcon" onClick={() => alert("Diese Funktion kommt bald!")}/>
        </div>);

        key++;
    }

    return (<div className="Card CompanyCard">
        <img src={storeIcon}/><h2>Meine Betriebe</h2>

        {companyRender}

        <div className="addbutton" onClick={() => alert("Diese Funktion kommt bald!")}><img src={addIconBlack}></img>Betrieb hinzufügen</div>
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
    console.log("Company PopUp Opened: " + props.opened);

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

function ChangePwPopUp(props) {
    let [passwords, setPasswords] = React.useState({old_pw: "", pw_new1: "", pw_new2: ""});

    const changePassword = () => {
        console.log("Sending new passwords...");

        if (passwords.old_pw === "" || passwords.pw_new1 === "" || passwords.pw_new2 === "") {
            alert("Füllen Sie bitte alle Felder aus!");
            return;
        }

        if (passwords.pw_new1 !== passwords.pw_new2) {
            alert("Die Passwörter stimmen nicht überein!");
            return;
        }

        // Convert to hash
        passwords.old_pw = String(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(passwords.old_pw + ":" + data.data.mail.toLowerCase())));
        passwords.pw_new1 = String(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(passwords.pw_new1 + ":" + data.data.mail.toLowerCase())));

        let toSend = {
            mail: data.data.mail,
            old_pw: passwords.old_pw,
            new_pw: passwords.pw_new1,
        }

        setPasswords({old_pw: "", pw_new1: "", pw_new2: ""});

        fetch('https://' + window.Vars.domain + ':5000/change_pw', {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(toSend)
            }).then(res => res.json()).then(res => {
                // Send other persons
                console.log(res);
                console.log("Updated password.");
                
                let success = res["success"];

                if (success) {
                    alert("Passwort erfolgreich geändert!");
                    setPwPopUpOpen(false);
                    window.location.reload();
                } else {
                    alert(res["message"]);
                }
            }).catch(err => {
                console.log(err);
            });
    }

    const changeVal = (event) => {
        let tmp = Object.assign({}, passwords);
        tmp[event.target.name] = event.target.value;
        setPasswords(tmp);
    }

    if (!props.opened) {
        return (<></>);
    }

    return(
        <div className="PwPopUp">
            <img src={closeIcon} className="closeIcon" onClick={() => setPwPopUpOpen(false)}/>
            <h2>Passwort ändern</h2>

            <div className="dataBlock">
                <div className="inputField">
                    <p>Altes Passwort</p>
                    <input type="password" name="old_pw" value={passwords.old_pw} onChange={e => changeVal(e)}/>
                </div>

                <div className="inputField">
                    <p>Neues Passwort</p>
                    <input type="password" name="pw_new1" value={passwords.pw_new1} onChange={e => changeVal(e)}/>
                </div>
                <div className="inputField">
                    <p>Neues Passwort wiederholen</p>
                    <input type="password" name="pw_new2" value={passwords.pw_new2} onChange={e => changeVal(e)}/>
                </div>
            </div>

            <div className="button" onClick={changePassword}>Passwort ändern</div>
        </div>
    );
}

function ChangeEMailPopUp(props) {
    let [mailData, setMailData] = React.useState({mail: "", pw: ""});

    const changeEMail = () => {
        console.log("Sending new eMail...");

        if (mailData.pw === "" || mailData.mail === "") {
            alert("Füllen Sie bitte alle Felder aus!");
            return;
        }

        // Convert to hash
        let pwhash_old = String(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(mailData.pw + ":" + data.data.mail.toLowerCase())));
        let pwhash_new = String(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(mailData.pw + ":" + mailData.mail.toLowerCase())));

        let toSend = {
            old_mail: data.data.mail,
            new_mail: mailData.mail,
            old_pw: pwhash_old,
            new_pw: pwhash_new,
        }

        setMailData({mail: "", pw: ""});

        fetch('https://' + window.Vars.domain + ':5000/change_mail', {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(toSend)
            }).then(res => res.json()).then(res => {
                // Send other persons
                console.log(res);
                console.log("Updated password.");
                
                let success = res["success"];

                if (success) {
                    alert("E-Mail erfolgreich geändert!");
                    setPwPopUpOpen(false);
                    window.location.reload();
                } else {
                    alert(res["message"]);
                }
            }).catch(err => {
                console.log(err);
            });
    }

    const changeVal = (event) => {
        let tmp = Object.assign({}, mailData);
        tmp[event.target.name] = event.target.value;
        setMailData(tmp);
    }

    if (!props.opened) {
        return (<></>);
    }

    return(
        <div className="PwPopUp">
            <img src={closeIcon} className="closeIcon" onClick={() => setEMailPopUpOpen(false)}/>
            <h2>E-Mail ändern</h2>

            <div className="dataBlock">
                <div className="inputField">
                    <p>Neue E-Mail Adresse</p>
                    <input type="email" name="mail" value={mailData.mail} onChange={e => changeVal(e)}/>
                </div>

                <div className="inputField">
                    <p>Passwort (zur Bestätigung)</p>
                    <input type="password" name="pw" value={mailData.pw} onChange={e => changeVal(e)}/>
                </div>
            </div>

            <div className="button" onClick={changeEMail}>E-Mail ändern</div>
        </div>
    );
}

function DashboardScreen () {
    const cookies = new Cookies();
    [companies, setCompanies] = React.useState([]);
    [popUpOpen, setPopUpOpen] = React.useState(false);
    [pwPopUpOpen, setPwPopUpOpen] = React.useState(false);
    [eMailPopUpOpen, setEMailPopUpOpen] = React.useState(false);
    [image, setImage] = React.useState({ preview: "", raw: ""});
    [data, setData] = React.useState({data: {fname: "fname", lname: "lname", mobile: "123", mail: "123@123.de", companies: []}});
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
        <ChangePwPopUp opened={pwPopUpOpen}/>
        <ChangeEMailPopUp opened={eMailPopUpOpen}/>
        <div className={wrapperStyles}>
            <h1>Guten Tag, <strong>{data.data.fname} {data.data.lname}</strong>!</h1>

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