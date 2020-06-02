import React from 'react';
import { Player } from 'video-react';
import tutorial from "../assets/video/tutorial.mp4";

import '../App.css';

function ForCompanyScreen () {
    return(
        <div className="Wrapper">
            <h1 className="companyH1">Einrichtung für Ihren Betrieb – ganz einfach:</h1>
            <video className="Tutorialvideo" id="samp" width="640" height="480" controls autoPlay>
                <source src={tutorial} type="video/mp4">
                </source>
            </video>
            <h2 className="companyH2">Erklärvideo – Erstellt von <strong><a href="https://epic-film.de">e.pic. Film</a></strong></h2>
            
            <a href="/company" style={{textDecoration: "none"}}>
                <div className="companyRegisterBtn">
                    <p>Jetzt Betrieb einrichten</p>
                </div>
            </a>

            <div className="companyTeaser">
                <h1>Checkin und -Out per Scan</h1>

                <p>BarCov erfasst durch das Scannen des QR-Codes beim Kommen und Gehen die Kontaktdaten Ihrer Kunden und übermittelt diese verschlüsselt an unseren Server. 
                Dabei kann sich der Kunde frei zwischen einer einmaligen Anmeldung oder einer Registrierung entscheiden. Wird ein Konto erstellt, ist der Benutzer auch beim Scannen eines Codes in anderen Betrieben, die unseren Service beanspruchen, ohne ein erneutes Eingeben der Daten sofort angemeldet. Die Daten Ihrer Kunden sind geschützt und können nicht von Dritten eingesehen werden oder verloren gehen. In Sekundenschnelle sind so die Coronaauflagen erfüllt, ganz ohne Stift und Papier. </p>

                <p>Nach Betriebsende wird dem Unternehmensleiter per E-Mail eine Exceltabelle geschickt. Diese umfasst einen Tagesplan, indem die Daten ihrer Gäste geordnet aufgelistet sind. </p>
            </div>

            <div className="companyFAQ">
                <h1>FAQ für Gastronome</h1>

                <h2>Was ist der Nutzen von BarCov?</h2>
                <p>
                    BarCov soll den Unternehmen den Umgang mit den Coronarichtlinien vereinfachen. Durch das Scannen des QR-Codes beim Kommen und Gehen werden die Kundendaten erfasst und gespeichert.Im Falle einer Infektion kann durch die Kundendaten, die in Tagesplänen geordnet sind, eine Rückverfolgung der Infektionskette leichter umgesetzt werden. Unsere Software hilft Ihnen, dies mit möglichst wenig Aufwand und möglichst hohem Datenschutz für Ihre Gäste umzusetzen. Dabei kann durch die schnelle und digitale Form der Datenerfassung auf Papier und Stift verzichtet werden. <br />
                    <br />
                    <strong>BarCov.id entlastet dabei auf mehreren Ebenen: </strong><br />

                    Sie müssen keine Listen erstellen, ausdrucken und verwalten, welche von Gästen ausgefüllt werden müssten. Das spart Zeit.

                    Die Kontaktdaten Ihrer Kunden werden datenschutzkonform gespeichert und in Tagesplänen sortiert, die im Falle einer Infektion dem Gesundheitsamt helfen, die Infektionskette zu verfolgen. Anders als bei Papierlisten, bei denen auch Dritte Kontaktdaten einsehen können, befinden sich diese in verschlüsselter Form auf unserem Server und werden nur benutzt, wenn sie wirklich gebraucht werden. 

                    Unsere Lösung ist deutlich hygienischer, da weder Kuli noch Papier, sondern lediglich das Smartphone benutzt werden muss. Anders müssten alle Utensilien den Hygienevorschriften entsprechend nach jeder Benutzung desinfiziert werden. 
                </p>



                <h2>Wie kann ich mich als Unternehmer anmelden?</h2>
                <p>
                    Sie können Ihr Unternehmen ganz einfach auf unserer Website barcov.id registrieren, indem Sie das Unternehmen sowie sich selbst als Betreiber hinterlegen. Es ist ebenfalls möglich, mehrere Betriebe dem gleichen Betreiber zuzuordnen. 
                </p>

                <h2>Wie funktioniert der Prozess des Checkins und Checkouts? Welche Daten werden gespeichert?</h2>
                <p>
                    Der Gast scannt den QR-Code. Hierdurch erfasst die App die Uhrzeit, den Namen des Gastes sowie seine Telefonnummer und seine Anschrift. Sämtliche Daten werden zunächst auf dem Handy des Gastes gespeichert, dort verschlüsselt und auf unseren Server gespeichert. Der Checkout erfolgt  mit dem erneuten Scan des QR-Codes. 
                </p>

                <h2>Was passiert wenn ein Gast nicht auscheckt?</h2>
                <p>
                    Dies stellt kein Problem dar. Vergisst der Gast auszuchecken, wird sein Aufenthalt sicherheitshalber bis zum Ladenschluss gespeichert. Checkt er jedoch in einem anderen Betrieb ein, der ebenfalls unsere Software nutzt, erfolgt der vergessene Checkout im vorherigen Lokal automatisch. 
                </p>

                <h2>Welche Daten werden von meinen Gästen erhoben?</h2>
                <p>
                    Wir erheben Name, Telefonnummer und Anschrift, sowie Datum und Uhrzeit des Scans. 
                </p>




                <h2>Wie speichert Ihr die Daten und wie werden diese gesichert?</h2>
                <p>
                    Die Daten werden datenschutzkonform auf einem Server in Frankfurt gespeichert und sind nicht für Dritte zugänglich. Zudem haben Ihre Daten eine Verfallsdauer von vier Wochen. 
                </p>




                <h2>Wie gebe ich die Daten im Kontaktfall von einem meiner Gäste weiter?</h2>
                <p>
                    noch auszufüllen 
                </p>

                <h2>Was tue ich, wenn ein Gast kein Handy dabei hat oder die App nicht benutzen möchte?</h2>
                <p>In welchem Ausmaß unsere Software verwendet wird, können Sie als Besitzer selbst entscheiden. Wir sehen unser Programm als eine Empfehlung, falls jemand kein Handy dabei hat, kann immer noch auf Stift und Papier zurückgegriffen werden. Wichtig ist jedoch die verlässliche und verschlüsselte Sicherstellung der Kundendaten für vier Wochen. </p>
            </div>
        </div>
    );
}

export default ForCompanyScreen;