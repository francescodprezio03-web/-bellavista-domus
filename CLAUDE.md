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

- **`index.html`** — tutto ciò che serve ai motori di ricerca e alle
  anteprime social: `<title>`, meta description, Open Graph/Twitter card,
  dati strutturati JSON-LD (`LodgingBusiness`), Google tag (gtag.js) con
  Consent Mode v2, favicon.
- **`src/App.jsx`** — un unico file che contiene tutto il sito:
  - `CONFIG` in cima al file: link di prenotazione (Booking.com/Airbnb),
    dati della struttura (nome, località, ospiti/camere/bagni, CIR/CIN,
    email, telefono), percorsi delle fotografie (`CONFIG.images`).
  - `translations` (it/en): tutti i testi del sito nelle due lingue.
  - Componenti di sezione (Header, Hero, Intro, Features, House, Gallery,
    Location, Booking, Footer, CookieBanner, WhatsAppButton, StickyCta).
  - `STYLES`: tutto il CSS del sito, in una template string.
- **`public/images/`** — fotografie reali della struttura (non
  placeholder/Unsplash), referenziate da `CONFIG.images` con path assoluti
  tipo `/images/nome.jpg`. `PhotoSlot` mostra un placeholder elegante
  (mai l'icona di immagine rotta) se il file manca o non carica.
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
  testo, va aggiunto in entrambe le lingue.
- Le fotografie non vanno mai incorporate come base64 nel codice (in
  passato il file era ~9MB per questo motivo): restano file reali in
  `public/images/`, referenziati per path.
- SEO e dati strutturati vivono solo in `index.html`, non in `App.jsx`.
- Consent Mode v2: Google Analytics non raccoglie dati finché l'utente non
  accetta il cookie banner (`CookieBanner` in `App.jsx`); i cookie
  pubblicitari (`ad_*`) restano sempre negati, il sito non fa remarketing.
- Sito interamente in italiano nei commenti/codice; nessun uso di TypeScript.

## Comandi utili

```bash
npm install
npm run dev      # sviluppo locale, http://localhost:5173
npm run build    # genera dist/ pronto per l'hosting
npm run preview  # anteprima locale della build di produzione
```
