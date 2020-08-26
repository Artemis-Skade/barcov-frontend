import React from 'react';
import sjcl from 'sjcl';
import Cookies from 'universal-cookie';
import flyerpreview from "../assets/img/flyertemplate.png";
import option1 from '../assets/img/option1.png';
import option2 from '../assets/img/option2.png';
import option3 from '../assets/img/option3.png';

import '../App.css';
import '../Company.css';

let registerData, setRegisterData;
let pagenr, setPagenr;
let errmsg, setErrmsg;
let image, setImage;
let otherAddress, setOtherAddress;
let tableNumbers, setTableNumbers;
let setPrivacyConfirmed, privacyConfirmed;
let setAgbConfirmed, agbConfirmed;
let selPackage, setSelPackage;
let submitted, setSubmitted;
let count, setCount;
let refPoint;
let selAcquisition, setSelAcquisition;
let useSEPA, setUseSEPA;

function acquisitionText(num) {
    switch (num) {
        case 0:
            return "In einem Lokal gesehen";
        case 1:
            return "Durch einen anderen Gastronom";
        case 2:
            return "Durch einen Freund";
        case 3:
            return "Medienauftritt (Fernsehen, Radio oder Blog)";
        case 4:
            return "Social Media (Instagram, Facebook)";
        case 5:
            return "Suche bei Google";
        case 6:
            return registerData.otherAcquisition;
    }
}

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newRegisterData = registerData;
    newRegisterData[name] = event.target.value;
    setRegisterData(newRegisterData);
}

