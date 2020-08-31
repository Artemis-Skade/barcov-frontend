import React, {useEffect} from 'react';
import Cookies from 'universal-cookie';
import closeIcon from '../../assets/img/closeIcon.png';
import personIcon from "../../assets/img/personIcon.png";
import sjcl from 'sjcl';

import "react-datepicker/dist/react-datepicker.css";

import '../../App.css';
import '../../Dashboard.css';
import CompanyList from "./CompanyList";
import EditCompanyModal from "./EditCompanyModal";

let companies, setCompanies;
let pwPopUpOpen, setPwPopUpOpen;
let eMailPopUpOpen, setEMailPopUpOpen;
let image, setImage;
let data, setData;

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



function changePassword() {
    console.log("Sending change password link...");
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
    const [popUpOpen, setPopUpOpen] = React.useState(false);
    [pwPopUpOpen, setPwPopUpOpen] = React.useState(false);
    [eMailPopUpOpen, setEMailPopUpOpen] = React.useState(false);
    [image, setImage] = React.useState({ preview: "", raw: ""});
    [data, setData] = React.useState({data: {fname: "fname", lname: "lname", mobile: "123", mail: "123@123.de", companies: []}});
    const [activeCompany, setActiveCompany] = React.useState(null);

    useEffect(() => {
        if (activeCompany !== null) {
            setPopUpOpen(true)
        } else {
            setPopUpOpen(false)
        }
    }, [activeCompany])


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
            {
                popUpOpen &&
                <EditCompanyModal company={activeCompany} opened={popUpOpen} onSuccess={() => {
                    loadData(cookies.get("sessionKeyCompany"));
                    setActiveCompany(null)
                }} onClose={() => setActiveCompany(null)}/>
            }
            <ChangePwPopUp opened={pwPopUpOpen}/>
            <ChangeEMailPopUp opened={eMailPopUpOpen}/>
            <div className={wrapperStyles}>
                <h1>Guten Tag, <strong>{data.data.fname} {data.data.lname}</strong>!</h1>

                <CompanyList companies={data.data.companies} onEditProperty={setActiveCompany}/>
                <MyData/>

                <br/>
                <br/>

                <p>Kontakt zum Kundensupport (24/7 erreichbar): <strong>06742 8289977</strong></p>

                <br/>
                <br/>
                <br/>
            </div>
        </>
    );
}

export default DashboardScreen;
