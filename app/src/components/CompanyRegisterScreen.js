import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';

import '../App.css';
import '../Company.css';


let registerData, setRegisterData;
let pagenr, setPagenr;
let errmsg, setErrmsg;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newRegisterData = registerData;
    newRegisterData[name] = event.target.value;
    setRegisterData(newRegisterData);
}

function handleRegisterSubmit(formData) {
    const cookies = new Cookies();
    // Handle wrong inputs
    if (registerData.password1 !== registerData.password2) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    console.log("Submitted Company Register");
    window.Vars.setScreen("registrationcompanysuccess");

    const myBitArray = sjcl.hash.sha256.hash(registerData.password1 + ":" + registerData.email);
    const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

    console.log("PW with salt: " + registerData.password1 + ":" + registerData.email +  " Hash: " + myHash);

    let data = {
        name: registerData.cname,
        plz: registerData.zip,
        ort: registerData.town,
        strasse: registerData.street,
        vorname: registerData.fname,
        nachname: registerData.lname,
        telefon: registerData.mobile,
        mail: registerData.email,
        passwort: myHash,
    };

    Object.assign(data, formData);
    console.log(data);

    fetch('https://barcov.id:5000/company_register', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log("Registered company:");
        console.log(res);

        // Check if registration was successful
        if (res["success"]) {
            window.Vars.setScreen("registrationcompanysuccess");
        } else {
            alert(res["message"]);
        }
    }).catch(err => console.log(err));
}

function EntryField (props){
    let className = "EntryField";
    let type = "text";
    if (props.type === "inline1") { className += " InlineField1"; type="number" }
    if (props.type === "inline2") className += " InlineField2";

    return (
        <div className={className}>
            <p>{props.displayname}</p>
            <input
                type={type}
                name={props.name}
                onChange={e => handleFieldChange(props.name, e)}
            />
        </div>
    );
}

function handlePageSubmit() {
    setErrmsg("");

    // Check if all fields are filled out
    if (pagenr === 0) {
        if (registerData.cname === "" || registerData.zip === "" || registerData.town === "" || registerData.street === "") {
            // Not completed
            setErrmsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }
    }

    if (pagenr === 1) {
        if (registerData.fname === "" || registerData.lname === "" || registerData.mobile === "") {
            // Not completed
            setErrmsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }
    }

    if (pagenr === 2) {
        if (registerData.email === "" || registerData.password1 === "" || registerData.password2 === "") {
            // Not completed
            setErrmsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }
    }

    // Proceed to next page
    if (pagenr <= 1) {
        setPagenr(pagenr + 1);
    } else {
        handleRegisterSubmit(registerData);
    }

}

function Page1() {
    return (
        <>
        <h2>Schritt 1: Unternehmensdaten</h2>
        <form>
            <EntryField name="cname" displayname="Name des Unternehens"/>
            <EntryField name="street" displayname="Straße und Hausnr."/>
            <EntryField type="inline1" name="zip" displayname="PLZ"/>
            <EntryField type="inline2" name="town" displayname="Ort"/>

            <p className="ErrorMsgOffset ErrorMsg">{errmsg}</p>

            <div className="EntrySubmit SubmitCompany">
                <input className="EntrySubmitBtn EntrySubmitBtnCompany" type='button' value="Weiter" onClick={handlePageSubmit}/>
            </div>
        </form>
        </>
    );
}

function Page2() {
    return (
        <>
        <h2>Schritt 2: Angaben zum Ansprechpartner</h2>
        <form>
            <EntryField name="fname" displayname="Vorname"/>
            <EntryField name="lname" displayname="Nachname"/>
            <EntryField name="mobile" displayname="Telefonnummer"/>

            <p className="ErrorMsg">{errmsg}</p>

            <div className="EntrySubmit SubmitCompany">
                <input className="EntrySubmitBtn EntrySubmitBtnCompany" type='button' value="Weiter" onClick={handlePageSubmit}/>
            </div>
        </form>
        </>
    );
}

function Page3() {
    return (
        <>
        <h2>Schritt 3: Benutzerkonto</h2>
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
                        name="password1"
                        onChange={e => handleFieldChange("password1", e)}
                    />
                </div>
                <div className="EntryField">
                    <p>Passwort wiederholen</p>
                    <input
                        type="password"
                        name="password2"
                        onChange={e => handleFieldChange("password2", e)}
                    />
                </div>

                <p className="ErrorMsg">{errmsg}</p>

                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn EntrySubmitBtnCompany" type='button' value="Unternehmen registrieren" onClick={handlePageSubmit}/>
                </div>
            </form>
        </>
    );
}

function CompanyRegisterScreen (props) {
    [registerData, setRegisterData] = React.useState({
        cname: "",
        zip: "",
        town: "",
        street: "",
        fname: "",
        lname: "",
        mobile: "",
        email: "",
        password1: "",
        password2: "",
    });

    [pagenr, setPagenr] = React.useState(0);
    [errmsg, setErrmsg] = React.useState("");

    return(
        <div className="EntryForm">
            <h1>Unternehmensregistrierung</h1>
            {pagenr === 0 && Page1()}
            {pagenr === 1 && Page2()}
            {pagenr === 2 && Page3()}
        </div>
    );
}

export default CompanyRegisterScreen;