function handleRegisterSubmit(formData) {
    const cookies = new Cookies();

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

        if (registerData.rzip === "" || registerData.rzip === "None") {
            registerData.rzip = registerData.zip;
            registerData.rtown = registerData.town;
            registerData.rstreet = registerData.street;
        }

        let old_data = {
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

        let tables = [];

        if (selPackage === 2) {
            for (let i = 0; i < count; i++) {
                tables.push({name: String(i + 1)});
            }
        }

        let tables_count = count;
        let sepa = {
            account_holder: registerData.fname + " " + registerData.lname,
            iban: registerData.sepa_iban,
            bic: registerData.sepa_bic,
        };

        if (selPackage === 0) {
            tables_count = 0;
        }

        if (!useSEPA) {
            sepa = "None";
        }

        let company = {
            name: registerData.cname,
            zip: registerData.zip,
            town: registerData.town,
            street: registerData.street,
            state: "RLP",
            logo: base64data,
            image_type: typeName,
            rname: registerData.rcname,
            rtown: registerData.rtown,
            rstreet: registerData.rstreet,
            rzip: registerData.rzip,
            sepa: sepa,
            tables: tables,
            print_tables: false,
            id: company_id,
            A5_count: 5 + Number(tables_count),
        }

        let data = {
            fname: registerData.fname,
            lname: registerData.lname,
            mobile: registerData.mobile,
            email: registerData.email,
            discount: discount_code,
            trial: test_code,
            pw_hash: myHash,
            companies: [company],
            acquisition: acquisitionText(selAcquisition)
        };
        
        fetch('https://' + window.Vars.domain + ':5000/new_company_register', {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
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

function fieldIsEmpty(fieldname) {
    let value = registerData[fieldname];
    return (value === "" || value === null || value === undefined);
}

function handlePageSubmit() {
    setErrmsg("");

    // Check if all fields are filled out
    if (pagenr === 0) {
        if (registerData.fname === "" || registerData.lname === "" || registerData.mobile === "") {
            // Not completed
            setErrmsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }
    }

    if (pagenr === 1) {
        console.log("Count: " + count);
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
        if (selPackage !== 0 && (count === null || count === undefined || count === "" || count < 0)) {
            setErrmsg("Bitte legen Sie fest, wie viele Tische Sie haben!");
            return;
        }
    }

    if (pagenr === 2) {
        if (registerData.email === "" || registerData.password1 === "" || registerData.password2 === "") {
            // Not completed
            setErrmsg("Es müssen alle Felder ausgefüllt sein!");
            return;
        }

        if (registerData.password1 !== registerData.password2) {
            setErrmsg("Passwörter stimmen nicht überein!");
            return;
        }

        if (!privacyConfirmed || !agbConfirmed) {
            setErrmsg("Bitte akzeptieren Sie die AGBs und Datenschutzbestimmungen!");
            return;
        }

        if (selAcquisition === "not-selected") {
            setErrmsg("Wählen Sie bitte aus, wie sie auf uns gekommen sind!");
            return;
        }

        if (selAcquisition === 6 && fieldIsEmpty("otherAcquisition")) {
            setErrmsg("Füllen Sie bitte aus, wie sie auf uns gekommen sind!");
            return;
        }

        if(useSEPA && (fieldIsEmpty("sepa_iban") || fieldIsEmpty("sepa_bic"))) {
            setErrmsg("Bitte füllen Sie die IBAN und BIC aus!");
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

        // Scroll to picture
        console.log(refPoint.current);
        window.scrollTo(0, refPoint.current.offsetTop);
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
    let stylePreview = () => {if (image.raw === "") { return {opacity: 0.2} } else { return {opacity: 1} }};

    let btnStyle = () => {if (image.raw === "") { return {margin: 0} } else { return {} }};

    return (
        <div className="FileUpload">
            <h2>Firmenlogo hochladen</h2>
            <input
                type="file"
                className="UploadBtn"
                accept="image/x-png,image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                style={btnStyle()}
                for="files"
            />
            <p>Logo hochladen</p>
            <div className="UploadPreview" ref={refPoint} style={stylePreview()}>
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
    } else if (name === "useSEPA") {
        setUseSEPA(!useSEPA);
    } else {
        setPrivacyConfirmed(!privacyConfirmed);
    }
}

function Page2() {
    return (
        <>
        <h2>Schritt 2: Unternehmensdaten</h2>
        <form>
            <EntryField name="cname" displayname="Kurzname des Betriebs"/>
            <EntryField name="rcname" displayname="Rechtlicher Name des Betriebs"/>
            <EntryField name="street" displayname="Straße und Hausnr."/>
            <EntryField type="inline1" name="zip" displayname="PLZ"/>
            <EntryField type="inline2" name="town" displayname="Ort"/>

            {false && <div className="CheckboxWrapper CheckboxWrapper2">
                <input type="checkbox" id="otheraddress" className="Checkbox_" value={otherAddress} checked={otherAddress} onClick={() => toggleCheckbox("raddress")}/> <p className="CheckboxText_">Abweichende Rechnungsadresse</p>
            </div>}
            <br />
            <br />

            {otherAddress && <div className="rechnungsAdresse">
                <EntryField name="rstreet" displayname="Straße und Hausnr."/>
                <EntryField type="inline1" name="rzip" displayname="PLZ"/>
                <EntryField type="inline2" name="rtown" displayname="Ort"/>
            </div>}

            <br />
            <br />
            <br />

            <h2>Konfiguration</h2>

            <div className="SelectionBoxes">
                <div className={selPackage === 0 ? "SelectionBox BoxSelected" : "SelectionBox"} onClick={() => setSelPackage(0)}>
                    <div className="SelectionBoxHeader"><h2>Variante 1</h2><div className="InlineBadge"><span>Kostenlos</span></div></div>
                    <h1>5 Flyer (Starterpaket)</h1>
                    <img src={option1} alt="selectionBox" />
                </div>

                <div className={selPackage === 1 ? "SelectionBox BoxSelected" : "SelectionBox"} onClick={() => setSelPackage(1)}>
                    <div className="SelectionBoxHeader"><h2>Variante 2</h2><div className="InlineBadge"><span>1,50 € / Tisch</span></div></div>
                    <h1>Gleiche Flyer für alleTische</h1>
                    <img src={option2} alt="selectionBox" />
                </div>

                <div className={selPackage === 2 ? "SelectionBox BoxSelected" : "SelectionBox"} onClick={() => setSelPackage(2)}>
                    <div className="SelectionBoxHeader"><h2>Variante 3</h2><div className="InlineBadge"><span>1,50 € / Tisch</span></div></div>
                    <h1>Unterschiedliche Flyerfür alle Tische</h1>
                    <img src={option3} alt="selectionBox" />
                </div>
            </div>

            {selPackage !== 0 && 
                <div className="tableCountField">
                    <p>Anzahl der Tische</p>
                    <input
                        type="number"
                        name="tableCount2"
                        value={count}
                        onChange={e => setCount(e.target.value)}
                    />

                    <span>Wir legen ihnen 5 weitere Flyer als Reserve hinzu.</span>
                </div>
            } 


            <FileUpload />

            <p className="ErrorMsgOffset ErrorMsg">{errmsg}</p>

            <div className="EntrySubmit SubmitCompany">
                <input className="EntrySubmitBtn EntrySubmitBtnCompany" type='button' value="Weiter" onClick={handlePageSubmit}/>
            </div>

            <a className="backbtn" onClick={() => setPagenr(0)}>Zurück</a>
        </form>
        </>
    );
}

function Page1() {
    return (
        <>
        <h2>Schritt 1: Angaben zum Ansprechpartner</h2>
        <form>
            <EntryField name="fname" displayname="Vorname"/>
            <EntryField name="lname" displayname="Nachname"/>
            <EntryField name="mobile" displayname="Telefonnummer"/>

            <p className="ErrorMsg">{errmsg}</p>

            <div className="EntrySubmit">
                <input className="EntrySubmitBtn EntrySubmitBtnCompany" type='button' value="Weiter" onClick={handlePageSubmit}/>
            </div>
        </form>
        </>
    );
}

function Page3(props) {
    console.log("Reloading page");

    let style = "EntrySubmitBtn EntrySubmitBtnCompany";

    if (props.submitted) {
        style += " EntrySubmitBtnDeactivated";
    }

    // Reset count if selected variant is 0
    if (selPackage === 0) {
        setCount(0);
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

                <div className="acquisitionQuery">
                    <h3>Wie sind Sie auf uns aufmerksam geworden?</h3> 

                    <div className="dropdownList">
                        <ul>
                            <li className={selAcquisition === 0 ? "BoxSelected" : ""} onClick={() => setSelAcquisition(0)}>In einem Lokal gesehen</li>
                            <li className={selAcquisition === 1 ? "BoxSelected" : ""} onClick={() => setSelAcquisition(1)}>Durch einen anderen Gastronom</li>
                            <li className={selAcquisition === 2 ? "BoxSelected" : ""} onClick={() => setSelAcquisition(2)}>Durch einen Freund</li>
                            <li className={selAcquisition === 3 ? "BoxSelected" : ""}  onClick={() => setSelAcquisition(3)}>Medienauftritt (Fernsehen, Radio oder Blog)</li>
                            <li className={selAcquisition === 4 ? "BoxSelected" : ""} onClick={() => setSelAcquisition(4)}>Social Media (Instagram, Facebook)</li>
                            <li className={selAcquisition === 5 ? "BoxSelected" : ""} onClick={() => setSelAcquisition(5)}>Suche bei Google</li>
                            <li className={selAcquisition === 6 ? "BoxSelected" : ""} onClick={() => setSelAcquisition(6)}>Sonstiges</li>
                        </ul>
                    </div>

                    {selAcquisition === 6 && 
                        <div className="tableCountField">
                        <p>Wie dann?</p>
                        <input
                            type="text"
                            name="otherAcquisition"
                            onChange={e => handleFieldChange("otherAcquisition", e)}
                        />
    
                    </div>
                    }
                </div>

                <div className="price">
                    <h2>Zusammenstellung</h2>
                    <p><strong>Sie werden BarCov kostenlos und unverbindlich einen Monat lang testen.</strong><br /></p>
                    <p>Nach dem Probemonat melden wir uns bei Ihnen und Sie entscheiden, ob Sie BarCov weiterhin nutzen möchten.</p>
                    {count > 0 && <><p>Aufpreis für Ausdrucke: <strong className="priceitem">{(count*1.5).toFixed(2).replace(".", ",")} €</strong></p>
                    <p>Rechnungsbetrag: <strong className="priceitem">{((count*1.5) * 1.16).toFixed(2).replace(".", ",")} € (inkl. 16 % MwSt)</strong></p>
                    <br />
                    <br />
                    <strong>Es wird Ihnen nach Bestätigung des Kaufs eine Rechnung per E-Mail zugesandt.</strong></>}
                    <br />
                    <br />
                </div>

                {count > 0 && <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3">
                    <input type="checkbox" id="useSEPA" className="Checkbox_" value={useSEPA} checked={useSEPA} onClick={() => toggleCheckbox("useSEPA")}/> <p className="CheckboxText_">SEPA-Lastschriftverfahren zum automatischen Einzug des Rechnungsbetrags verwenden (empfohlen).</p>
                </div>}

                {useSEPA && <div className="SEPAfields">
                    <EntryField name="sepa_iban" displayname="IBAN"/>
                    <br />
                    <EntryField name="sepa_bic" displayname="BIC"/>
                    <p>Ich stimme zu, dass ich Vollmacht über das angegebene Konto besitze und die aufgeführten Beträge von diesem eingezogen werden dürfen.</p>
                    <br />
                </div>}

                <br />

                <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3">
                    <input type="checkbox" id="privacy" className="Checkbox_" value={privacyConfirmed} checked={privacyConfirmed} onClick={() => toggleCheckbox("privacy")}/> <p className="CheckboxText_">Ich habe die <a href="/privacy"><strong>Datenschutzerklärung</strong></a> gelesen und stimme zu.</p>
                </div>

                <br />

                <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3">
                    <input type="checkbox" id="agb" className="Checkbox_" value={agbConfirmed} checked={agbConfirmed} onClick={() => toggleCheckbox("agb")}/> <p className="CheckboxText_">Ich habe die <a href="/agb"><strong>Allgemeinen Geschäftsbedingungen</strong></a> gelesen und stimme zu.</p>
                </div>
                <br />

                <p className="ErrorMsg">{errmsg}</p>

                <div className="EntrySubmit">
                    {count > 0 && <input className={style} type='button' value="Kaufen" onClick={handlePageSubmit}/>}
                    {!(count > 0) && <input className={style} type='button' value="Abschließen" onClick={handlePageSubmit}/>}
                </div>

                <a className="backbtn" onClick={() => setPagenr(1)}>Zurück</a>
            </form>
        </>
    );
}

function Page(props) {
    return(
        <>
            {props.pagenr === 0 && <Page1 />}
            {props.pagenr === 1 && <Page2 />}
            {props.pagenr === 2 && <Page3 submitted={props.submitted} />}
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
    [count, setCount] = React.useState("");
    [selPackage, setSelPackage] = React.useState(0);
    [selAcquisition, setSelAcquisition] = React.useState("not-selected");
    [useSEPA, setUseSEPA] = React.useState(false);

    refPoint = React.useRef(null);

    React.useEffect(() => window.scrollTo(0, 0), [pagenr]);

    return(
        <div className="CompanyWrapper">
            <h1 className="h1Head">Unternehmensregistrierung</h1>
            <Page pagenr={pagenr} submitted={submitted} />
        </div>
    );
}

export default CompanyRegisterScreen;