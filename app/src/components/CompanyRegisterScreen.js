import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';
import flyerpreview from "../assets/img/flyertemplate.png";

import '../App.css';
import '../Company.css';


let registerData, setRegisterData;
let pagenr, setPagenr;
let errmsg, setErrmsg;
let image, setImage;
let otherAddress, setOtherAddress;
let setPrivacyConfirmed, privacyConfirmed;
let setAgbConfirmed, agbConfirmed;
let submitted, setSubmitted;
let prices, setPrices;
let count, setCount;

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newRegisterData = registerData;
    newRegisterData[name] = event.target.value;
    setRegisterData(newRegisterData);

    if (name === "count") {
        // Update price
        console.log("Updated price");
        let tmp = prices;
        let count_ = parseInt(event.target.value);
        setCount(count_);
        if (count_ > 5) {
            tmp[0] = 19.9 + count_ * 1.5;
        }
        setPrices(tmp);
    }
}

function handleRegisterSubmit(formData) {
    const cookies = new Cookies();
    // Handle wrong inputs
    if (registerData.password1 !== registerData.password2) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    if (!privacyConfirmed || !agbConfirmed) {
        alert("Bestätigen Sie zuerst die AGBs und Datenschutzerklärung");
        return;
    }

    if (submitted) {
        // Already submitted
        console.log("Already submitted");
        return;
    }

    console.log("Submitted Company Register");
    setSubmitted(true);

    const myBitArray = sjcl.hash.sha256.hash(registerData.password1 + ":" + registerData.email.toLowerCase());
    const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

    console.log("PW with salt: " + registerData.password1 + ":" + registerData.email.toLowerCase() +  " Hash: " + myHash);

    // Read out company ID if present
    let pathname = window.location.pathname;
    console.log("pathname: " + pathname);
    let company_id = "None";
    let discount_code = "None";
    let test_code = "None";

    let codes = pathname.split("/");

    for (let code of codes) {
        if (code.length === 8) {
            company_id = code;
        } else if (code.length === 10) {
            discount_code = code;
        } else if (code.length === 12) {
            test_code = code;
        }
    }

    console.log("Company ID: " + company_id);
    console.log("Discount Code: " + discount_code);
    console.log("Test Code: " + test_code);

    getBase64(image.raw, (base64data) => {
        let typeName = "png";

        if (image.raw.type === "image/jpeg" || image.raw.type === "image/jpg") {
            typeName = "jpg";
        }

        // Make base64 string conform
        base64data = base64data.split(',')[1];

        let A4_count = count;
        let A5_count = 0;

        let data = {
            name: registerData.cname,
            zip: registerData.zip,
            town: registerData.town,
            street: registerData.street,
            state: "RLP",
            fname: registerData.fname,
            lname: registerData.lname,
            mobile: registerData.mobile,
            email: registerData.email,
            passwort: myHash,
            id: company_id,
            logo: base64data,
            image_type: typeName,
            discount: discount_code,
            trial: test_code,
            rname: registerData.rcname,
            rzip: registerData.rzip,
            rtown: registerData.rtown,
            rstreet: registerData.rstreet,
            A4_count: A4_count,
            A5_count: A5_count,
        };
    
        //Object.assign(data, formData);
        console.log(data);
    
        fetch('https://' + window.Vars.domain + ':5000/company_register', {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            console.log("Registering company:");
            console.log(res);
            setSubmitted(false);
            
            // Check if registration was successful
            if (res["success"]) {
                window.Vars.setScreen("registrationcompanysuccess");
            } else {
                alert(res["message"]);
            }
        }).catch(err => console.log(err));
    });
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
        if ((registerData.cname === "" || registerData.rcname === "" || registerData.zip === "" || registerData.town === "" || registerData.street === "") || (otherAddress && (registerData.rzip === "" || registerData.rtown === "" || registerData.rstreet === ""))) {
            // Not completed
            setErrmsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }
        if (image.raw === ""){
            // No logo
            setErrmsg("Es wurde noch kein Logo hochgeladen!");
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

function handleChange(e) {
    if (e.target.files.length) {
        console.log("Uploaded image");
        console.log(e.target.files[0]);
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
        });
    }
}

