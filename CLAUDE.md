# Bellavista Domus — contesto del progetto

Sito vetrina (one-page, IT/EN) per una casa vacanze a Torre a Mare (Bari),
Puglia. React + Vite, nessun backend: contenuti e SEO sono dati statici
dentro il repo, pubblicato come sito statico (build in `dist/`).

## Stack

- **Vite 5** + **React 18** (`@vitejs/plugin-react`), niente router/CSS
  framework: gli stili sono un'unica stringa CSS iniettata via `<style>` in
  `App.jsx` (variabile `STYLES`), niente file `.css` separati.
- Nessun test runner, nessun linter configurato.
- Deploy come sito statico (Netlify/Vercel) — vedi `README.md` per i passi.

## Dove si modifica cosa

- **`index.html`** (home italiana, `/`) e **`en/index.html`** (home
  inglese, `/en/`) — due pagine HTML che servono **la stessa applicazione
  React**: è l'attributo `lang` dell'`<html>` a decidere quale lingua
  mostrare (`src/main.jsx` lo legge e lo passa ad `App` come prop `lang`).
  Ognuna contiene i propri tag per motori di ricerca e anteprime social:
  `<title>`, meta description, Open Graph/Twitter card, dati strutturati
  JSON-LD (`LodgingBusiness`), Google tag (gtag.js) con Consent Mode v2,
  preload dell'hero, favicon. **Sono deliberatamente duplicate**: è ciò che
  dà all'inglese un indirizzo indicizzabile invece di un interruttore che
  spariva al ricaricamento. Se si modifica un tag SEO in una, va aggiornato
  anche nell'altra.
  Le due pagine si dichiarano a vicenda con `<link rel="alternate"
  hreflang>` (it, en, x-default), e le stesse coppie sono ripetute in
  `public/sitemap.xml`. Aggiungere una lingua significa toccare quattro
  punti: la nuova cartella con il suo `index.html`, gli hreflang nelle
  pagine esistenti, la sitemap, e `HOME_LINGUE` in `App.jsx`.
  `en/index.html` va dichiarata in `vite.config.js` come entry point
  (`mainEn`), altrimenti non finisce nella build.
- **`src/App.jsx`** — un unico file che contiene tutto il sito:
  - `CONFIG` in cima al file: link di prenotazione (Booking.com/Airbnb),
    dati della struttura (nome, località, ospiti/camere/bagni, CIR/CIN,
    email, telefono, CAP/comune/provincia), percorsi delle fotografie
    (`CONFIG.images`) e `CONFIG.maps` (coordinate della casa + link alla
    scheda Google). **Le coordinate in `CONFIG.maps` vanno tenute allineate
    al blocco `geo` del JSON-LD in `index.html`**: sono due copie dello
    stesso dato, una per la mappa in pagina e una per i motori di ricerca.
  - `translations` (it/en): tutti i testi del sito nelle due lingue.
  - Componenti di sezione (Header, Hero, Intro, Features, House, Gallery,
    Location, MapCard, Booking, Footer, CookieBanner, WhatsAppButton,
    StickyCta).
  - `PhotoSlot` accetta `priority`: va usato **su una sola immagine**,
    quella dell'hero, che così carica in `eager` con `fetchpriority="high"`
    (è l'immagine misurata da Google come LCP, e `index.html` la precarica
    con un `<link rel="preload">`). Tutte le altre restano `lazy`.
  - `MapCard` incorpora Google Maps **solo dopo un click dell'utente**:
    l'`<iframe>` non esiste nel DOM finché non si preme "Mostra la mappa".
    Non trasformarlo mai in un iframe sempre presente — vanificherebbe il
    Consent Mode, perché Google riceverebbe l'IP di ogni visitatore prima
    che il banner cookie sia stato accettato.
  - `ContactForm`: modulo di richiesta disponibilità, gestito da **Netlify
    Forms**. Netlify scopre i moduli leggendo l'HTML pubblicato, ma qui il
    modulo lo disegna React nel browser: per questo in `index.html` esiste
    una copia statica nascosta che ne dichiara nome e campi. **Il nome
    (`richiesta-disponibilita`, costante `NOME_MODULO`) e l'elenco dei campi
    devono restare identici nei due posti**, altrimenti Netlify rifiuta gli
    invii. In sviluppo locale l'invio fallisce sempre: non esiste nessun
    Netlify che raccolga i dati, e l'errore mostrato è atteso.
  - `Faq`: domande frequenti, costruite con `details`/`summary` nativi —
    niente JavaScript, accessibili da tastiera, e il testo resta nell'HTML
    anche a fisarmonica chiusa, quindi leggibile da motori di ricerca e
    assistenti AI. **Le risposte in `translations.<lang>.faq.items` devono
    restare identiche al blocco JSON-LD `FAQPage` nelle due home**: sono
    due copie dello stesso testo, e dichiarare a Google qualcosa di diverso
    da quanto mostri in pagina è una violazione delle sue linee guida.
    (Nota: dal 7 maggio 2026 Google non mostra più i risultati arricchiti
    delle FAQ; il markup resta utile solo per far capire la pagina.)
  - `traccia(evento, parametri)`: invia eventi a Google Analytics. Esce
    senza fare nulla se `gtag` non c'è (sviluppo locale, blocchi
    pubblicitari), così il sito non può rompersi per il tracciamento.
    Eventi attivi: `contatto` (metodo), `click_ota` (piattaforma),
    `apre_mappa`, `apre_galleria`, `richiesta_inviata`, `scroll_75`.
  - `STYLES`: tutto il CSS del sito, in una template string. **Mai usare
    backtick nei commenti dentro STYLES**: il CSS vive in una stringa
    delimitata da backtick e uno di troppo spezza il file.
  - Attenzione alla specificità dei selettori: in cima al foglio la regola
    `.bd-root a` imposta `color:inherit` su ogni link e pesa più di una
    singola classe. Per dare un colore proprio ai link di un componente
    serve un selettore a due classi (es. `.bd-topbar .bd-topbar__item`).
