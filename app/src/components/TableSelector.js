import React from 'react';

import './TableSelector.css';

function TableSelector(props) {
    let [tableName, setTableName] = React.useState("not-set"); 
    let tableNames = [];

    if (!props.tables) {
        return (<></>);
    }

    let i = 0;
    for (let table of props.tables) {
        tableNames.push(<li key={table.idtable} className={(i === props.tables.length - 1) ? "dropdownTableLastLi" : ""} onClick={() => {props.setTableNum(table.idtable); setTableName(table.name); props.setOpened(!props.opened)}}>{table.name}</li>);
        i++;
    }

    return (<div className="tableSelector">
        <div className="tableBtn" onClick={() => props.setOpened(!props.opened)}>
            {tableName === "not-set" && <p>Tisch auswählen</p>}
            {tableName !== "not-set" && <p>Tisch: {tableName}</p>}
        </div>

        {props.opened && <div className="tableDropdownList">
            <ul>
                {tableNames}
            </ul>
        </div>}
    </div>);
}

export default TableSelector;