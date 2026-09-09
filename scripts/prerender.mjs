/* Ultimo passo della build: prende l'applicazione React già compilata per il
   server e ne infila l'HTML dentro <div id="root"> delle pagine generate.
   Da qui in poi il file che il server manda al visitatore contiene il testo
   vero, invece di un contenitore vuoto.

   Va eseguito DOPO i due comandi di build (vedi "build" in package.json):
     1. vite build                -> dist/           pagine e bundle per il browser
     2. vite build --ssr ...      -> dist-ssr/       la stessa app, eseguibile da Node
     3. node scripts/prerender.mjs                   unisce le due cose

   Se aggiungi una lingua, aggiungila all'elenco PAGINE qui sotto. */

import { readFile, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const radice = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PAGINE = [
  { lang: "it", file: "dist/index.html" },
  { lang: "en", file: "dist/en/index.html" },
];

const SEGNAPOSTO = '<div id="root"></div>';

function errore(messaggio) {
  console.error(`\n  Prerendering non riuscito: ${messaggio}\n`);
  process.exit(1);
}

const bundle = resolve(radice, "dist-ssr/entry-server.js");
if (!existsSync(bundle)) {
  errore(
    "manca dist-ssr/entry-server.js.\n" +
    "  Esegui prima:  vite build --ssr src/entry-server.jsx --outDir dist-ssr\n" +
    "  oppure lancia direttamente:  npm run build"
  );
}

/* pathToFileURL è obbligatorio: su Windows import() rifiuta un percorso come
   C:\...\entry-server.js perché lo interpreta come protocollo "c:". Su Linux
   e macOS il percorso semplice funzionerebbe, quindi è un errore che si
   manifesta solo su Windows. */
const { render } = await import(pathToFileURL(bundle).href);

for (const { lang, file } of PAGINE) {
  const percorso = resolve(radice, file);
  if (!existsSync(percorso)) {
    errore(`manca ${file}. È stato eseguito "vite build" prima di questo passo?`);
  }

  const html = await readFile(percorso, "utf8");
  if (!html.includes(SEGNAPOSTO)) {
    errore(
      `in ${file} non trovo ${SEGNAPOSTO}.\n` +
      "  Il contenitore potrebbe essere stato rinominato, o la pagina è già stata prerenderizzata."
    );
  }

  let markup;
  try {
    markup = render(lang);
  } catch (e) {
    errore(`React non è riuscito a generare la pagina "${lang}": ${e.message}`);
  }

  await writeFile(percorso, html.replace(SEGNAPOSTO, `<div id="root">${markup}</div>`), "utf8");

  const kb = (Buffer.byteLength(markup, "utf8") / 1024).toFixed(0);
  console.log(`  prerenderizzata  ${file.padEnd(22)} ${kb} KB di HTML`);
}

/* netlify.toml vive nella radice del progetto, e Vite non lo copia in dist/
   perché non sta in public/. Con il deploy da GitHub non serve — Netlify lo
   legge dal repository — ma con il caricamento manuale di dist/ Netlify vede
   solo quella cartella: senza questa copia perderebbe gli header di cache e
   il Content-Type corretto della sitemap, in silenzio. */
const config = resolve(radice, "netlify.toml");
if (existsSync(config)) {
  await copyFile(config, resolve(radice, "dist/netlify.toml"));
  console.log("  copiato          netlify.toml           per il deploy manuale");
}

console.log("");
