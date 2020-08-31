import React from 'react';
import EntryField from "./EntryField";
import MemberButton from "./MemberButton";
import option1 from "../../assets/img/option1.png";
import option2 from "../../assets/img/option2.png";
import option3 from "../../assets/img/option3.png";

const LocalitySection = (props) => {
    const {
        registerData, handleFieldChange, isLast, removeLocality, addLocality, otherAddress, toggleCheckbox, index, setSelPackage, selPackage, count, setCount,
    } = props;
    const handleChange = (name, event) => {
        handleFieldChange(name, event.target.value, index)
    }

    const setValue = (name,value) => {
        handleFieldChange(name,value,index)
    }

    const setOtherAddress = (value) => {
        if (!value) {
            setValue("rstreet", "")
            setValue("rzip", "")
            setValue("rtown", "")
        }
        setValue("otherAddress",value)
    }

    const locality = registerData.companies[index];
    const { flyer_package, table_count } = locality;
    return (
        <>
            <EntryField handleFieldChange={handleChange} value={locality.cname} name="cname" displayname="Kurzname des Betriebs"/>
            <EntryField handleFieldChange={handleChange} value={locality.rcname} name="rcname"
                        displayname="Rechtlicher Name des Betriebs"/>
            <EntryField handleFieldChange={handleChange} value={locality.street} name="street" displayname="Straße und Hausnr."/>
            <EntryField handleFieldChange={handleChange} value={locality.zip} type="inline1" name="zip" displayname="PLZ"/>
            <EntryField handleFieldChange={handleChange} value={locality.town} type="inline2" name="town" displayname="Ort"/>

            <div className="CheckboxWrapper CheckboxWrapper2">
                <input type="checkbox" id="otheraddress" className="Checkbox_"
                       checked={locality.otherAddress} onClick={() => setOtherAddress(!locality.otherAddress)}/> <p
                className="CheckboxText_">Abweichende Rechnungsadresse</p>
            </div>

            {locality.otherAddress && <div className="rechnungsAdresse">
                <EntryField handleFieldChange={handleChange} name="rstreet" value={locality.rstreet} displayname="Straße und Hausnr."/>
                <EntryField handleFieldChange={handleChange} type="inline1" name="rzip" value={locality.rzip} displayname="PLZ"/>
                <EntryField handleFieldChange={handleChange} type="inline2" name="rtown" value={locality.rtown} displayname="Ort"/>
            </div>}



            <MemberButton handleFieldChange={handleChange} locality={locality}/>



            <br/>
            <br/>
            <br/>
            <h2>Konfiguration</h2>

            <div className="package-selection">
                <div
                    className={locality.package === "starter" ? "SelectionBox package-selection-box BoxSelected" : "SelectionBox package-selection-box"}
                    onClick={() => setValue("package","starter")}>
                    <div className="SelectionBoxHeader"><h1>Starter-Paket</h1>
                        {
                            locality.isMember ? <div className="InlineBadge"><s className="member-discount">10 € / Monat</s> <span>Kostenlos</span></div>
                                : <div className="InlineBadge"><span>10 € / Monat</span></div>
                        }
                    </div>
                    <ul>
                        <li>Kontakterfassung</li>
                        <li>24/7 Support</li>
                        <li>Wirt kann Gäste eintragen</li>
                    </ul>
                </div>
                <div
                    className={locality.package === "komfort" ? "SelectionBox package-selection-box BoxSelected" : "SelectionBox package-selection-box"}
                    onClick={() => setValue("package","komfort")}>
                    <div className="SelectionBoxHeader"><h1>Komfort-Paket</h1>
                        {
                            locality.isMember ? <div className="InlineBadge"><s className="member-discount">20 € / Monat</s> <span>10 € / Monat</span></div>
                                : <div className="InlineBadge"><span>20 € / Monat</span></div>
                        }
                    </div>
                    <ul>
                        <li>alle Features des Basispakets</li>
                        <li><strong>Speisekarte und Tagesangebote</strong></li>
                        <li><strong>Verlinkung von Social Media</strong></li>
                        <li><strong>MA-Recruiting</strong></li>
                        <li><strong>Archivierungsfunktion für Coronalisten</strong></li>
                    </ul>
                </div>

            </div>

            {
                locality.package !== "none" &&
                <div className="SelectionBoxes">
                    <div className={flyer_package === 0 ? "SelectionBox BoxSelected" : "SelectionBox"}
                         onClick={() => handleFieldChange('flyer_package', 0, index)}>
                        <div className="SelectionBoxHeader"><h2>Variante 1</h2>
                            <div className="InlineBadge"><span>Kostenlos</span></div>
                        </div>
                        <h1>5 Flyer (Starterpaket)</h1>
                        <img src={option1} alt="selectionBox"/>
                    </div>

                    <div className={flyer_package === 1 ? "SelectionBox BoxSelected" : "SelectionBox"}
                         onClick={() => handleFieldChange('flyer_package', 1, index)}>
                        <div className="SelectionBoxHeader"><h2>Variante 2</h2>
                            <div className="InlineBadge"><span>1,50 € / Tisch</span></div>
                        </div>
                        <h1>Gleiche Flyer für alleTische</h1>
                        <img src={option2} alt="selectionBox"/>
                    </div>

                    <div className={flyer_package === 2 ? "SelectionBox BoxSelected" : "SelectionBox"}
                         onClick={() => handleFieldChange('flyer_package', 2, index)}>
                        <div className="SelectionBoxHeader"><h2>Variante 3</h2>
                            <div className="InlineBadge"><span>1,50 € / Tisch</span></div>
                        </div>
                        <h1>Unterschiedliche Flyerfür alle Tische</h1>
                        <img src={option3} alt="selectionBox"/>
                    </div>
                </div>
            }

            {flyer_package !== 0 &&
            <div className="tableCountField">
                <p>Anzahl der Tische</p>
                <input
                    type="number"
                    name="tableCount2"
                    value={table_count}
                    onChange={e => handleChange("table_count",e)}
                />

                <span>Wir legen ihnen 5 weitere Flyer als Reserve hinzu.</span>
            </div>
            }


            {/*{*/}
            {/*    index !== 0 && isLast &&*/}
            {/*    <a className="backbtn" onClick={() => removeLocality(index)}>Lokal entfernen</a>*/}
            {/*}*/}
            {/*{*/}
            {/*    isLast &&*/}
            {/*    <a className="backbtn" onClick={addLocality}>Weiteres Lokal hinzufügen</a>*/}
            {/*}*/}


        </>
    );
};


export default LocalitySection;
