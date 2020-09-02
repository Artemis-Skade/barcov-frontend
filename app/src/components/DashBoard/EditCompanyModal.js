import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import closeIcon from "../../assets/img/closeIcon.png";
import flyerpreview from "../../assets/img/flyertemplate.png";
import {updateCompanyData} from "../../api/dashboard";

const disabled = ["account_holder", "bic", "iban", "show_tables", "tables", "rstreet", "rtown", "rzip"]


const EditCompanyModal = ({opened, onSuccess, company, onClose}) => {
    const [companyData, setCompanyData] = useState(company);
    const [image, setImage] = useState({})
    let classNames = "CompanyPopUp";
    console.log("Company PopUp Opened: " + opened);

    const onChange = ({target}) => {
        const {name, value} = target;
        let data = {...companyData}
        data[name] = value;
        setCompanyData(data)
    }

    const handleChange = (e) => {
        if (e.target.files.length) {
            if (e.target.files[0].size > 5242880) {
                alert("Die Logo-Datei ist größer als 5 MB. Bitte lade eine kleinere Datei hoch.");
                return;
            }
            console.log("Uploaded image");
            console.log(e.target.files[0]);
            setImage({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0]
            });
        }
    }

    if (!opened) {
        classNames += " CompanyPopUpClosed";
    }

    if (!opened) {
        return (<></>);
    }

    return (<div className={classNames}>
        <img src={closeIcon} className="closeIcon" onClick={onClose}/>
        <h2>Betrieb bearbeiten</h2>

        <div className="dataBlock">
            <h3>Unternehmensadresse</h3>

            <div className="inputField">
                <p>Kurzname des Betriebs</p>
                <input type="text" value={companyData.name} name="name" onChange={onChange}/>
            </div>

            <div className="inputField">
                <p>Straße und Hausnnr.</p>
                <input type="text" value={companyData.street} name="street" onChange={onChange}/>
            </div>
            <div className="inputField">
                <p>PLZ</p>
                <input type="text" value={companyData.zip} name="zip" onChange={onChange}/>
            </div>
            <div className="inputField">
                <p>Ort</p>
                <input type="text" value={companyData.town} name="town" onChange={onChange}/>
            </div>
        </div>

        <div className="dataBlock">
            <h3>Rechnungsadresse</h3>

            <div className="inputField">
                <p>Rechtlicher Name des Betriebs</p>
                <input type="text" value={companyData.rname} name="rname" onChange={onChange}/>
            </div>
            <div className="inputField">
                <p>Straße und Hausnnr.</p>
                <input type="text" value={companyData.rstreet} name="rstreet" onChange={onChange}/>
            </div>
            <div className="inputField">
                <p>PLZ</p>
                <input type="text" value={companyData.rzip} name="rzip" onChange={onChange}/>
            </div>
            <div className="inputField">
                <p>Ort</p>
                <input type="text" value={companyData.rtown} name="rtown" onChange={onChange}/>
            </div>
        </div>

        <div className="dataBlock">
            <h3>Zusätzliches</h3>

            <div className="inputField">
                <p>Link zu Speisekarte</p>
                <input type="text" value={companyData.menu_link} name="menu_link" onChange={onChange}/>
            </div>
            <div className="inputField">
                <p>Link zu Instagram</p>
                <input type="text" value={companyData.instagram} name="instagram" onChange={onChange}/>
            </div>
        </div>

        {/*<div className="dataBlock">*/}
        {/*    <h3>Firmenlogo</h3>*/}

        {/*    <div className="FileUpload FileUploadChange">*/}
        {/*        <div className="BigButton">*/}
        {/*            <input*/}
        {/*                type="file"*/}
        {/*                className="UploadBtn"*/}
        {/*                accept="image/x-png,image/png,image/jpeg,image/jpg"*/}
        {/*                onChange={handleChange}*/}
        {/*                for="files"*/}
        {/*            />*/}
        {/*            <p>Logo hochladen</p>*/}
        {/*        </div>*/}

        {/*        <img src={image.preview} className="logo-preview"/>*/}
        {/*        <p className="previewText">Flyer-Vorschau</p>*/}
        {/*    </div>*/}
        {/*</div>*/}


        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <div className="button" onClick={() => {
            let update = {};
            Object.keys(companyData).filter(key => !disabled.includes(key)).forEach(key => {
                if (companyData[key] == null || companyData[key] === '') {
                    update[key] = 'None'
                } else {
                    update[key] = companyData[key]
                }
            })
            updateCompanyData(update)
                .then(onSuccess)
                .catch(() => alert("Daten konnten nicht gespeichert werden."))
        }}>Speichern
        </div>
    </div>);
};


EditCompanyModal.propTypes = {};


export default EditCompanyModal;
