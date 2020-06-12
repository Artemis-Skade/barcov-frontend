import React from 'react';

import '../App.css';

let formData, setFormData;
let addPersons, setAddPersons;
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

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function changeAddPersonVal(num, index, event) {
    let newAddPersons = addPersons.slice(); // Make copy
    newAddPersons[num][index] = event.target.value;
    setAddPersons(newAddPersons);
}

function AddPerson (props) {
    return (
        <div className="AddPerson">
            <p>Vorname</p>
            <input
                type="text"
                key={1}
                name={"AddPersonVorname" + props.num}
                value={props.vorname}
                onChange={e => changeAddPersonVal(props.num, 0, e)}
            />
            <p>Nachname</p>
            <input
                type="text"
                key={2}
                name={"AddPersonNachname" + props.num}
                value={props.nachname}
                onChange={e => changeAddPersonVal(props.num, 1, e)}
            />

            <a onClick={() => {let tmp = addPersons.slice(); tmp.remove(props.num); setAddPersons(tmp)}}>Person löschen</a>
        </div>
    );
}

function AdditionalPersons (props) {
    let res = [];
    let i = 0;

    for (let i = 0; i < props.persons.length; i++) {
        res.push(<AddPerson key={i} num={i} vorname={addPersons[i][0]} nachname={addPersons[i][1]}/>);
    }

    return (
        <div className="AdditionalPersons">
            {res}
        </div>);
} 

function enterAdditionalPersons(mainEntry, id) {
    let promises = [];

    for (let person of addPersons) {
        let entry = JSON.parse(JSON.stringify(mainEntry));
        entry.fname = person[0];
        entry.lname = person[1];

        let promise = new Promise((resolve, reject) => {
            fetch('https://' + window.Vars.domain + ':5000/enter', {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(entry)
            }).then(res => res.json()).then(res => {
                // Send other persons
                console.log(res);
                console.log("Added additional person.");
                resolve(res["id"]);
            }).catch(err => {
                console.log(err);
                setErrormsg("FATAL ERROR");
            });
        });
        promises.push(promise);
    }

    Promise.all(promises).then((ids) => {
        ids = ids.concat(id);
        let data = {id_list: ids};
        // Received IDs from all requests. Create new group
        fetch('https://' + window.Vars.domain + ':5000/create_group', {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            // Send other persons
            console.log(res);
            console.log("Created group");
        }).catch(err => {
            console.log(err);
            setErrormsg("FATAL ERROR");
        });
    })
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

    fetch('https://' + window.Vars.domain + ':5000/enter', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(entry)
    }).then(res => res.json()).then(res => {
        // Send other persons if applicable
        if (addPersons.length > 0) {
            enterAdditionalPersons(entry, res["id"]);
        }
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
    setFormData(newFormData);

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
    [addPersons, setAddPersons] = React.useState([]);

    let submitClassNames = "EntrySubmit";
    let submitBtnClassNames = "EntrySubmitBtn";

    if (!acceptedPrivacyPolicy) {
        submitClassNames += " EntrySubmitDisabled";
        submitBtnClassNames += " EntrySubmitBtnDisabled";
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

                <AdditionalPersons persons={addPersons}/>

                <div className="AddPersonBtn">
                    <input className={submitBtnClassNames} type='button' value="Person hinzufügen" onClick={() => {setAddPersons(addPersons.concat([["", ""]]))}}/>
                </div>

                <div className="CheckboxWrapper">
                    <input type="checkbox" id="acceptprivacypolicy" name="vehicle1" className="Checkbox_" value={acceptedPrivacyPolicy} checked={acceptedPrivacyPolicy} onClick={handleCheckClick}/> <p className="CheckboxText_">Ich habe die <a href="/privacypolicy">Datenschutzerklärung</a> gelesen und bin einverstanden.</p>
                </div>

                <p className="Errormsg">{errormsg}</p>
                <div className={submitClassNames}>
                    <input className={submitBtnClassNames} type='button' value="Abschicken" onClick={() => {handleEntrySubmit(props.setFormData);}}/>
                </div>
            </form>
        </div>
    );
}

export default EntryForm;