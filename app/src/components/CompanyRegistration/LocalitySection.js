import React from 'react';
import EntryField from "./EntryField";
import MemberButton from "./MemberButton";

const LocalitySection = ({handleFieldChange,isLast, removeLocality,addLocality, otherAddress, toggleCheckbox, index}) => {

    const handleChange = (name, event) => {
        handleFieldChange(name,event,index)
    }

    return (
        <>
            <EntryField handleFieldChange={handleChange} name="cname" displayname="Kurzname des Betriebs"/>
            <EntryField handleFieldChange={handleChange} name="rcname"
                        displayname="Rechtlicher Name des Betriebs"/>
            <EntryField handleFieldChange={handleChange} name="street" displayname="Straße und Hausnr."/>
            <EntryField handleFieldChange={handleChange} type="inline1" name="zip" displayname="PLZ"/>
            <EntryField handleFieldChange={handleChange} type="inline2" name="town" displayname="Ort"/>

            <MemberButton handleFieldChange={handleChange} />

            {false && <div className="CheckboxWrapper CheckboxWrapper2">
                <input type="checkbox" id="otheraddress" className="Checkbox_" value={otherAddress}
                       checked={otherAddress} onClick={() => toggleCheckbox("raddress")}/> <p
                className="CheckboxText_">Abweichende Rechnungsadresse</p>
            </div>}
            <br/>
            <br/>

            {otherAddress && <div className="rechnungsAdresse">
                <EntryField handleFieldChange={handleChange} name="rstreet" displayname="Straße und Hausnr."/>
                <EntryField handleFieldChange={handleChange} type="inline1" name="rzip" displayname="PLZ"/>
                <EntryField handleFieldChange={handleChange} type="inline2" name="rtown" displayname="Ort"/>
            </div>}


            <br/>
            <br/>
            <br/>
            {
                index !== 0 && isLast && <a className="backbtn" onClick={() => removeLocality(index)}>Lokal entfernen</a>
            }
            <a className="backbtn" onClick={addLocality}>Weiteres Lokal hinzufügen</a>
        </>
    );
};




export default LocalitySection;
