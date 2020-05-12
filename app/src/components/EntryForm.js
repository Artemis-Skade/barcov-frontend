import React from 'react';

import '../App.css';

let formData, setFormData;

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

function handleEntrySubmit() {
    alert("Submitted Entry: " + JSON.stringify({
        fname: formData.fname,
        lname: formData.lname,
        phone: formData.phone,
        street: formData.street,
        zip: formData.zip,
        town: formData.town
    }));

    fetch('http://18.195.117.32:5000/enter', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fname: formData.fname,
            lname: formData.lname,
            phone: formData.phone,
            street: formData.street,
            zip: formData.zip,
            town: formData.town
        })
    });
}

function handleFieldChange(name, event) {
    //alert("Field " + name + " changed " + " to:" + event.target.value);
    let newFormData = formData;
    newFormData[name] = event.target.value;
    setFormData(newFormData)

    // Check if field is empty
    if (event.target.value == "") {
        event.target.placeholder = "Darf nicht leer sein!";
        event.target.style.backgroundColor = "red";
        event.target.style.color = "white";
    }
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

    return(
        <div className="EntryForm">
            <h2>Registriere dich bei</h2>
            <h1>{props.storename}</h1>
            <form onSubmit={handleEntrySubmit}>
                <EntryField name="fname" displayname="Vorname"/>
                <EntryField name="lname" displayname="Nachname"/>
                <EntryField name="phone" displayname="Telefonnummer"/>
                <EntryField name="street" displayname="Straße und Hausnr."/>
                <EntryField type="inline1" name="zip" displayname="PLZ"/>
                <EntryField type="inline2" name="town" displayname="Ort"/>
                <div className="EntrySubmit">
                    <input className="EntrySubmitBtn" type='submit' value="Abschicken" onClick={() => window.Vars.setScreen("confirmation")}/>
                </div>
            </form>
        </div>
    );
}

export default EntryForm;