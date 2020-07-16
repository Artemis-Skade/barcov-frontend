import React from 'react';
import addIcon from '../assets/img/addIcon.png';

import '../App.css';

import TableSelector from './TableSelector';

// Returns scan_id (for conrimation screen)
function createScanWithContactId(contactid, tableNum, callback){
    let data = {
        storeid: window.Vars.store_id,
        id: contactid,
        table: tableNum,
    }

    fetch('https://' + window.Vars.domain + ':5000/create_scan_with_id', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        console.log(res);
        if (res["success"]) {
            console.log("Succesfully entered contact with id.");
            callback(res["id"]);
        } else {
            console.log("Failure to enter contact with ID.");
            callback("None");
        }
    }).catch(err => {
        console.log(err)
    });
}

function TableSelectScreen (props) {
    let [tableNumSelOpen, setTableNumSelOpen] = React.useState(false);

    React.useEffect(() => {
        console.log("Loading table select screen...");
        
        if (!props.tables) {
            // Go to confirmation screen straight away
            console.log("Going to confirmation screen");
                createScanWithContactId(props.contactid, props.tableNum, (scanid) => {
                    if (scanid === "None") {
                        alert("Error");
                    } else {
                        // Assign scanId for next screen
                        props.setScanId(scanid);
                        window.Vars.setScreen("confirmation");
                    }
                });
        } else {
            if (props.tableNum !== "None") {
                // Go to confirmation screen
                console.log("Table number selected! Registering contact with contact id");
                createScanWithContactId(props.contactid, props.tableNum, (scanid) => {
                    if (scanid === "None") {
                        alert("Error");
                    } else {
                        // Assign scanId for next screen
                        props.setScanId(scanid);
                        window.Vars.setScreen("confirmation");
                    }
                });
            }
        }
    }, [props.tableNum]);

    return(
        <>
            <div className="Wrapper">
                <br />
                <br />
                <h2>Du wurdest automatisch eingeloggt! Noch ein Schritt...</h2>
                <TableSelector tables={props.tables} opened={tableNumSelOpen} setOpened={setTableNumSelOpen} setTableNum={props.setTableNum}/>
                <br />
                <br />
                <br />
                <br />
            </div>
        </>
    );
}

export default TableSelectScreen