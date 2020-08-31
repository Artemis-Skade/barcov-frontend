import React from 'react';

const EntryField = (props) => {
    const {name, handleFieldChange} = props;
    let className = "EntryField";
    let type = "text";
    if (props.type === "inline1") { className += " InlineField1"; }
    if (props.type === "inline2") className += " InlineField2";

    return (
        <div className={className}>
            <p>{props.displayname}</p>
            <input
                type={type}
                name={name}
                onChange={e => handleFieldChange(name, e)}
            />
        </div>
    );
};

export default EntryField;
