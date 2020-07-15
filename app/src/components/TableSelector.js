import React from 'react';

import './TableSelector.css';

function TableSelector(props) {
    let tableNames = [];

    let i = 0;
    for (let table of props.tables) {
        tableNames.push(<li key={table.idtable} className={(i === props.tables.length - 1) ? "dropdownTableLastLi" : ""} onClick={() => props.setTableNum(table.idtable)}>{table.name}</li>);
        i++;
    }

    return (<div className="tableSelector">
        <div className="tableBtn" onClick={() => props.setOpened(!props.opened)}>
            <p>Tischnummer auswählen</p>
        </div>

        {props.opened && <div className="tableDropdownList">
            <ul>
                {tableNames}
            </ul>
        </div>}
    </div>);
}

export default TableSelector;