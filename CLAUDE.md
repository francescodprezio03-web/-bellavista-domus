# Bellavista Domus — contesto del progetto

Sito vetrina (one-page, IT/EN) per una casa vacanze a Torre a Mare (Bari),
Puglia. React + Vite: contenuti e SEO sono dati statici dentro il repo,
pubblicato come sito statico (build in `dist/`).

**Un'eccezione alla staticità**: `netlify/functions/disponibilita.mjs` gira
lato server e legge i calendari iCal di Airbnb e Booking per il componente
`Calendario`. Conseguenza pratica: **il caricamento manuale di `dist/` non
porta online le funzioni** — serve la build automatica collegata a GitHub.
Con il drag&drop il sito funziona comunque, ma il calendario mostra il
messaggio di errore invece delle date.

## Stack

- **Vite 5** + **React 18** (`@vitejs/plugin-react`), niente router/CSS
  framework: gli stili sono un'unica stringa CSS iniettata via `<style>` in
  `App.jsx` (variabile `STYLES`), niente file `.css` separati (l'unica
  eccezione è `public/fonts/fonts.css`, condiviso da tutte le pagine).
  `STYLES` si inserisce con `dangerouslySetInnerHTML`: come testo normale,
  nel prerendering React trasformerebbe apostrofi e `&` in entità che dentro
  `<style>` il browser non riconverte, rompendo il CSS e l'idratazione.
- Nessun test runner, nessun linter configurato.
- Deploy come sito statico (Netlify/Vercel) — vedi `README.md` per i passi.

## Dove si modifica cosa