- **`public/images/`** — fotografie reali della struttura (non
  placeholder/Unsplash), referenziate da `CONFIG.images` con path assoluti
  tipo `/images/nome.jpg`. `PhotoSlot` mostra un placeholder elegante
  (mai l'icona di immagine rotta) se il file manca o non carica.
  Accanto a ogni JPEG ci sono le **copie WebP a più larghezze**
  (`hero-480.webp`, `hero-900.webp`, `hero-1400.webp`, `hero.webp`),
  generate da `scripts/genera-webp.py` (richiede Python con Pillow, non fa
  parte di `npm run build`). I JPEG restano come ripiego e come archivio.
  `PhotoSlot` costruisce un elemento `<picture>` leggendo l'elenco
  `VARIANTI_IMMAGINI` in `App.jsx`. **Tre cose vanno di pari passo**, e
  sfasarne una rompe le immagini in silenzio:
  1. i file in `public/images/`
  2. l'elenco `VARIANTI_IMMAGINI` in `src/App.jsx` (non tutte le foto hanno
     le stesse larghezze: quelle già piccole non vengono ingrandite)
  3. il `<link rel="preload">` dell'hero nelle due home, che deve elencare
     le stesse varianti — se puntasse al JPEG, il browser scaricherebbe
     quello **e poi** la variante WebP, cioè il doppio
  Il valore di `sizes` passato a ogni `PhotoSlot` dice al browser quanto
  spazio occuperà l'immagine e è ciò che gli fa scegliere la variante:
  sbagliarlo per eccesso vanifica tutto il lavoro. Aggiungendo uno slot
  fotografico, va passato un `sizes` coerente con il riquadro che lo ospita.

  **La forma conta quanto la risoluzione.** Con `object-fit: cover`, se la
  proporzione della foto non è quella del riquadro, il browser la ingrandisce
  finché copre il lato mancante. Una foto orizzontale 16:9 in un riquadro
  verticale 3:4 viene ingrandita oltre **due volte** e appare sgranata, anche
  se la sua larghezza sarebbe più che sufficiente. `sizes` non protegge da
  questo, perché descrive solo la larghezza.
  Per questo le tre foto orizzontali delle guide nuove esistono in due
  versioni: quella **larga** (`puglia-matera.jpg`) per l'apertura a tutta
  pagina, e un **ritaglio verticale** (`puglia-matera-scheda.jpg`, 3:4) per le
  schede di "Scopri la Puglia". Aggiungendo una foto orizzontale che deve
  comparire anche in una scheda, va generato il ritaglio: i riquadri delle
  schede sono 3:4 (`.bd-explore__img`).
- **`public/privacy.html`**, **`public/privacy-en.html`** — pagina privacy
  statica IT/EN, con hreflang reciproci. Il footer (`Footer` in `App.jsx`)
  sceglie l'URL giusto tramite `t.footer.privacyUrl` — non aggiungere mai
  un `href="/privacy.html"` hardcoded, altrimenti l'utente EN finisce sulla
  pagina italiana. Vivendo in `public/`, non servono entry in
  `vite.config.js`: Vite copia tutto il contenuto di `public/` in `dist/`
  automaticamente, a differenza delle pagine guida in root (vedi sotto).
