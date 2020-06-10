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

    const myBitArray = sjcl.hash.sha256.hash(registerData.password1 + ":" + registerData.email.toLowerCase());
    const myHash = String(sjcl.codec.hex.fromBits(myBitArray));

    console.log("PW with salt: " + registerData.password1 + ":" + registerData.email.toLowerCase() +  " Hash: " + myHash);

    // Read out company ID if present
    let pathname = window.location.pathname;
    let company_id = "None";

    if (pathname.length > 12) {
        company_id = pathname.slice(9, 17); 
        console.log("" + company_id);
    }

    getBase64(image.raw, (base64data) => {
        let typeName = "png";

        if (image.raw.type === "image/jpeg" || image.raw.type === "image/jpg") {
            typeName = "jpg";
        }

        // Make base64 string conform
        base64data = base64data.split(',')[1];

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
        if (registerData.cname === "" || registerData.zip === "" || registerData.town === "" || registerData.street === "") {
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

function Page1() {
    return (
        <>
        <h2>Schritt 1: Unternehmensdaten</h2>
        <form>
            <EntryField name="cname" displayname="Name des Unternehmens"/>
            <EntryField name="street" displayname="Straße und Hausnr."/>
            <EntryField name="state" displayname="Bundesland"/>
            <EntryField type="inline1" name="zip" displayname="PLZ"/>
            <EntryField type="inline2" name="town" displayname="Ort"/>

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
    [image, setImage] = React.useState({ preview: "", raw: ""});

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