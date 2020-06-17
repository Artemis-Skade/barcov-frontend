import React from 'react';
import addIcon from '../assets/img/addIcon.png';

import '../App.css';
import '../DiningCard.css';

let content, setContent;
let page, setPage;
let selGroupIndex, setSelGroupIndex;
let storeName, setStoreName;
let selectedMeals, setSelectedMeals;
let storeID;

function showMeals(name, index) {
    console.log("Opening group: " + name);
    setSelGroupIndex(index);
    setPage("meals");
}

function addMeal(mid) {
    setSelectedMeals(selectedMeals.concat(mid));
    console.log("Adding meal: " + mid);
}

function Group(props) {
    return (
    <div className="Group" onClick={() => showMeals(props.name, props.index)}>
        <p>{props.name}</p>
    </div>);
}

function Meal(props) {
    return (
    <div className="Meal" onClick={() => addMeal(props.number)}>
        <h3><span className="mealNumber">{props.number}</span> <span className="mealName">{props.name}</span> <span className="mealPrice">{props.price} €</span></h3>
        <img src={addIcon} />
        <p>{props.desc}</p>
    </div>);
}

function GroupsPage() {
    let res = [];
    let i = 0;

    for (let item of content) {
        res.push(<Group name={item.name} index={i} key={i}/>);
        i++;
    }
    console.log(res);
    return res;
}

function MealsPage(props) {
    let res = [];

    for (let item of content[selGroupIndex].dishes) {
        res.push(<Meal name={item.name} desc={item.description} number={item.number} price={item.price} key={item.name}/>);
    }

    console.log(res);
    return (
        <>
            <div className="BackBtn" onClick={() => {setPage("group")}}>Zurück</div>

            {res}
        </>
    );
}

function DiningcardScreen () {
    [content, setContent] = React.useState([]);
    [page, setPage] = React.useState("group");
    [selGroupIndex, setSelGroupIndex] = React.useState(0);
    [storeName, setStoreName] = React.useState("Loading...");
    [selectedMeals, setSelectedMeals] = React.useState([]);

    React.useEffect(() => {
        // Find out store ID
        let pathname = window.location.pathname.slice(1);
        storeID = pathname.split("/")[1];
        console.log("Store ID: " + storeID);
        

        // Find out store name
        fetch('https://' + window.Vars.domain + ':5000/store', {
            method: 'POST',
            headers: {
            "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                id: storeID
            })
        }).then(res => res.json()).then(res => {
            console.log(res);
            setStoreName(res["name"]);
        }).catch(err => {console.log(err)});

        // Fetch menu
        fetch('https://' + window.Vars.domain + ':5000/get_menu', {
            method: 'POST',
            headers: {
            "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                id: storeID
            })
        }).then(res => res.json()).then(res => {
            console.log(res);
            setContent(res["menu"]["categories"]);
        }).catch(err => {console.log(err)});

        //setContent([{name: "Hauptgerichte", meals: [{name: "Test", desc: "Test Description"}]}, {name: "Getränke", meals: []}]);
    }, []);

    return(
        <>
            <div className="Wrapper">
                <h1>{storeName}</h1>
                <h2>Speisekarte</h2>
                {page === "group" && <GroupsPage />}
                {page === "meals" && <MealsPage />}
            </div>

            <div className="Overview">
                <p>{selectedMeals.length} Speisen ausgewählt</p>
                <div className="DoneBtn">
                    Auswahl anzeigen
                </div>
            </div>
        </>
    );
}

export default DiningcardScreen