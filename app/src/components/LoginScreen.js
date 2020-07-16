import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';

import TableSelector from './TableSelector';

import '../App.css';


let loginData, setLoginData;
let errMsg, setErrMsg;
let tableNumSelOpen, setTableNumSelOpen;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newLoginData = loginData;
    newLoginData[name] = event.target.value;
    setLoginData(newLoginData);
}

function login(email, password, tableNum) {
    return new Promise((resolve, reject) => {
        // Generate hash
        const myBitArray = sjcl.hash.sha256.hash(password + ":" + email);
        const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

        let data = {
            storeid: window.Vars.store_id,
            email: loginData.email,
            pw_hash: myHash,
            table: tableNum,
        };

        fetch('https://' + window.Vars.domain + ':5000/login', {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            console.log(res);

            if (res["auth"]) {
                // Read in session key
                //cookies.set('sessionKey', res["session_key"]);
                //window.Vars.setScreen("confirmation");
                resolve([true, res["session_key"], res["id"]]);
            } else {
                //alert("Falsche E-Mail oder Passwort!");
                //setErrMsg(res["message"]);
                resolve([false, res["message"], res["id"]]);
            }
            
        }).catch(err => console.log(err));
    })
}

function handleLoginSubmit(setScanId, tableNum) {
    const cookies = new Cookies();
    console.log("Submitted Login");

    if (loginData.email === "" || loginData.password === "") {
        setErrMsg("Es müssen alle Felder ausgefüllt sein!");
        return;
    }

    if (tableNum === "not-defined") {
        setErrMsg("Wähle zuerst einen Tisch aus!");
        return;
    }

    login(loginData.email.toLowerCase(), loginData.password, tableNum).then((ret) => {
        if (!ret[0]) {
            if (ret[1].charAt(0) === "B") {
                setErrMsg(ret[1]);
            } else {
                // Try again with upper case EMail as hash
                login(loginData.email.charAt(0).toUpperCase() + loginData.email.slice(1), loginData.password, tableNum).then((ret_) => {
                    if (!ret_[0]) {
                        // Wrong login!!
                        setErrMsg(ret_[1]);
                    } else {
                        // Successful
                        cookies.set('sessionKey', ret_[1], {path: "/", secure: true});
                        window.Vars.setScreen("confirmation");
                        setScanId(ret_[2]);
                    }
                });
            }
        } else {
            // Successful
            cookies.set('sessionKey', ret[1], {path: "/", secure: true});
            window.Vars.setScreen("confirmation");
            setScanId(ret[2]);
        }
    })
}

function LoginScreen (props) {
    [loginData, setLoginData] = React.useState({
        email: "",
        password: "",
    });
    [errMsg, setErrMsg] = React.useState("");
    [tableNumSelOpen, setTableNumSelOpen] = React.useState(false);
    let [URLtablePresent, setURLtablePresent] = React.useState(false);

    React.useEffect(() => {
        // Read table number
        let pathname = window.location.pathname.slice(1);
        let pathparts = pathname.split("/");

        console.log(pathparts);
        console.log(props.tables);
        if (pathparts.length >= 2 && pathparts[1].length > 0) {
            console.log("Set tableNum to: " + pathparts[1]);
            props.setTableNum(pathparts[1]);
            setURLtablePresent(true);
        }

        if (props.tables === null) {
            props.setTableNum("None");
            console.log("No table number needed");
        }
    }, [props.tables]);

    return(
        <div className="EntryForm">
            <h1>Anmelden</h1>

            {!URLtablePresent && <TableSelector tables={props.tables} opened={tableNumSelOpen} setOpened={setTableNumSelOpen} setTableNum={props.setTableNum}/>}

            <form>
                <div className="EntryField">
                    <p>E-Mail Adresse</p>
                    <input
                        type="text"
                        name="email"
                        onChange={e => handleFieldChange("email", e)}
                    />
                </div>
                <div className="EntryField">
                    <p>Passwort</p>
                    <input
                        type="password"
                        name="password"
                        onChange={e => handleFieldChange("password", e)}
                    />
                </div>

                <p className="Errormsg">{errMsg}</p>

                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn" type='button' value="Anmelden" onClick={() => {handleLoginSubmit(props.setScanId, props.tableNum);}}/>
                </div>

                <p>Noch nicht registriert? Erstellen sie sich <a href="/gaeste">hier</a> ein Benutzerkonto!</p>
                <br />
            </form>
        </div>
    );
}

export default LoginScreen;