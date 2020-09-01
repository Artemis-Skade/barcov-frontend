import React from 'react';
import starterpaket from "../../assets/img/starterpaket.png";

import '../../App.css';
import StarterPackageCard from "./StarterPackageCard";
import KomfortPackageCard from "./KomfortPackageCard";

function ForCompanyScreen() {
    return (
        <div className="Wrapper">
            <h1>Einrichtung für Ihren Betrieb</h1>

            <div className="Section CompanySection">

                <div className="SectionLeft">
                    <p>BarCov erfasst durch das Scannen des QR-Codes beim Kommen und Gehen die Kontaktdaten Ihrer Kunden
                        und übermittelt diese verschlüsselt an unseren Server. </p>

                    <p>Dabei kann sich der Kunde frei zwischen einer einmaligen Anmeldung oder einer Registrierung
                        entscheiden. Wird ein Konto erstellt, ist der Benutzer auch beim Scannen eines Codes in anderen
                        Betrieben, die unseren Service beanspruchen, sofort angemeldet.</p>

                    <p>Die Daten Ihrer Kunden sind geschützt und können nicht von Dritten eingesehen werden oder
                        verloren gehen. In Sekundenschnelle sind so die Coronaauflagen erfüllt, ganz ohne Stift und
                        Papier. </p>

                    <p>Nach Betriebsende sind alle Gastdaten vom Unternehmensleiter online einsehbar. Auf Wunsch kann
                        außerdem eine Zusammenfassung des Tages heruntergeladen werden.</p>


                </div>

                <div className="SectionRight">

                    <a href="/company" style={{textDecoration: "none"}}>
                        <div className="companyRegisterBtn">
                            <p>Jetzt Betrieb einrichten</p>
                        </div>
                    </a>
                    <img src={starterpaket}/>
                </div>

            </div>

            <div className="package-info">

                <div className="package-cards">

                    <StarterPackageCard/>

                    <KomfortPackageCard/>
                </div>
                <a href="/company" style={{textDecoration: "none", padding: "50px"}}>
                    <div className="companyRegisterBtn">
                        <p>Jetzt Betrieb einrichten</p>
                    </div>
                </a>

            </div>


            <div className="companyFAQ">
                <h1>FAQ für Gastronome</h1>

                <h2>Was ist BarCov?</h2>
                <p>
                    BarCov soll ihrem Unternehmen den Umgang mit den Coronarichtlinien vereinfachen. Durch das Scannen
                    des QR-Codes beim Kommen und Gehen werden die Kundendaten erfasst und gespeichert. Im Falle einer
                    Infektion kann durch die digital erfassten Gastdaten eine Rückverfolgung der Infektionsketten
                    leichter umgesetzt werden. Unsere Software hilft Ihnen, dies mit möglichst wenig Aufwand und hohen
                    Datenschutzgrundsätzen für Ihre Gäste umzusetzen.<br/>
                    <br/>
                    <strong>BarCov.id entlastet dabei auf mehreren Ebenen: </strong><br/>
                    <br/>
                    <ul>
                        <li>Sie müssen keine Listen erstellen, ausdrucken und verwalten, welche von Gästen ausgefüllt
                            werden müssten. Das spart Zeit.
                        </li>
                        <li>Die Kontaktdaten Ihrer Kunden werden datenschutzkonform gespeichert und in Tagesplänen
                            sortiert, die im Falle einer Infektion dem Gesundheitsamt helfen, die Infektionskette zu
                            verfolgen. Anders als bei Papierlisten, bei denen auch Dritte Kontaktdaten einsehen können,
                            befinden sich diese in verschlüsselter Form auf unserem Server und werden nur benutzt, wenn
                            sie wirklich gebraucht werden.
                        </li>
                        <li>Unsere Lösung ist deutlich hygienischer, da weder Kuli noch Papier, sondern lediglich das
                            Smartphone benutzt werden muss. Anders müssten alle Utensilien den Hygienevorschriften
                            entsprechend nach jeder Benutzung desinfiziert werden.
                        </li>
                    </ul>
                </p>

                <h2>Wie kann ich mich als Unternehmer registrieren?</h2>
                <p>
                    Bitte folgen Sie den Anweisungen auf der Registrierungsseite: <a href="/company">Betrieb jetzt
                    registrieren</a>
                </p>

                <h2>Wie funktioniert der Prozess des Check-Ins und Check-Outs? Welche Daten werden gespeichert?</h2>
                <p>
                    Der Gast scannt den QR-Code. Hierdurch erfasst die App die Uhrzeit, den Namen des Gastes sowie seine
                    Telefonnummer und Anschrift. Jene Daten werden abschließend über das Handy des Gastes verschlüsselt
                    an unseren Server übertragen.
                </p>

                <h2>Was passiert, wenn ein Gast nicht auscheckt?</h2>
                <p>
                    Dies stellt kein Problem dar! Vergisst der Gast auszuchecken, wird sein Aufenthalt sicherheitshalber
                    bis zum Ladenschluss gespeichert.
                </p>

                <h2>Welche Daten werden von Ihren Gästen erhoben?</h2>
                <p>
                    Wir erheben Name, Telefonnummer und Anschrift, sowie Datum und Uhrzeit des Scans.
                </p>

                <h2>Wie speichern wir die Daten und wie werden diese gesichert?</h2>
                <p>
                    Die Daten werden datenschutzkonform auf einem Server in Frankfurt gespeichert und sind nicht für
                    Dritte zugänglich. Zudem haben Ihre Daten eine Verfallsdauer, die von Ihrem Bundesland abhängig ist.
                </p>

                <h2>Kann sich ein Gast das Eintragen seiner Daten im Restaurant ersparen?</h2>
                <p>
                    Ja, das geht <a href="/gaeste">hier</a> mit der Erstellung eines Benutzerkontos!
                </p>

                <h2>Was tue ich, wenn ein Gast kein Handy dabei hat oder die App nicht benutzen möchte?</h2>
                <p>In welchem Ausmaß unsere Software verwendet wird, können Sie als Besitzer selbst entscheiden. Wir
                    sehen unser Programm als eine Empfehlung, falls jemand kein Handy dabei hat, kann immer noch auf
                    Stift und Papier zurückgegriffen werden. Wichtig ist jedoch die verlässliche und verschlüsselte
                    Sicherstellung der Kundendaten für vier Wochen. </p>
            </div>
        </div>
    );
}

export default ForCompanyScreen;
