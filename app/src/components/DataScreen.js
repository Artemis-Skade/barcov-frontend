import React from 'react';
import Cookies from 'universal-cookie';
import settingsIcon from '../assets/img/settings.png';
import Pencilimg from '../assets/img/pencil.png';

import DatePicker from "react-datepicker";
import TableSelector from './TableSelector';
 
import "react-datepicker/dist/react-datepicker.css";

import '../App.css';
import '../DataScreen.css';

let tableData, setTableData;
let date, setDate;
let companies, setCompanies;
let showSettings, setShowSettings;
let activeCompany, setActiveCompany;
let sendMails, setSendMails;
let activeCompanyID = "not-generated";

function logout() {
    const cookies = new Cookies();
    cookies.remove("sessionKeyCompany");
}

function fetchData(fetchDate) {
    const cookies = new Cookies();

    let data = {
        id: activeCompanyID,
        date: parseInt(fetchDate.getTime() / 1000),
        session_key: cookies.get('sessionKeyCompany'),
    };

    console.log(data);

    fetch('https://' + window.Vars.domain + ':5000/company_data', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);

        if (res["success"]) {
            // Read in session key
           setTableData(res["summary"]);
        } else {
            alert("Error!");
        }
        
    }).catch(err => console.log(err));
}

function updateCompanyID() {
    let cid = 0;

    for (let i = 0; i < Object.keys(companies).length; i++) {
        if (i === activeCompany) {
            cid = i;
        }
    }
    console.log("Updated company ID: " + Object.keys(companies)[cid]);
    activeCompanyID = Object.keys(companies)[cid];
    console.log("Updated company ID: " + activeCompanyID);
}

function handleDateChange(newDate) {
    newDate = new Date(newDate.getTime() + 7200 * 1000);
    let startDate = new Date(2020, 5, 10, 10, 0, 0,  0);

    console.log(newDate);
    console.log(startDate);

    if (startDate > newDate) {
        console.log("Date too long away. Setting new date to 06/10/2020");
        newDate = startDate;
    }

    setDate(newDate);
    fetchData(newDate);
    console.log("Set to Date: " + newDate);
}

function Settings() {
    let style = () => {if (showSettings)  {return {display: "block"}} else { return {display: "block", marginTop: -300} }};
    // <a href="/">Passwort ändern</a>

    return (
    <div className="SettingsMenu" style={style()}>
        <a href="/" onClick={logout}>Ausloggen</a>
    </div>);
}

function SelectHeader() {
    let companyBtns = [];

    for (let i = 0; i < Object.keys(companies).length; i++) {
        if (i === activeCompany) {
            companyBtns.push(<div key={i} className="CompanyBtn CompanyBtnSel" onClick={() => {setActiveCompany(i); updateCompanyID(i);}}>{companies[Object.keys(companies)[i]]}</div>);
        } else {
            companyBtns.push(<div key={i} className="CompanyBtn" onClick={() => {setActiveCompany(i); updateCompanyID(i);}}>{companies[Object.keys(companies)[i]]}</div>);
        }
    }

    // <a href="https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_1000.xls" download={"auswertung" + dateToString(date) + ".xlsx"}><div className="DownloadBtn">Herunterladen</div></a>

    return (
        <div className="SelectHeader">
            <a className="backBtn" href="/dashboard">Zurück</a>
            <div className="DataTitle"><p>Auswertung vom &nbsp;</p>
                <DatePicker
                    className="DatePicker"
                    selected={date}
                    onChange={handleDateChange}
                />
                <img className="CalendarImg" src={Pencilimg} alt="Calendar" />
            </div>
            <a onClick={downloadFile}><div className="DownloadBtn">Herunterladen</div></a>
            <TableSelector />
            <a onClick={() => setShowSettings(!showSettings)}><img className="settingsBtn" src={settingsIcon} /></a>
            <Settings />
            <div className="CompanyBtns">{companyBtns}</div>
        </div>
    );
}

function dateToString(date) {
    return date.toISOString().split('T')[0];
}

function dateToDetailedString(date) {
    return ('00'+date.getHours()).slice(-2) + ":" + ('00'+date.getMinutes()).slice(-2) + " Uhr";
}

function downloadFile() {
    const cookies = new Cookies();

    if(!window.confirm("Ich stimme der Datenschutzerklärung zu und werde die Personendaten nach spätestens einem Monat nach Erhebungszeitpunkt vernichten.")) {
        return;
    }

    let data = {
        id: activeCompanyID,
        date: parseInt(date.getTime() / 1000),
        session_key: cookies.get('sessionKeyCompany'),
    };

    console.log(data);

    fetch('https://' + window.Vars.domain + ':5000/company_excel', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
        //window.location.href = 'data:application/octet-stream;base64,' + res["file"];
        var a = document.createElement("a"); //Create <a>
        a.href = "data:image/png;base64," + res["file"]; //Image Base64 Goes here
        a.download = companies[Object.keys(companies)[activeCompany]] + dateToString(date) + ".xlsx"; //File name Here
        a.click(); //Downloaded file
    }).catch(err => console.log(err));
}

function Table() {
    let res = [];
    let i = 0;

    for (let row of tableData) {
        let classNames = "Row";
        if (i % 2 === 0) {
            classNames += " RowAlternate";
        }
        res.push(
        <div className={classNames} key={i}>
            <div className="Column">{row["fname"]}</div>
            <div className="Column">{row["lname"]}</div>
            <div className="Column">{row["phone"]}</div>
            <div className="Column">{row["street"]}</div>
            <div className="Column">{row["zip"]}</div>
            <div className="Column">{row["town"]}</div>
            <div className="Column">{dateToDetailedString(new Date(row["timestamp"] * 1000 - 7200000))}</div>
        </div>);

        i++;
    }

    return res;
}

function checkLogin(callback) {
    let cookies = new Cookies();
    console.log("Checking session key...");

    let data = {
        session_key: cookies.get("sessionKeyCompany"),
    }

    fetch('https://' + window.Vars.domain + ':5000/company_checklogin', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
        callback(res);
    }).catch(err => console.log(err));
}

function DataScreen () {
    const cookies = new Cookies();
    [tableData, setTableData] = React.useState([]);
    [companies, setCompanies] = React.useState({});
    [date, setDate] = React.useState(new Date());
    [activeCompany, setActiveCompany] = React.useState(0);
    [showSettings, setShowSettings] = React.useState(false);
    [sendMails, setSendMails] = React.useState(true);

    React.useEffect(() => {
        // Check if session key exists / is valid
        if (cookies.get("sessionKeyCompany") != undefined && cookies.get("sessionKeyCompany").length > 32) {
            // Check login
            checkLogin((data) => {
                if (data["auth"]) {
                    //setCompanies(["Company 1", "Company 2 lololol"]);
                    setCompanies(data.companies);
                    updateCompanyID();
                    fetchData(new Date(Date.now() + 7200 * 1000));
                } else {
                    // Go to login screen
                    window.Vars.setScreen("logincompany");
                }
            });
        } else {
            // Go to login screen
            window.Vars.setScreen("logincompany");
        }
    }, []);

    return (
        <>
        <SelectHeader />
        <div className="WrapperDatascreen">
            <Table />
        </div>
        </>
    );
}

export default DataScreen;