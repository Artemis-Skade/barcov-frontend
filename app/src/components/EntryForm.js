import React from 'react';

import '../App.css';

let formData, setFormData;
let errormsg, setErrormsg;
let acceptedPrivacyPolicy, setAcceptedPrivacyPolicy;

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

function handleEntrySubmit(setFormData_) {
    if (!acceptedPrivacyPolicy) {
        setErrormsg("Bestätige zuerst die Datenschutzerklärung!");
        return;
    }

    let entry = {
        storeid: window.Vars.store_id,
        fname: formData.fname,
        lname: formData.lname,
        phone: formData.phone,
        street: formData.street,
        zip: formData.zip,
        town: formData.town
    }
    //console.log("Submitting Entry: " + JSON.stringify(entry));
    console.log("Submitting Entry...");

    // Check if all fields are filled out
    for (let key of Object.keys(entry)) {
        if (entry[key] === "") {
            setErrormsg("Es müssen alle Felder ausgefüllt sein!");
            // Color all empty fields

            return;
        }
    }

    setFormData_(entry);

    fetch('https://barcov.id:5000/enter', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(entry)
    }).then(res => res.json()).then(res => {
        console.log(res);
        window.Vars.setScreen("confirmationwithregistration");
    }).catch(err => {
        console.log(err)
        setErrormsg("Fehler beim Eintragen. Bitte überprüfe deine Internetverbindung oder versuche es später noch einmal.");
    });
}

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newFormData = formData;
    newFormData[name] = event.target.value;
    setFormData(newFormData)

    // Check if field is empty
    /*
    if (event.target.value === "") {
        event.target.placeholder = "Darf nicht leer sein!";
        event.target.style.backgroundColor = "#b31313";
    } else {
        event.target.placeholder = "";
        event.target.style.backgroundColor = "#eee";
    }*/
}

function handleCheckClick(event) {
    setAcceptedPrivacyPolicy(!acceptedPrivacyPolicy);
}

function EntryForm (props) {
    [formData, setFormData] = React.useState({
        fname: "",
        lname: "",
        phone: "",
        street: "",
        zip: "",
        town: "",
    });
    [errormsg, setErrormsg] = React.useState("");
    [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = React.useState(false);

    let submitClassNames = "EntrySubmit";

    if (!acceptedPrivacyPolicy) {
        submitClassNames += " EntrySubmitDisabled";
    }

    return(
        <div className="EntryForm">
            <h2>Registriere dich bei</h2>
            <h1>{props.storename}</h1>
            <form>
                <EntryField name="fname" displayname="Vorname"/>
                <EntryField name="lname" displayname="Nachname"/>
                <EntryField name="phone" displayname="Telefonnummer"/>
                <EntryField name="street" displayname="Straße und Hausnr."/>
                <EntryField type="inline1" name="zip" displayname="PLZ"/>
                <EntryField type="inline2" name="town" displayname="Ort"/>

                <div className="CheckboxWrapper">
                    <input type="checkbox" id="acceptprivacypolicy" name="vehicle1" className="Checkbox" value={acceptedPrivacyPolicy} checked={acceptedPrivacyPolicy} onClick={handleCheckClick}/> <p className="CheckboxText">Ich habe die <a href="/privacypolicy">Datenschutzerklärung</a> gelesen und bin einverstanden.</p>
                </div>

                <p className="Errormsg">{errormsg}</p>
                <div className={submitClassNames}>
                    <input className="EntrySubmitBtn" type='button' value="Abschicken" onClick={() => {handleEntrySubmit(props.setFormData);}}/>
                </div>
            </form>
        </div>
    );
}

export default EntryForm;