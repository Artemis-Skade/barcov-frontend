import React, {useState, useEffect} from 'react';
import EntryField from "./EntryField";

const MemberButton = ({handleFieldChange}) => {
    const [isMember, setMember] = useState(false)
    return (
        <div style={{paddingTop: "20px"}}>
            <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3">
                <input type="checkbox" id="privacy"
                       className="Checkbox_"
                       onChange={() => setMember(!isMember)}
                       value={isMember}/><p
                style={{marginTop: "24px"}}
                className="CheckboxText_">Mitglied des DEHOGA Rheinland-Pflanz</p></div>

            {
                isMember && <EntryField handleFieldChange={handleFieldChange} name="memberId"
                                        displayname="DEHOGA Rheinland-Pfalz Mitgliedsnummer"/>
            }
        </div>
    );
};


MemberButton.propTypes = {};


export default MemberButton;
