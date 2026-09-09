import React from "react";
import { renderToString } from "react-dom/server";
import BellavistaDomus from "./App.jsx";

/* Punto d'ingresso usato solo durante la build, mai nel browser.
   Trasforma l'applicazione React in una stringa di HTML già completo, che
   scripts/prerender.mjs infila dentro <div id="root"> nelle pagine generate.

   Perché serve: senza, il server manda una pagina vuota e tutto il testo lo
   costruisce React nel browser. Google esegue JavaScript e ci arriva lo
   stesso, ma i motori di risposta AI e diversi crawler no: vedono una
   pagina bianca. */
export function render(lang) {
  return renderToString(<BellavistaDomus lang={lang} />);
}
