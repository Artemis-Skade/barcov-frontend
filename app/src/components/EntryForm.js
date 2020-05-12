import React from 'react';

import '../App.css';

function EntryField (props){
    let className = "EntryField";
    if (props.type === "inline1") className += " InlineField1";
    if (props.type === "inline2") className += " InlineField2";

    return (
        <div className={className}>
            <p>{props.displayname}</p>
            <input
                type='text'
                name={props.name}
            />
        </div>
    );
}

function EntryForm () {
    let formData, setFormData = React.useState();

    return(
        <div className="EntryForm">
            <h2>Registriere dich bei</h2>
            <h1>Dajöh Mayen</h1>
            <form>
                <EntryField name="first_name" displayname="Vorname"/>
                <EntryField name="last_name" displayname="Nachname"/>
                <EntryField name="tel_nmr" displayname="Telefonnummer"/>
                <EntryField name="address" displayname="Straße und Hausnr."/>
                <EntryField type="inline1" name="zip" displayname="PLZ"/>
                <EntryField type="inline2" name="town" displayname="Ort"/>
                <div className="EntrySubmit">
                    <input type='submit' value="Abschicken"/>
                </div>
            </form>
        </div>
    );
}

export default EntryForm;