- **`index.html`** (home italiana, `/`) e **`en/index.html`** (home
  inglese, `/en/`) — due pagine HTML che servono **la stessa applicazione
  React**: è l'attributo `lang` dell'`<html>` a decidere quale lingua
  mostrare (`src/main.jsx` lo legge e lo passa ad `App` come prop `lang`).
  Ognuna contiene i propri tag per motori di ricerca e anteprime social:
  `<title>`, meta description, Open Graph/Twitter card, dati strutturati
  JSON-LD (`LodgingBusiness`), il richiamo a `public/js/consenso.js` (Google
  Analytics con Consent Mode v2, caricato solo dopo il consenso),
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
    dati della struttura (nome, località, ospiti/camere/bagni, CIS/CIN,
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
  - `MapCard` incorpora Google Maps **solo dopo un click dell'utente**
    (lo dice anche l'informativa privacy, al punto 7):
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
  - **Dove portano i pulsanti — regola da non invertire.** Tutti i richiami
    principali ("Prenota ora" nell'intestazione desktop e nel menu mobile,
    "Verifica disponibilità" nell'hero, la barra fissa `StickyCta`, il
    pulsante pieno della sezione `Booking`) puntano a **`#contact`**, cioè
    al modulo. Booking.com e Airbnb restano raggiungibili, ma come **link
    testuali in secondo piano** dentro `Booking`, mai come pulsanti. Il
    motivo è economico: su una prenotazione diretta non c'è commissione, e
    con pubblicità a pagamento mandare quel traffico a un'OTA significa
    pagare due volte lo stesso ospite. Nel sorgente **non deve esistere
    nessun link a `#booking`**: la sezione conserva l'`id` solo per chi ci
    arriva scorrendo. La frase di `booking.text` promette un prezzo più
    basso di quello delle piattaforme — è una promessa da mantenere davvero,
    e in Italia è lecita perché le clausole di parity rate sono nulle per
    legge dal 2017 (L. 124/2017, art. 1 c. 166).
  - **Modulo: date facoltative.** `arrivo` e `partenza` non hanno `required`
    e non devono riacquistarlo. Chi cerca a gennaio per agosto non ha date
    certe, e un campo obbligatorio che non si può compilare fa chiudere la
    pagina invece di far scrivere. Obbligatori restano solo nome, email e
    consenso.
  - **Consenso privacy.** Il checkbox ha `name="privacy"`, viene inviato a
    Netlify come `"accettata"`/`"non accettata"` ed è dichiarato nel modulo
    statico di `index.html`. Chiedere un consenso senza conservarne traccia
    lo rende inutile proprio quando servirebbe dimostrarlo.
  - `WhatsAppButton` riceve `t`: il messaggio precompilato e l'`aria-label`
    stanno in `translations.<lang>.whatsapp`, mai nel componente. Un ospite
    inglese che tocca il pulsante non deve ritrovarsi a scrivere in italiano.
  - `Testimonial`: la recensione degli ospiti, subito dopo la galleria.
    Il testo in `translations.<lang>.testimonial.quote` è **riportato parola
    per parola** come l'ospite l'ha scritto su Airbnb, punteggiatura
    compresa: non si corregge, non si accorcia, non si riscrive — è
    pubblico e confrontabile. Nella versione inglese la citazione resta in
    italiano e la traduzione va nel campo `translation` (in `it` è `null`).
    Finché la recensione è **una sola** resta una citazione a tutta
    larghezza: una griglia con una scheda sola direbbe al visitatore che
    nessun altro ha ancora dormito lì. Da tre o quattro in su ha senso
    convertirla in griglia.
    **Non aggiungere mai un blocco JSON-LD `Review`/`AggregateRating` alle
    home.** Dal 2019 Google ignora le recensioni marcate su
    `LodgingBusiness`/`LocalBusiness` quando è la struttura stessa a
    controllarle ("self-serving"): il markup non produce stelline nei
    risultati, e le uniche stelline reali arrivano dalla scheda Google
    Business. Le date esatte del soggiorno non si pubblicano: solo il mese
    (`stay`, con `stayIso` per l'attributo `datetime` del tag `time`).
  - `Calendario`: mostra due mesi con le notti già prenotate, leggendole da
    `/api/disponibilita` (la funzione in `netlify/functions/`). Sta appena
    prima del modulo di contatto, così chi trova libere le proprie date ha
    già sotto gli occhi dove scrivere. Tre regole:
    1. **Non inventa mai disponibilità.** Se la lettura fallisce non disegna
       un calendario tutto libero: dichiara che non è riuscito e rimanda al
       modulo. Un "libero" sbagliato costa un ospite.
    2. **Non viene prerenderizzato**: dipende dalla data odierna e da una
       chiamata di rete, quindi finché `oggi` è `null` rende una sezione
       vuota. È anche ciò che evita disallineamenti fra HTML e idratazione.
    3. In locale la funzione non esiste: mostra date finte **con un avviso
       visibile**. Non togliere quell'avviso.
    Le notti occupate si distinguono per trama, non solo per colore: chi non
    distingue bene i colori deve comunque vedere la differenza.
    **Limite da non nascondere**: Airbnb e Booking rigenerano il loro iCal
    ogni 1-4 ore, e contengono solo le prenotazioni fatte lì. Una
    prenotazione diretta non bloccata sui portali continua a risultare
    libera. Il testo in pagina lo dice: il calendario è indicativo.
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
    senza fare nulla finché il visitatore non ha accettato i cookie
    (`window.bdAnalyticsAttivo`) o se `gtag` non c'è (sviluppo locale,
    blocchi pubblicitari), così il sito non può rompersi per il tracciamento.
    Eventi attivi: `contatto` (metodo), `click_ota` (piattaforma),
    `apre_mappa`, `apre_galleria`, `apre_guida` (meta), `richiesta_inviata`,
    `scroll_75`.
  - **Le schede di "Scopri la Puglia" sono link per intero.** In `Location`
    ogni scheda è un `Reveal as="a"` che avvolge fotografia, titolo,
    descrizione ed etichetta: è sulla foto che la gente clicca per istinto, e
    così la scheda è anche una sola fermata del tasto Tab invece di due. Di
    conseguenza l'etichetta in fondo è uno `<span class="bd-explore__link">`
    e **non deve tornare a essere un `<a>`**: un link dentro un link non è
    HTML valido. L'effetto al passaggio del mouse si prende dalla scheda
    (`.bd-explore__card:hover .bd-explore__link`), e il contorno di messa a
    fuoco da tastiera è su `.bd-explore .bd-explore__card:focus-visible` —
    toglierlo renderebbe la sezione inutilizzabile senza mouse.
  - `STYLES`: tutto il CSS del sito, in una template string. **Mai usare
    backtick nei commenti dentro STYLES**: il CSS vive in una stringa
    delimitata da backtick e uno di troppo spezza il file.
  - Attenzione alla specificità dei selettori: in cima al foglio la regola
    `.bd-root a` imposta `color:inherit` su ogni link e pesa più di una
    singola classe. Per dare un colore proprio ai link di un componente
    serve un selettore a due classi (es. `.bd-explore .bd-explore__card`).
  - **Scelte grafiche (settembre 2026), da non reintrodurre senza motivo**:
    niente scritta piccola in maiuscolo con lineetta sopra i titoli di
    sezione (le vecchie classi `bd-eyebrow` e `bd-hairline` non esistono
    più), niente puntini separatori "A · B · C" nei testi, niente freccia
    "→" aggiunta ai link (resta solo come icona dei pulsanti del
    calendario), niente barra contatti blu sopra il menu. `Reveal` non anima
    più nulla: l'unico movimento automatico è l'entrata dell'apertura (hero).
    Sono dettagli tipici dei modelli pronti e tolgono l'aria "premium".
  - La **Galleria** da computer è una griglia a 4 colonne con la prima foto
    grande (2x2): funziona senza buchi con **9 foto**. Da telefono (e
    tablet) Galleria e La Casa si sfogliano in orizzontale.
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
  Per questo le foto delle guide esistono in **due versioni**: quella
  **larga** (`puglia-matera.jpg`, rapporto ~3,1) per l'apertura a tutta
  pagina, e un **ritaglio verticale** (`puglia-matera-scheda.jpg`, 3:4) per le
  schede di "Scopri la Puglia". I riquadri delle schede sono 3:4
  (`.bd-explore__img`). Vale per tutte e otto le mete tranne Torre a Mare,
  la cui foto è ancora l'originale da 900px in attesa di una fotografia
  vera del posto.
  Il ritaglio `-scheda` serve **anche come apertura sul telefono**: lì il
  riquadro `.hero` è quasi quadrato, e la fascia larga mostrerebbe una
  striscia inutilizzabile. Nelle guide il `<picture>` ha quindi due
  `<source>`: il primo con `media="(max-width: 700px)"` che punta alle
  varianti `-scheda`, il secondo con quelle larghe. **Le due sorgenti vanno
  sempre insieme**: aggiungerne una sola significa servire il ritaglio
  sbagliato a metà dei visitatori.
  Le foto d'origine di Bari, Polignano, Monopoli e Alberobello sono
  verticali ad altissima risoluzione (3.400–5.000px di larghezza): i ritagli
  se ne servono e non c'è ingrandimento su nessuno schermo. Gli attributi
  `width`/`height` dell'`<img>` descrivono la **variante larga** (2560×823)
  e vanno aggiornati insieme ai file, altrimenti il browser riserva alla
  foto uno spazio della forma sbagliata e la pagina salta durante il
  caricamento.
- **`public/images/og/`** — le **anteprime social**, una per pagina, tutte
  1200×630 (il formato 1,91:1 che usano WhatsApp, Facebook e X). Sono ritagli
  dedicati generati dalle fotografie: senza, le piattaforme ritagliano da sole
  una foto verticale e ne mostrano una striscia centrale a caso.
  Ogni pagina dichiara `og:image`, `twitter:image` (**lo stesso file**) e
  `og:image:width`/`height`. **L'anteprima deve essere una fotografia, mai il
  logo**: chi riceve il link non conosce ancora il marchio, e un rettangolo
  bianco col nome dell'attività viene aperto molto meno di una foto della
  scogliera o del mare. `branding/og-image.png` resta in cartella ma non è
  usato da nessuna pagina.
- **`public/branding/`** — il marchio. I file **`logo-orizzontale.png`**
  (1024×363) e **`logo-orizzontale-chiaro.png`** sono la stessa grafica in due
  colori: il secondo ha il blu portato su avorio e serve **solo** finché
  l'intestazione è trasparente e sta sopra la fotografia scura dell'apertura,
  dove il blu sparirebbe. `logo-header.png` e `logo-header-chiaro.png` sono
  le stesse due a 300px, usate nell'intestazione: a 34px di altezza bastano
  anche sugli schermi a tripla densità, e il file da 1024px sarebbe uno
  spreco.
  **I PNG originali erano inutilizzabili così com'erano**: la grafica stava
  al centro di una tela molto più grande, con pixel semitrasparenti sparsi
  ovunque, quindi `height:34px` mostrava una scritta alta nove pixel. Sono
  stati ritagliati sul contenuto vero e ripuliti dalle macchioline isolate.
  Se in futuro arriva un logo nuovo, **va controllato lo stesso**: apri il
  file e guarda quanta tela vuota ha attorno prima di metterlo in pagina.
  Le icone (`favicon.ico` con 16/32/48, i due PNG, `apple-touch-icon`, i due
  `android-chrome`) sono dichiarate in tutte e ventidue le pagine e in
  `public/site.webmanifest`. Il vecchio `public/favicon.svg` non è più
  citato da nessuna pagina.
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
  **I due ritorni alla homepage non sono equivalenti.** Il logo
  (`class="logo"`) punta alla cima (`/` o `/en/`), come ci si aspetta da un
  logo. Il link "Torna al sito" (`class="back"`, presente due volte per
  pagina) punta invece alla **sezione da cui si arriva**: `#explore` per le
  otto guide sulle mete, `#faq` per `come-arrivare`, che si raggiunge dalle
  domande frequenti e non dalle schede. Senza l'ancora la homepage si
  ricarica dall'inizio e l'ospite perde il punto in cui era.
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
  3. Ogni link porta `target="_blank" rel="noopener noreferrer"` (regola
     valida per **ogni** link del sito che apre un'altra scheda: `noopener`
     impedisce alla pagina aperta di controllare la nostra, `noreferrer`
     non le dice da quale pagina arriva il visitatore) e un
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
  `dist/`, vedi README.md). Contiene: il `Content-Type` di `sitemap.xml` e
  `robots.txt`, le regole di cache (immagini, font, asset, HTML) e le
  **intestazioni di sicurezza** valide per tutto il sito, prima fra tutte
  la **Content-Security-Policy**: l'elenco chiuso di ciò che il browser può
  caricare. Oggi ammette solo il sito stesso, Google Analytics 4 (domini
  indicati da Google nella guida
  https://developers.google.com/tag-platform/security/guides/csp) e la
  mappa di Google in `frame-src`. Due regole che ne discendono:
  1. **Ogni nuova risorsa esterna** (script, font, mappa, widget, immagine
     remota) va aggiunta alla CSP, altrimenti il browser la blocca in
     silenzio: l'errore si vede solo nella console. Va anche descritta
     nell'informativa privacy e, se trasmette dati a terzi, caricata solo
     dopo il consenso.
  2. **Nessuno script scritto dentro le pagine** (`<script>...codice...</script>`):
     la CSP li blocca. Il codice va in un file in `public/js/` e si carica
     con `src=`. Oggi ce ne sono due: `public/js/consenso.js` (Consent Mode
     e caricamento di gtag.js dopo il consenso, nelle due home, senza
     `async`) e `public/js/anno.js` (l'anno nel footer di guide e privacy). I blocchi JSON-LD (`type="application/ld+json"`) non
     sono script eseguibili e restano nelle pagine.
  `style-src` contiene `'unsafe-inline'` perché tutto il CSS vive in
  `<style>` dentro le pagine e React scrive stili sugli elementi: è un
  compromesso consapevole, molto meno rischioso di script inline.
- **`public/fonts/`** — i font **Fraunces** e **Inter**, ospitati sul sito
  invece che su Google Fonts: così nessun visitatore trasmette il proprio
  IP a Google solo per leggere una pagina. Licenza libera SIL OFL 1.1 (testi
  in `OFL-Fraunces.txt` e `OFL-Inter.txt`), file presi dai pacchetti
  `@fontsource-variable/fraunces` e `@fontsource-variable/inter` 5.3.0 (non
  sono dipendenze npm: i file sono copiati qui). Sono font variabili: un
  file copre tutti gli spessori e, per Fraunces, la dimensione ottica.
  `fonts.css` li dichiara e ogni pagina lo richiama con
  `@import url('/fonts/fonts.css');` in cima al proprio CSS (nelle home, in
  cima a `STYLES`). Le due home precaricano `inter-latin.woff2` e
  `fraunces-latin.woff2` con `<link rel="preload">`: **se cambiano i nomi
  dei file, vanno aggiornati anche quei preload**. Non tornare mai a
  `fonts.googleapis.com`.

## Dati chiave della struttura (da `CONFIG.property` in `App.jsx`)

- Nome: Bellavista Domus
- Località: Torre a Mare, Bari, Puglia — a ~10 metri dal mare
- Capienza: fino a 7 ospiti, 3 camere da letto, 2 bagni
- **CIS** (Regione Puglia, L.R. 57/2018): `BA07200691000078417`
- **CIN** (Banca Dati Strutture Ricettive, Ministero del Turismo):
  `IT072006C200127710`
  Sono due codici distinti rilasciati da enti diversi, e **nessuno dei due si
  ricava dall'altro**: se servono, si copiano dai documenti originali, non si
  deducono. In Puglia il codice regionale si chiama **CIS**, non CIR come in
  altre regioni, ed è obbligatorio in ogni annuncio dal 1° luglio 2020.
  (In passato il sito mostrava come "CIR" il CIN privato del prefisso `IT`:
  un codice inesistente. Non ripetere quella scorciatoia.)
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
- Consent Mode v2 **con caricamento dopo il consenso**: finché l'utente non
  preme "Accetta" nel cookie banner, gtag.js **non viene nemmeno scaricato**
  e il sito non contatta Google. L'unico interruttore è
  `window.bdAttivaAnalytics()` in `public/js/consenso.js`, chiamato da
  quel file se la scelta "accepted" è già salvata e da `CookieBanner`
  quando si preme "Accetta". **Non rimettere mai** un
  `<script src="https://www.googletagmanager.com/...">` fisso nelle home:
  riporterebbe Google a ricevere l'IP di ogni visitatore prima del
  consenso. `traccia()` scarta gli eventi finché il consenso non c'è. I
  cookie pubblicitari (`ad_*`) restano sempre negati, il sito non fa
  remarketing.
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
