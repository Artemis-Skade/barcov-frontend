import React, {useState, useEffect} from 'react';
import EntryField from "./EntryField";

const MemberButton = ({handleFieldChange, locality}) => {
    return (
        <div className={"pt-20"}>
            <div className="CheckboxWrapper CheckboxWrapper2 CheckboxWrapper3">
                <input type="checkbox" id="privacy"
                       className="Checkbox_"
                       checked={locality.isMember}
                       onChange={() => handleFieldChange('isMember', {target: {value: !locality.isMember}})}/><p
                style={{marginTop: "24px"}}
                className="CheckboxText_">Mitglied des DEHOGA Rheinland-Pfalz. Ich versichere hiermit, dass ich Mitglied des DEHOGA Rheinland-Pfalz bin.</p></div>

            {
                locality.isMember &&
                <EntryField value={locality.memberId} handleFieldChange={handleFieldChange} name="memberId"
                            displayname="DEHOGA Rheinland-Pfalz Mitgliedsnummer"/>
            }
        </div>
    );
};


MemberButton.propTypes = {};


export default MemberButton;
