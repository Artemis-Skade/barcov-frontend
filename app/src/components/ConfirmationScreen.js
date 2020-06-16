import React from 'react';
import sound from "../assets/sounds/ding.mp3";
import addIcon from '../assets/img/addIcon.png';
import checkPersonIcon from '../assets/img/checkpersonIcon.png';
import Cookies from 'universal-cookie';

import '../App.css';
import '../Success.css';

let persons, setPersons;
let person, setPerson;
let scanIDs, setScanIDs;

function create_group() {
    let data = {
        id_list: scanIDs.slice()
    }

    console.log("Creating group...");

    fetch('https://' + window.Vars.domain + ':5000/create_group', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}

function AddPerson (props) {
    return (
        <div className="AddPerson">
            <p>Vorname</p>
            <input
                type="text"
                key={1}
                name={"PersonVorname"}
                value={props.vorname}
                onChange={e => changePersonVal(0, e)}
            />
            <p>Nachname</p>
            <input
                type="text"
                key={2}
                name={"PersonNachname"}
                value={props.nachname}
                onChange={e => changePersonVal(1, e)}
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

function changePersonVal(index, event) {
    let newPerson = person.slice(); // Make copy
    newPerson[index] = event.target.value;
    setPerson(newPerson);
}

function scanPerson(person) {
    // Check if already activated
    if (person[3]) {
        return;
    }

    // Confirm 
    let r = window.confirm("Ist " + person[1] + " " + person[2] + " wirklich mit dir da?");

    if (!r) {
        return;
    }

    // Play sound
    let audio = new Audio(sound);
    audio.play();

    // Else activate person
    let tmp = persons.slice();
    tmp[persons.indexOf(person)][3] = true;
    setPersons(tmp);

    let id = person[0];

    let data = {
        storeid: window.Vars.store_id,
        id: id,
    }

    console.log(data);

    fetch('https://' + window.Vars.domain + ':5000/create_scan_with_id', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        setScanIDs(scanIDs.concat(res["id"])); // Read scan ID and append to scan ID list

        create_group();

        console.log(res);
    }).catch(err => {
        console.log(err)
    });
}

function GroupList () {
    let res = [];

    for (let person of persons) {
        let style = "GroupPerson";
        let imgSource = addIcon;

        if (person[3]) {
            style += " GroupPersonActivated";
            imgSource = checkPersonIcon;
        }

        res.push(<div className={style} key={person[0]} onClick={() => scanPerson(person)}>
            <img src={imgSource} alt="Add" />
            <p>{person[1]} {person[2]}</p>
        </div>);
    }

    return res;
}

function loadGroup() {
    const cookies = new Cookies();
    let data = {session_key: cookies.get("sessionKey")};

    fetch('https://' + window.Vars.domain + ':5000/get_group', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
        setPersons(res["accompaniment"]);
    }).catch(err => {
        console.log(err)
    });
}

function addPerson(person) {
    // Check if filled out
    if (person[0] === "" || person[1] === "") {
        alert("Es müssen alle Felder ausgefüllt sein!");
        return;
    }

    setPersons(persons.concat([[0, ...person, true]]));

    // Play sound
    let audio = new Audio(sound);
    audio.play();

    // send entry and create group
    let data = {
        storeid: window.Vars.store_id,
        scan_id: scanIDs[0],
        fname: person[0],
        lname: person[1],
    }

    //console.log("Submitting Entry: " + JSON.stringify(entry));
    console.log("Submitting Entry for additional person...");
    console.log(data);

    fetch('https://' + window.Vars.domain + ':5000/create_scan_with_id', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        // Success! Now, create group with all IDs
        let newscanid = res["id"];
        setScanIDs(scanIDs.concat(newscanid));

        create_group();
    }).catch(err => {
        console.log(err);
    });    

    // Reset person
    setPerson(["", ""]);
}

function ConfirmationScreen (props) {
    let message = "";
    [persons, setPersons] = React.useState([]);
    [person, setPerson] = React.useState(["", ""]);
    [scanIDs, setScanIDs] = React.useState([]);

    React.useEffect(() => {
        loadGroup();

        if (props.scanid !== undefined) {
            setScanIDs([props.scanid]);
        }
    }, []);

    if (props.type === "entry") {
        message = <>Vielen Dank! Du wurdest erfolgreich bei <strong style={{color: "#07256b"}}>{window.Vars.storename}</strong> eingetragen!</>;
    } else if (props.type === "register") {
        message = "Du wurdest erfolgreich registriert! " + window.Vars.registerMsg;
    } else if (props.type === "companyregister") {
        message = "Das Unternehmen wurde erfolgreich registriert.";
    }

    let submitBtnClassNames = "EntrySubmitBtn";

    return(
        <div className="EntryForm">
            <audio autoPlay src={sound} type="audio/wav"/>
            <div className="success-checkmark">
                <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                </div>
            </div>
            <h1 style={{textAlign: "center"}}>{message}</h1>

            <div className="groupList">
                <h2>Ist noch jemand mit dir da?</h2>
                <GroupList/>
            </div>

            <div className="AdditionalPerson">
                <AddPerson vorname={person[0]} nachname={person[1]}/>
            </div>

            <div className="AddPersonBtn">
                <input className={submitBtnClassNames} type='button' value="Weitere Person hinzufügen" onClick={() => {addPerson(person)}}/>
            </div>
        </div>
    );
}

export default ConfirmationScreen;