function getBase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      callback(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

function FileUpload() {
    let style = () => {if (image.raw === "") { return {display: "none"} } else { return {display: "block"} }};
    let btnStyle = () => {if (image.raw === "") { return {margin: 0} } else { return {} }};

    return (
        <div className="FileUpload">
            <h1>Firmenlogo hochladen</h1>
            <input
                type="file"
                className="UploadBtn"
                accept="image/x-png,image/jpeg,image/jpg"
                onChange={handleChange}
                style={btnStyle()}
                for="files"
            />
            <p>Logo hochladen</p>
            <div className="UploadPreview" style={style()}>
                <img src={flyerpreview}/>
                <img src={image.preview} className="Logoimgcenter"/>
                <img src={image.preview} className="Logoimgcorner"/>
            </div>
            <p className="previewText" style={style()}>Flyer-Vorschau</p>
        </div>
    );
}

function toggleCheckbox(name) {

    if (name === "raddress") {
        setOtherAddress(!otherAddress);

        if (otherAddress) {
            // Clear data
            let tmp = registerData;
            tmp.rzip = "";
            tmp.rtown = "";
            tmp.rstreet = "";
        }
    } else if (name === "agb") {
        setAgbConfirmed(!agbConfirmed);
    } else {
        setPrivacyConfirmed(!privacyConfirmed);
    }
}

function Page1() {
    return (
        <>
        <h2>Schritt 1: Unternehmensdaten</h2>
        <form>
            <EntryField name="cname" displayname="Kurzname des Betriebs"/>
            <EntryField name="rcname" displayname="Rechtlicher Name des Betriebs"/>
            <EntryField name="street" displayname="Straße und Hausnr."/>
            <EntryField type="inline1" name="zip" displayname="PLZ"/>
            <EntryField type="inline2" name="town" displayname="Ort"/>

            <div className="CheckboxWrapper CheckboxWrapper2">
                <input type="checkbox" id="otheraddress" className="Checkbox_" value={otherAddress} checked={otherAddress} onClick={() => toggleCheckbox("raddress")}/> <p className="CheckboxText_">Abweichende Rechnungsadresse</p>
            </div>

            {otherAddress && <div className="rechnungsAdresse">
                <EntryField name="rstreet" displayname="Straße und Hausnr."/>
                <EntryField type="inline1" name="rzip" displayname="PLZ"/>
                <EntryField type="inline2" name="rtown" displayname="Ort"/>
            </div>}

            <FileUpload />

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

function Page3(disabled, prices) {
    console.log("Reloading page");

    let style = "EntrySubmitBtn EntrySubmitBtnCompany";

    if (disabled) {
        style += " EntrySubmitBtnDeactivated";
    }

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

                <div className="EntryField SmallField">
                    <p>Wieviele Auslegeblätter sollen wir ihnen zuschicken? (5 inklusive)</p>
                    <input
                        type="number"
                        name="count"
                        value={count}
                        onChange={e => handleFieldChange("count", e)}
                    />
                </div>

                <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3">
                    <input type="checkbox" id="agb" className="Checkbox_" value={agbConfirmed} checked={agbConfirmed} onClick={() => toggleCheckbox("agb")}/> <p className="CheckboxText_">Ich habe die <a href="/agb"><strong>Allgemeinen Geschäftsbedingungen</strong></a> gelesen und stimme zu.</p>
                </div>

                <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3 CheckboxWrapper4">
                    <input type="checkbox" id="privacy" className="Checkbox_" value={privacyConfirmed} checked={privacyConfirmed} onClick={() => toggleCheckbox("privacy")}/> <p className="CheckboxText_">Ich habe die <a href="/privacy"><strong>Datenschutzerklärung</strong></a> gelesen und stimme zu.</p>
                </div>

                <div className="price">
                    <h3>Entstehende Kosten:</h3>
                    <p>Einrichtungsgebühr: <strong>{prices[0].toFixed(2).replace(".", ",")} €</strong></p>
                    <p>Monatliche Kosten: <strong>9,90 €</strong></p>
                    <br />
                    <p>Erster Rechnungsbetrag: <strong>{(prices[0] * 1.19).toFixed(2)} € (inkl. MwSt)</strong></p>
                </div>

                <p className="ErrorMsg">{errmsg}</p>

                <div className="EntrySubmit">
                    <input className={style} type='button' value="Kaufen" onClick={handlePageSubmit}/>
                </div>
            </form>
        </>
    );
}

function CompanyRegisterScreen (props) {
    [registerData, setRegisterData] = React.useState({
        cname: "",
        rcname: "",
        zip: "",
        town: "",
        street: "",
        rzip: "",
        rtown: "",
        rstreet: "",
        fname: "",
        lname: "",
        mobile: "",
        email: "",
        password1: "",
        password2: "",
    });

    [pagenr, setPagenr] = React.useState(0);
    [errmsg, setErrmsg] = React.useState("");
    [image, setImage] = React.useState({ preview: "", raw: ""});
    [otherAddress, setOtherAddress] = React.useState(false);
    [submitted, setSubmitted] = React.useState(false);
    [agbConfirmed, setAgbConfirmed] = React.useState(false);
    [privacyConfirmed, setPrivacyConfirmed] = React.useState(false);
    [prices, setPrices] = React.useState([19.9, 9.9]);
    [count, setCount] = React.useState(5);

    return(
        <div className="EntryForm">
            <h1>Unternehmensregistrierung</h1>
            {pagenr === 0 && Page1()}
            {pagenr === 1 && Page2()}
            {pagenr === 2 && Page3(submitted, prices)}
        </div>
    );
}

export default CompanyRegisterScreen;