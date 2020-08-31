import React from 'react';
import storeIcon from "../../assets/img/storeIcon.png";
import listIcon from "../../assets/img/listIcon.png";
import settingsIcon from "../../assets/img/settings.png";
import addIconBlack from "../../assets/img/addIconBlack.png";

const CompanyList = ({onEditProperty, companies}) => {
    return (<div className="Card CompanyCard">
            <img src={storeIcon}/><h2>Meine Betriebe</h2>

            {
                companies.map((company) => {
                    return (
                        <div className="company" key={company.id}>
                            {/*<img src={"https://" + window.Vars.domain + ":5000/dashboard_icon?id=" + company.id}*/}
                            {/*     className="companyLogo"/>*/}
                            <p>{company.name}</p>
                            <a href={"/data/" + company.id}>
                                <div className="dataBtn">
                                    <img src={listIcon} className="listIcon"/>
                                    <p>Gästeliste</p>
                                </div>
                            </a>
                            <img src={settingsIcon} className="settingsIcon" onClick={() => {
                                onEditProperty(company)
                            }}/>
                        </div>
                    )
                })
            }
            <div className="addbutton" onClick={() => alert("Diese Funktion kommt bald!")}><img
                src={addIconBlack}></img>Betrieb hinzufügen
            </div>
        </div>
    );
};


export default CompanyList;
