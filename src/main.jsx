import React from "react";
import { createRoot } from "react-dom/client";
import BellavistaDomus from "./App.jsx";

/* La lingua non è più uno stato interno all'applicazione: la decide la
   pagina che la ospita. index.html dichiara lang="it", en/index.html
   dichiara lang="en", e da lì la leggiamo qui. Questo è ciò che rende
   l'inglese un indirizzo vero (/en/) invece di un interruttore che
   spariva al ricaricamento e che i motori di ricerca non potevano vedere. */
const lingua = document.documentElement.lang === "en" ? "en" : "it";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BellavistaDomus lang={lingua} />
  </React.StrictMode>
);
