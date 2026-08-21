# Bellavista Domus — sito web

Progetto pronto per essere pubblicato online. Le fotografie sono file reali
in `public/images/`, i tag SEO sono in `index.html`, tutti i testi e i dati
della struttura sono in `src/App.jsx` (vedi la guida in cima al file).

## Come vedere il sito sul tuo computer (facoltativo)

Serve [Node.js](https://nodejs.org) installato (versione 18 o superiore).

```bash
npm install
npm run dev
```

Si apre un indirizzo tipo `http://localhost:5173` con il sito funzionante.

## Come pubblicarlo online

### Passo 1 — Genera i file definitivi del sito

```bash
npm install
npm run build
```

Questo crea una cartella `dist/` con tutto il sito pronto (HTML, CSS, JS,
immagini) — sono i file che vanno effettivamente online.

### Passo 2 — Carica `dist/` su un servizio di hosting

Le due opzioni più semplici, entrambe gratuite per un sito come questo:

**Netlify (il più semplice, nessun comando da terminale)**
1. Vai su [app.netlify.com](https://app.netlify.com) e crea un account gratuito
2. Trascina la cartella `dist/` nella pagina che ti propongono ("Deploy manually")
3. In pochi secondi il sito è online con un indirizzo tipo `nome-a-caso.netlify.app`
4. Da Site settings → Domain management puoi collegare il tuo dominio
   (es. bellavistadomus.it) quando lo avrai acquistato

**Vercel (alternativa equivalente)**
1. Vai su [vercel.com](https://vercel.com) e crea un account gratuito
2. Installa la CLI (`npm i -g vercel`) o collega il progetto da GitHub
3. Esegui `vercel --prod` dalla cartella del progetto, oppure segui la
   procedura guidata sul sito

### Passo 3 — Registra un dominio (se non l'hai già)

Un dominio come `bellavistadomus.it` si acquista da un registrar (es.
Register.it, Aruba, o direttamente da Netlify/Vercel) per circa 10-20€
l'anno. Una volta acquistato, si collega al sito seguendo le istruzioni
del servizio di hosting scelto (Passo 2).

## Come aggiornare titolo, descrizione e anteprima social (SEO)

Apri `index.html` e modifica il testo dentro i tag `<title>`,
`<meta name="description">` e i tag che iniziano con `og:` — sono i testi
che appaiono su Google e quando il link viene condiviso su WhatsApp o
Instagram.

## Come sostituire una fotografia

Sostituisci il file corrispondente dentro `public/images/` mantenendo lo
stesso nome. Se vuoi cambiare anche il nome del file, aggiorna il percorso
corrispondente in `CONFIG.images` dentro `src/App.jsx`.
