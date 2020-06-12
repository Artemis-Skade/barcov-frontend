import React from 'react';
import sound from "../assets/sounds/ding.mp3";
import addIcon from '../assets/img/addIcon.png';
import checkPersonIcon from '../assets/img/checkpersonIcon.png';
import Cookies from 'universal-cookie';

import '../App.css';
import '../Success.css';

let persons, setPersons;

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
        id: id
    }

    console.log(data);

    fetch('https://' + window.Vars.domain + ':5000/create_scan_with_id', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
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

function ConfirmationScreen (props) {
    let message = "";
    [persons, setPersons] = React.useState([]);

    React.useEffect(() => {
        loadGroup();
    }, []);

    if (props.type === "entry") {
        message = <>Vielen Dank! Du wurdest erfolgreich bei <strong style={{color: "#07256b"}}>{window.Vars.storename}</strong> eingetragen!</>;
    } else if (props.type === "register") {
        message = "Du wurdest erfolgreich registriert! " + window.Vars.registerMsg;
    } else if (props.type === "companyregister") {
        message = "Das Unternehmen wurde erfolgreich registriert.";
    }

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
                {(persons.length > 0) && <h2>Ist noch jemand mit dir da?</h2>}
                <GroupList/>
            </div>
        </div>
    );
}

export default ConfirmationScreen;