- **`torre-a-mare.html`**, **`polignano-a-mare.html`**, **`monopoli.html`**,
  **`bari.html`**, **`alberobello.html`** (root, stesso livello di
  `index.html`) — pagine guida statiche "cosa vedere a...", in italiano,
  stessa identità visiva del sito (Fraunces/Inter, palette blu
  Adriatico/avorio/sabbia) e stessa struttura tecnica (SEO
  title/description/OG/Twitter, JSON-LD `Article`).
- **`torre-a-mare-en.html`**, **`polignano-a-mare-en.html`**,
  **`monopoli-en.html`**, **`bari-en.html`**, **`alberobello-en.html`**
  — versioni inglesi delle stesse pagine guida (`lang="en"`, testi e meta
  tradotti, `og:locale` `en_US`). Ogni coppia IT/EN si linka a vicenda con
  tag `<link rel="alternate" hreflang="...">` nell'head (anche in
  `public/sitemap.xml` via `xhtml:link`), così i motori di ricerca sanno
  che sono la stessa pagina in due lingue.
  Tutte e dieci sono linkate dalle rispettive card nella sezione "Scopri
  la Puglia" (`Location` in `App.jsx`, tramite `link`/`linkLabel` su ogni
  voce di `translations.<lang>.location.places` — le voci in `it` puntano
  alle pagine italiane, quelle in `en` alle pagine `-en.html`). A
  differenza di `public/privacy.html`, queste pagine vivono in root
  perché sono registrate come entry point separati in `vite.config.js`
  (`build.rollupOptions.input`) — ogni nuova pagina guida (e la sua
  eventuale versione in un'altra lingua) va dichiarata lì per finire
  nella build, seguendo lo stesso schema.
  Le dieci guide sono anche **collegate tra loro**: le menzioni delle altre
  località nel testo sono link con classe `.placelink`, e in fondo a ogni
  pagina c'è un blocco `<nav class="morelinks">` con le altre quattro guide.
  Regola ferrea: **una pagina italiana linka solo pagine italiane, una
  inglese solo pagine `-en.html`** — mai incroci di lingua. Lo stesso vale
  per i ritorni alla homepage: le guide italiane puntano a `/`, quelle
  inglesi a `/en/`.
  Le guide mantengono il suffisso `-en.html` invece di spostarsi sotto
  `/en/` perché sono già indicizzate da Google: rinominarle costerebbe
  redirect e posizionamento, senza guadagno.
  I **nomi di locali e luoghi** consigliati nel testo (ristoranti, bar,
  panifici, le due spiagge) sono link con classe `.maplink` verso la
  ricerca di Google Maps:
  `https://www.google.com/maps/search/?api=1&amp;query=<nome+località>`.
  Tre regole:
  1. **La località va sempre nella query**, anche quando il nome sembra
     univoco: "La Vela", "Transatlantico" e "Pescaria" esistono in più
     città, e senza "Torre a Mare Bari" o "Polignano a Mare" Maps porta
     altrove.
  2. Si linka alla **ricerca**, non alla scheda di un singolo posto né al
     sito del locale: le piccole trattorie cambiano o abbandonano il sito
     di continuo, un link morto sulla guida è peggio di nessun link.
  3. Ogni link porta `target="_blank" rel="noopener"` e un
     `aria-label="<nome> su Google Maps"` (`on Google Maps` nelle pagine
     inglesi), perché il testo del link da solo non dice dove porta.
  L'`&amp;` nell'URL va scritto come entità: `&` nudo dentro un attributo
  `href` è tollerato dai browser ma segnalato dai validatori.
  A differenza di `.placelink`, che collega le guide tra loro, `.maplink`
  esce dal sito: **non conta come incrocio di lingua**, la scheda Maps è
  la stessa per entrambe le versioni della pagina.
- **`grotte-di-castellana.html`**, **`matera.html`**, **`valle-d-itria.html`**
  (più le versioni `-en.html`) — tre guide su mete più lontane, con la stessa
  struttura delle altre. Le fotografie di apertura **non sono di proprietà**:
  Valle d'Itria e Matera vengono da Unsplash (autori Arianna Zappia e Diego
  Geraldi, uso commerciale consentito); l'origine di quella delle grotte non è
  documentata. Prima di sostituirle o aggiungerne altre, verificare sempre la
  licenza: un'immagine di agenzia usata senza diritti espone a richieste di
  risarcimento. Nelle altre guide queste tre mete sono linkate con un elenco
  testuale in fondo (`.morelinks--testo`), non con schede: le miniature
  esistono ma la griglia a quattro schede è già piena.
