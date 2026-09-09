import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import BellavistaDomus from "./App.jsx";

/* Segnala al foglio di stile che JavaScript è attivo. Le animazioni
   d'ingresso (.bd-reveal) partono nascoste solo sotto questa classe: senza,
   una pagina prerenderizzata letta da chi non esegue JavaScript resterebbe
   piena di testo invisibile. Va fatto subito, prima del render. */
document.documentElement.classList.add("bd-js");

/* La lingua non è uno stato interno all'applicazione: la decide la pagina
   che la ospita. index.html dichiara lang="it", en/index.html dichiara
   lang="en". Questo è ciò che rende l'inglese un indirizzo vero (/en/)
   invece di un interruttore che spariva al ricaricamento. */
const lingua = document.documentElement.lang === "en" ? "en" : "it";

const contenitore = document.getElementById("root");
const app = <BellavistaDomus lang={lingua} />;

/* In produzione il contenitore arriva già pieno di HTML generato dalla build:
   React lo riusa invece di ricostruirlo (hydrateRoot), così la pagina non
   sfarfalla. In sviluppo il contenitore è vuoto e si parte da zero. */
if (contenitore.hasChildNodes()) {
  hydrateRoot(contenitore, app);
} else {
  createRoot(contenitore).render(app);
}