- **`come-arrivare.html`**, **`come-arrivare-en.html`** (root) — pagina
  informativa su come raggiungere la casa: auto e uscita, aeroporto,
  autobus 12 dalla stazione di Bari, parcheggio, check-in, servizi.
  Stessa struttura tecnica delle guide (entry point in `vite.config.js`,
  hreflang, JSON-LD `Article`) e stesso foglio di stile, copiato da
  `torre-a-mare.html`. È collegata dalla risposta "Come si arriva" nelle
  FAQ, tramite i campi facoltativi `href`/`linkLabel` di una voce di
  `faq.items` — il link sta fuori dal testo della risposta perché quel
  testo finisce identico nel JSON-LD, dove un tag HTML non avrebbe senso.
- **`public/robots.txt`**, **`public/sitemap.xml`** — SEO tecnico.
- **`netlify.toml`** (root) — non tocca build/publish (quelli restano
  nelle impostazioni del sito su Netlify o nel drag&drop manuale di
  `dist/`, vedi README.md): forza solo il `Content-Type` HTTP corretto
  su `sitemap.xml` (`application/xml`) e `robots.txt` (`text/plain`).

## Dati chiave della struttura (da `CONFIG.property` in `App.jsx`)

- Nome: Bellavista Domus
- Località: Torre a Mare, Bari, Puglia — a ~10 metri dal mare
- Capienza: fino a 7 ospiti, 3 camere da letto, 2 bagni
- CIR: `072006C200127710` — CIN: `IT072006C200127710`
- Contatti: `francescod.prezio03@icloud.com`, `+39 331 822 8563`
- Prenotazioni: link diretti a Booking.com e Airbnb (in `CONFIG.links`)

## Convenzioni

- Contenuti bilingue: ogni testo visibile vive in `translations.it` e
  `translations.en` con la stessa struttura a chiavi — se si aggiunge un
  testo, va aggiunto in entrambe le lingue. Questo include `CookieBanner`
  (testo/pulsanti in `translations.<lang>.cookieBanner`, link privacy in
  `translations.<lang>.footer.privacyUrl`): il componente riceve `t` come
  prop, non deve mai avere testo o `href` hardcoded al suo interno.
- Le fotografie non vanno mai incorporate come base64 nel codice (in
  passato il file era ~9MB per questo motivo): restano file reali in
  `public/images/`, referenziati per path.
- SEO e dati strutturati vivono solo in `index.html`, non in `App.jsx`.
- Consent Mode v2: Google Analytics non raccoglie dati finché l'utente non
  accetta il cookie banner (`CookieBanner` in `App.jsx`); i cookie
  pubblicitari (`ad_*`) restano sempre negati, il sito non fa remarketing.
- Sito interamente in italiano nei commenti/codice; nessun uso di TypeScript.

## Prerendering

`npm run build` esegue **tre** passaggi in fila:

1. `vite build` — pagine e bundle per il browser, in `dist/`
2. `vite build --ssr src/entry-server.jsx --outDir dist-ssr` — la stessa
   applicazione compilata per essere eseguita da Node
3. `node scripts/prerender.mjs` — esegue React lato Node e infila l'HTML
   risultante dentro `<div id="root">` di `dist/index.html` e
   `dist/en/index.html`

Serve perché senza, il server manda una pagina vuota e tutto il testo lo
costruisce React nel browser: Google esegue JavaScript e ci arriva lo
stesso, ma i motori di risposta AI e diversi crawler vedono una pagina
bianca. `build:solo-client` salta il prerendering, utile per isolare un
problema.

Tre vincoli da non violare, altrimenti il prerendering si rompe in modo
silenzioso:

- **Niente API del browser durante il render.** `window`, `document`,
  `localStorage` e `new Date()` vanno usati solo dentro `useEffect`, mai
  nel corpo di un componente: durante il passo 3 il codice gira in Node,
  dove non esistono. Per la data di oggi c'è l'hook `useOggi()`.
- **La classe `bd-js`.** `src/main.jsx` la mette su `<html>` appena parte, e
  `.bd-js .bd-reveal` è ciò che tiene nascoste le animazioni d'ingresso.
  Se si torna a scrivere `.bd-reveal{opacity:0}` senza il prefisso, la
  pagina prerenderizzata diventa piena di testo invisibile per chi non
  esegue JavaScript — cioè per il pubblico che il prerendering serve.
- **`src/main.jsx` usa `hydrateRoot`** quando trova il contenitore già
  pieno, `createRoot` quando è vuoto (sviluppo). Non semplificarlo a un
  solo `createRoot`: butterebbe via l'HTML generato facendo sfarfallare
  la pagina.

Aggiungendo una lingua va aggiornato anche l'elenco `PAGINE` in
`scripts/prerender.mjs`.

## Comandi utili

```bash
npm install
npm run dev               # sviluppo locale, http://localhost:5173
npm run build             # build completa con prerendering (vedi sopra)
npm run build:solo-client # build senza prerendering, per diagnosi
npm run preview           # anteprima locale della build di produzione
```
