import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================================
   BELLAVISTA DOMUS — sito vetrina per casa vacanze
   ----------------------------------------------------------------------------
   COME MODIFICARE QUESTO FILE (guida rapida)
   1) CONFIG.links        -> link di prenotazione Booking.com / Airbnb
   2) CONFIG.property      -> dati della struttura (nome, luogo, CIS/CIN, capienza)
   3) CONFIG.images        -> tutte le fotografie (oggi sono placeholder da Unsplash,
                               sostituiscile con gli URL delle tue foto reali)
   4) translations (it/en)  -> tutti i testi del sito, in italiano e inglese
   Tutto il resto è impaginazione/stile e non richiede modifiche per aggiornare
   i contenuti.

   NOTE SULLA REVISIONE v2
   - Corretto un bug di specificità CSS che rendeva illeggibili i pulsanti
     "Prenota su Booking.com / Airbnb" (testo scuro su sfondo scuro).
   - Rivista tipografia, spaziature, hero, CTA, sezione Caratteristiche,
     griglia de La Casa, header, footer e ritmo generale della pagina.

   NOTE SULLA REVISIONE v3 — GESTIONE FOTOGRAFIE
   - CONFIG.images non punta più a URL esterni (Unsplash): ogni voce è una
     stringa vuota "" pronta per essere sostituita con il percorso della
     tua fotografia reale (es. "/images/soggiorno.jpg" oppure un URL tuo).
   - Ogni slot fotografico passa ora attraverso il componente <PhotoSlot>:
     se il percorso è vuoto, o se l'immagine non riesce a caricarsi,
     mostra un placeholder elegante coerente con il design (mai l'icona
     di immagine rotta del browser). Proporzioni, dimensioni e
     composizione dello slot restano identiche in entrambi i casi, quindi
     inserire le foto reali in un secondo momento non richiede toccare
     il layout: basta compilare i percorsi in CONFIG.images.

   NOTE SULLA REVISIONE v4 — FOTOGRAFIE REALI
   - Inserite le fotografie reali di Bellavista Domus.

   NOTE SULLA REVISIONE v5 — PROGETTO PUBBLICABILE
   - Le fotografie sono ora file reali dentro /public/images (non più
     incorporate come base64 nel codice): il file è passato da ~9MB a
     meno di 50KB. Per sostituire una foto in futuro, basta rimpiazzare
     il file corrispondente in /public/images con lo stesso nome, oppure
     cambiare il percorso qui sotto in CONFIG.images.
   - I tag SEO (title, meta description, Open Graph, dati strutturati)
     sono ora nell'intestazione di index.html, dove i motori di ricerca
     e le anteprime social (WhatsApp, Facebook, Instagram) li leggono
     correttamente — vedi README.md per come aggiornarli.
   ============================================================================ */

/* ---------------------------------- CONFIG --------------------------------- */

const CONFIG = {
  links: {
    // Sostituisci questi due link con le pagine reali dell'annuncio
    booking: "https://www.booking.com/Share-UkSF6kA",
    airbnb: "https://www.airbnb.it/rooms/1741483445487016562?guests=1&adults=1&s=67&unique_share_id=8085d8d3-d20c-4f71-ae45-3fb61661bb88",
  },
  property: {
    name: "Bellavista Domus",
    locationLine: "Torre a Mare, Bari, Puglia",
    guests: 7,
    bedrooms: 3,
    bathrooms: 2,
    /* Due codici distinti, rilasciati da enti diversi. Nessuno dei due si
       ricava dall'altro: vanno copiati dai documenti originali.
       - CIS: Codice Identificativo di Struttura della Regione Puglia
         (L.R. 57/2018), obbligatorio in ogni annuncio dal 1° luglio 2020.
         In Puglia si chiama CIS, non CIR come in altre regioni.
       - CIN: Codice Identificativo Nazionale, dalla Banca Dati Strutture
         Ricettive del Ministero del Turismo. */
    cis: "BA07200691000078417",
    cin: "IT072006C200127710",
    email: "francescod.prezio03@icloud.com",
    phone: "+39 331 822 8563",
    // Riga della via, facoltativa: se resta vuota la scheda mostra solo
    // CAP, comune e provincia, e la mappa resta comunque precisa perché
    // punta alle coordinate qui sotto, non a un indirizzo scritto.
    street: "",
    postalCode: "70126",
    city: "Torre a Mare",
    province: "BA",
  },
  maps: {
    // Coordinate reali della struttura, lette dalla scheda Google Maps.
    // Le stesse vanno tenute allineate al blocco "geo" dei dati strutturati
    // in index.html: è da lì che Google capisce dove si trova la casa.
    lat: 41.0929646,
    lng: 16.9849044,
    // Link condivisibile alla scheda Google di Bellavista Domus: apre il
    // luogo registrato, con recensioni e foto, non un punto anonimo.
    placeUrl: "https://maps.app.goo.gl/jLEXjAeG8ijbvvFf6",
  },
  images: {
    // Ogni percorso punta a un file reale in /public/images. Per sostituire
    // una foto, cambia il file (stesso nome) oppure aggiorna il percorso qui.
    hero: "/images/hero.jpg",
    intro: "/images/intro.jpg",
    // ordine: living, bedroom, kitchen, bathroom, balcony, outdoor
    house: [
      { key: "living", url: "/images/casa-soggiorno.jpg", span: 7, aspect: "4/5" },
      { key: "bedroom", url: "/images/casa-camera.jpg", span: 5, aspect: "4/5" },
      { key: "kitchen", url: "/images/casa-cucina.jpg", span: 4, aspect: "1/1" },
      { key: "bathroom", url: "/images/casa-bagno.jpg", span: 4, aspect: "1/1" },
      { key: "balcony", url: "/images/terrazzo-migliorata.jpg", span: 4, aspect: "1/1" },
      { key: "outdoor", url: "/images/casa-spazi-esterni.jpg", span: 6, aspect: "4/3" },
      { key: "parking", url: "/images/casa-parcheggio.jpg", span: 6, aspect: "4/3" },
    ],
    // 9 foto: da computer la prima è grande (2 colonne x 2 righe) e le altre
    // riempiono la griglia a 4 colonne senza buchi (2 + 2 accanto alla grande,
    // poi una riga da 4). Con un numero diverso l'ultima riga resta incompleta.
    // L'ordine racconta la casa: soggiorno, esterni, camere, cucina, giardino.
    gallery: [
      "/images/galleria-01.jpg",
      "/images/galleria-07.jpg",
      "/images/galleria-02.jpg",
      "/images/galleria-06.jpg",
      "/images/galleria-03.jpg",
      "/images/galleria-04.jpg",
      "/images/galleria-09.jpg",
      "/images/galleria-08.jpg",
      "/images/galleria-05.jpg",
    ],
    location: "/images/posizione-mare.jpg",
    explore: {
      torreamare: "/images/puglia-torre-a-mare.jpg",
      bari: "/images/puglia-bari-scheda.jpg",
      polignano: "/images/puglia-polignano-scheda.jpg",
      monopoli: "/images/puglia-monopoli-scheda.jpg",
      alberobello: "/images/puglia-alberobello-scheda.jpg",
      // Ritagli verticali dedicati: il riquadro della scheda è 3:4, e una
      // fotografia orizzontale ci verrebbe ingrandita di oltre due volte.
      // Le pagine guida usano invece la versione larga, senza suffisso.
      castellana: "/images/puglia-castellana-scheda.jpg",
      matera: "/images/puglia-matera-scheda.jpg",
      valleditria: "/images/puglia-valle-d-itria-scheda.jpg",
    },
  },
  seo: {
    it: {
      title: "Bellavista Domus — Casa vacanze sul mare a Torre a Mare, Bari",
      description:
        "Casa vacanze premium a 10 metri dal mare a Torre a Mare (Bari), Puglia. Fino a 7 ospiti, 3 camere, 2 bagni. Ideale per famiglie e gruppi.",
    },
    en: {
      title: "Bellavista Domus — Seafront Holiday Home in Torre a Mare, Bari",
      description:
        "Premium holiday home 10 metres from the sea in Torre a Mare (Bari), Puglia. Up to 7 guests, 3 bedrooms, 2 bathrooms. Ideal for families and groups.",
    },
  },
};

/* ------------------------------- TRANSLATIONS ------------------------------- */

const translations = {
  it: {
    nav: { home: "Home", house: "La Casa", gallery: "Galleria", location: "Posizione", explore: "Dintorni", contact: "Contatti", book: "Prenota ora" },
    topbar: { address: "Apri la posizione su Google Maps", phone: "Chiama Bellavista Domus", email: "Scrivi a Bellavista Domus" },
    hero: {
      title: "Bellavista Domus",
      subtitle: "A pochi passi dal mare.",
      info: `Fino a ${CONFIG.property.guests} ospiti, ${CONFIG.property.bedrooms} camere da letto, ${CONFIG.property.bathrooms} bagni`,
      ctaPrimary: "Verifica disponibilità",
      ctaSecondary: "Scopri la casa",
      scroll: "Scorri",
    },
    intro: {
      eyebrow: "Benvenuti",
      title: "Il tuo soggiorno sull'Adriatico",
      text: "Svegliati con il mare davanti, rallenta il ritmo e vivi la Puglia come preferisci. Bellavista Domus è una casa vacanze privata pensata per famiglie e gruppi che cercano spazio, comfort e il mare a pochi passi.",
    },
    features: [
      { title: "10 m dal mare", desc: "Spiaggia libera a due passi dalla porta di casa." },
      { title: `Fino a ${CONFIG.property.guests} ospiti`, desc: "Spazi pensati per famiglie e gruppi numerosi." },
      { title: `${CONFIG.property.bedrooms} camere da letto`, desc: "Ambienti privati e confortevoli per tutti." },
      { title: `${CONFIG.property.bathrooms} bagni`, desc: "Comfort e praticità per l'intero gruppo." },
      { title: "Parcheggio privato", desc: "Un posto auto riservato, senza pensieri." },
      { title: "Spazi esterni", desc: "Balconi e area barbecue per vivere l'aperto." },
    ],
    house: {
      eyebrow: "La struttura",
      title: "La Casa",
      text: "Bellavista Domus è una casa intera, pensata per chi vuole condividere il proprio tempo in Puglia con la famiglia o un gruppo di amici, senza rinunciare a spazio e privacy.",
      items: {
        living: "Soggiorno",
        bedroom: "Camere da letto",
        kitchen: "Cucina completa",
        bathroom: "Bagni",
        balcony: "Balconi",
        outdoor: "Spazi esterni",
        parking: "Parcheggio privato",
      },
    },
    gallery: { eyebrow: "Fotografie", title: "Galleria" },
    /* Recensioni reali, riportate parola per parola come le hanno scritte gli
       ospiti, refusi compresi: non si correggono, non si accorciano, non si
       abbelliscono. Sono pubbliche e ognuna rimanda alla pagina della casa
       sulla sua piattaforma (CONFIG.links), dove chiunque può confrontarla.
       Quelle in un'altra lingua hanno la traduzione sotto, da aprire. Solo il
       nome dell'ospite e il mese: niente cognomi, città, numeri di
       prenotazione. Dalla più recente. La nota finale risponde al Codice del
       Consumo (art. 22, comma 5-bis): dice da dove vengono le recensioni.
       Niente dati strutturati Review/AggregateRating: vedi CLAUDE.md. */
    testimonial: {
      title: "Cosa dicono gli ospiti",
      translationLabel: "Leggi la traduzione in italiano",
      note: "Recensioni reali di ospiti che hanno soggiornato qui, riportate per intero dalle piattaforme su cui hanno prenotato. Ognuna rimanda alla pagina della casa su Airbnb o Booking.com, dove si può leggere l'originale.",
      reviews: [
        { platform: "airbnb", author: "Renáta", when: "settembre 2026", iso: "2026-09", stars: 5, rating: "Valutazione 5 su 5", title: null, lang: "en",
          quote: "A wonderful place to stay – everything was perfect! The rooms are huge and spacious, with a large communal area that creates a really warm and welcoming atmosphere. The house also has a beautiful garden and a large terrace, which was perfect for relaxing and enjoying the surroundings.\nThe kitchen is fully equipped, and the whole house is spotlessly clean and has such a lovely atmosphere. It is a charming seaside home.\nWe were also welcomed with a lovely welcome package upon arrival, which was such a thoughtful touch.\nFrancesco was incredibly kind, helpful, and attentive, and we could always count on him whenever we needed anything.\nWe had a fantastic stay and would wholeheartedly recommend this beautiful place! ❤️",
          translation: "Un posto meraviglioso in cui soggiornare: tutto era perfetto! Le camere sono enormi e spaziose, con un'ampia zona comune che crea un'atmosfera davvero calda e accogliente. La casa ha anche un bel giardino e un grande terrazzo, perfetto per rilassarsi e godersi i dintorni.\nLa cucina è completamente attrezzata e tutta la casa è pulitissima e ha un'atmosfera davvero piacevole. È un'incantevole casa sul mare.\nAll'arrivo siamo stati accolti anche con un bel pacchetto di benvenuto, un pensiero davvero gentile.\nFrancesco è stato incredibilmente gentile, disponibile e attento, e abbiamo sempre potuto contare su di lui per qualsiasi necessità.\nAbbiamo trascorso un soggiorno fantastico e consigliamo con tutto il cuore questo posto bellissimo! ❤️",
          source: "Leggi su Airbnb" },
        { platform: "booking", author: "Angela", when: "settembre 2026", iso: "2026-09", score: "9/10", rating: "Punteggio 9 su 10", title: "Fantastic!", lang: "en",
          quote: "The villa was a perfect location for my needs,, close to family and a few steps from the sea. The host Francesco was amazing, very attentive and prompt\nIt's a perfect villa for a family, beautiful garden and very comfortable interior with a full kitchen , with all the amenities needed I will definitely be back.",
          translation: "Fantastico!\nLa villa era in una posizione perfetta per le mie esigenze, vicina alla famiglia e a pochi passi dal mare. L'host Francesco è stato fantastico, molto attento e sollecito.\nÈ una villa perfetta per una famiglia, con un bel giardino e interni molto confortevoli, una cucina completa e tutti i servizi necessari. Tornerò sicuramente.",
          source: "Leggi su Booking.com" },
        { platform: "airbnb", author: "Gaetana", when: "agosto 2026", iso: "2026-08", stars: 5, rating: "Valutazione 5 su 5", title: null, lang: "it",
          quote:
            "Ci siamo trovati benissimo in 6, spazi ampi, casa completa di tutto e camere con aria condizionata, terrazzino esterno stupendo. Francesco è stato gentilissimo e disponibile per qualsiasi dubbio riguardo la casa e non solo. Ci è sembrato di essere a casa, con il vantaggio di essere a due passi dal mare. Consigliatissimo, spero di poterci tornare presto",
          translation: null,
          source: "Leggi su Airbnb" },
      ],
    },
    /* Elenco delle dotazioni reali della casa. Regola: si scrive solo ciò che
       c'è davvero. Un ospite che non trova quello che ha letto qui lascia una
       recensione negativa, e su una struttura giovane pesa moltissimo. */
    amenities: {
      eyebrow: "Dotazioni",
      title: "Cosa trovi in casa",
      text: "Tutto quello che serve per una settimana in famiglia o con amici, senza dover comprare nulla appena arrivati.",
      bedsTitle: "Come si dorme",
      beds: [
        { room: "Camera 1", detail: "Letto matrimoniale", places: "2 posti" },
        { room: "Camera 2", detail: "Letto matrimoniale", places: "2 posti" },
        { room: "Camera 3", detail: "Letto a una piazza e mezza e letto a castello", places: "3 posti" },
      ],
      groups: [
        {
          title: "Cucina",
          items: ["Forno", "Friggitrice ad aria", "Lavastoviglie", "Frigorifero con congelatore", "Macchina del caffè", "Pentole e padelle", "Piatti, bicchieri, posate e tazze"],
        },
        {
          title: "Clima",
          items: ["Aria condizionata caldo/freddo in tutte e tre le camere", "Aria condizionata caldo/freddo in salotto"],
        },
        {
          title: "Bagni e biancheria",
          items: ["Due bagni, entrambi con doccia", "Lenzuola e asciugamani inclusi", "Lavatrice", "Stendibiancheria", "Asciugacapelli", "Sapone"],
        },
        {
          title: "Connettività",
          items: ["Wi-Fi in fibra fino a 500 Mbps", "TV in salotto con Netflix e altri servizi di streaming"],
        },
        {
          title: "Spazi esterni",
          items: ["Giardino privato", "Barbecue a carbone", "Oltre 12 posti a sedere all'aperto su più tavoli", "Sedie sdraio"],
        },
        {
          title: "Parcheggio",
          items: ["Due posti auto privati gratuiti", "Spazio per scooter e biciclette", "Parcheggio libero gratuito anche fuori dalla struttura"],
        },
      ],
      familyTitle: "Per le famiglie",
      familyText: "Seggiolone, culla, sponde per il letto e fasciatoio sono disponibili senza costi aggiuntivi. Segnalaceli al momento della prenotazione, così troviamo tutto già pronto al tuo arrivo.",
      rulesTitle: "Informazioni pratiche",
      rules: [
        { label: "Soggiorno minimo", value: "2 notti in bassa stagione, 4 in alta stagione" },
        { label: "Pulizie finali", value: "99 €, da aggiungere al soggiorno" },
        { label: "Check-in", value: "dalle 15:00" },
        { label: "Check-out", value: "entro le 11:00" },
        { label: "Fumo", value: "consentito solo all'esterno" },
        { label: "Animali", value: "taglia piccola e media, con un lieve supplemento sulle pulizie" },
        { label: "Feste", value: "non consentite" },
        { label: "Cauzione", value: "500 €, da versare in struttura e restituita a fine soggiorno" },
      ],
    },
    location: {
      eyebrow: "Dove siamo",
      title: "Il mare è appena fuori",
      text: "A pochi passi dal Mare Adriatico, Bellavista Domus offre un soggiorno costiero autentico a Torre a Mare, restando vicina a Bari e al meglio della Puglia.",
      mapEyebrow: "Sulla mappa",
      mapTitle: "Dove ci trovi",
      mapShow: "Mostra la mappa",
      mapPrivacy: "Caricando la mappa, Google riceve il tuo indirizzo IP.",
      mapOpen: "Apri in Google Maps",
      distances: [
        { value: "10 m", label: "dalla spiaggia" },
        { value: "5 min", label: "a piedi dal porticciolo" },
        { value: "15 min", label: "in auto da Bari" },
        { value: "25 min", label: "dall'aeroporto di Bari" },
      ],
      exploreEyebrow: "Nei dintorni",
      exploreTitle: "Scopri la Puglia",
      places: [
        { key: "torreamare", name: "Torre a Mare", desc: "Il borgo marinaro dove si trova Bellavista Domus.", link: "/torre-a-mare.html", linkLabel: "Cosa vedere a Torre a Mare" },
        { key: "bari", name: "Bari", desc: "Il capoluogo pugliese, tra centro storico e lungomare.", link: "/bari.html", linkLabel: "Cosa vedere a Bari" },
        { key: "polignano", name: "Polignano a Mare", desc: "Celebre per le sue scogliere a picco sul mare.", link: "/polignano-a-mare.html", linkLabel: "Cosa vedere a Polignano a Mare" },
        { key: "monopoli", name: "Monopoli", desc: "Porto storico e centro antico affacciato sull'Adriatico.", link: "/monopoli.html", linkLabel: "Cosa vedere a Monopoli" },
        { key: "alberobello", name: "Alberobello", desc: "Patrimonio UNESCO, famosa per i trulli.", link: "/alberobello.html", linkLabel: "Cosa vedere ad Alberobello" },
        { key: "castellana", name: "Grotte di Castellana", desc: "Sessanta metri sottoterra, tra stalattiti e alabastro.", link: "/grotte-di-castellana.html", linkLabel: "Come visitarle" },
        { key: "valleditria", name: "Valle d'Itria", desc: "Locorotondo, Cisternino, Martina Franca e Ostuni.", link: "/valle-d-itria.html", linkLabel: "Il giro in una giornata" },
        { key: "matera", name: "Matera", desc: "I Sassi, patrimonio UNESCO, poco più di un'ora.", link: "/matera.html", linkLabel: "Organizzare la visita" },
      ],
    },
    /* Domande frequenti. Ogni risposta deve restare allineata al blocco
       JSON-LD FAQPage in index.html: se cambia una risposta qui, va
       cambiata anche lì, altrimenti dichiari a Google una cosa e ne
       mostri un'altra. */
    faq: {
      eyebrow: "Domande frequenti",
      title: "Le risposte alle domande più comuni",
      text: "Se non trovi quello che cerchi, scrivici: rispondiamo di solito entro poche ore.",
      items: [
        { q: "Conviene prenotare direttamente?",
          a: "Sì: se prenoti direttamente con noi, via email, WhatsApp o con il modulo del sito, hai fino al 25% di sconto rispetto alle tariffe di Booking.com e Airbnb per le stesse date, perché non paghi le commissioni delle piattaforme. La percentuale esatta dipende dalle date: te la confermiamo nel preventivo." },
        { q: "Quante persone può ospitare la casa?",
          a: "Fino a 7 ospiti in 3 camere da letto: due camere con letto matrimoniale e una terza con un letto a una piazza e mezza più un letto a castello. I bagni sono due, entrambi con doccia." },
        { q: "Quanto dista davvero il mare?",
          a: "Dieci metri, con una conca sabbiosa proprio davanti alla casa. Si attraversa la strada e si è sulla spiaggia libera, dove sabbia e scogli si alternano. Il mare si vede da due delle tre camere da letto, e si sente la sera con le finestre aperte." },
        { q: "Qual è il soggiorno minimo?",
          a: "Due notti in bassa stagione e quattro notti in alta stagione." },
        { q: "A che ora sono il check-in e il check-out?",
          a: "Il check-in è dalle 15:00, il check-out entro le 11:00. Se hai un volo o un treno con orari difficili, scrivici: cerchiamo di venirti incontro quando il calendario lo permette." },
        { q: "Le pulizie finali sono incluse?",
          a: "No, si aggiungono al costo del soggiorno e costano 99 €. È un importo unico, indipendente dalla durata del soggiorno e dal numero di ospiti." },
        { q: "È prevista una cauzione?",
          a: "Sì, 500 €, da versare all'arrivo in struttura. Viene restituita per intero alla fine del soggiorno, salvo danni." },
        { q: "Si paga la tassa di soggiorno?",
          a: "Sì, si versa in struttura ed è dovuta al Comune di Bari, non a noi. Il regolamento comunale prevede esenzioni — per i minori e oltre un certo numero di notti consecutive — quindi l'importo esatto te lo confermiamo al momento della prenotazione, in base a quanti siete e quanto vi fermate." },
        { q: "Lenzuola e asciugamani sono inclusi?",
          a: "Sì, lenzuola e asciugamani sono inclusi e già pronti al tuo arrivo. In casa trovi anche sapone, asciugacapelli, lavatrice e stendibiancheria." },
        { q: "C'è il parcheggio?",
          a: "Sì, due posti auto privati e gratuiti all'interno della proprietà, con spazio anche per scooter e biciclette. Fuori dalla struttura il parcheggio è libero e gratuito." },
        { q: "Sono ammessi gli animali?",
          a: "Sì, cani e gatti di taglia piccola e media sono benvenuti, con un lieve supplemento sulle pulizie. Segnalacelo al momento della prenotazione." },
        { q: "Si può fumare?",
          a: "Solo all'esterno. Il giardino e gli spazi all'aperto sono a disposizione; all'interno della casa non si fuma." },
        { q: "C'è l'aria condizionata?",
          a: "Sì, in tutte e tre le camere da letto e in salotto, con funzione sia di raffrescamento sia di riscaldamento. La casa è quindi confortevole anche fuori stagione." },
        { q: "Com'è la connessione internet?",
          a: "Wi-Fi in fibra fino a 500 Mbps in tutta la casa. È una connessione adatta anche a chi deve lavorare o fare videochiamate durante il soggiorno." },
        { q: "Avete attrezzature per bambini piccoli?",
          a: "Sì: seggiolone, culla, sponde per il letto e fasciatoio, senza costi aggiuntivi. Vanno però richiesti al momento della prenotazione, così troviamo tutto già pronto al tuo arrivo." },
        { q: "Si possono organizzare feste o eventi?",
          a: "No, feste ed eventi non sono consentiti. La casa è pensata per famiglie e gruppi che cercano tranquillità, e ci teniamo al rapporto con il vicinato." },
        { q: "C'è la piscina?",
          a: "Non ancora: una piscina è in progetto per l'estate 2027. Oggi la casa punta su altro — dieci metri dal mare, con la conca sabbiosa davanti, e un giardino privato con oltre 12 posti a sedere all'aperto e il barbecue. Se stai valutando un soggiorno nell'estate 2027, scrivici prima di prenotare: ti diciamo a che punto sono i lavori, così non prenoti su un'aspettativa." },
        { q: "Come si arriva a Torre a Mare?",
          a: "In auto si esce a Torre a Mare centro e si è a casa in due minuti; dall'aeroporto di Bari sono circa 20 minuti, 25 con traffico. Con i mezzi pubblici il modo più semplice è l'autobus 12 (o 12/) dalla stazione centrale di Bari. Una volta qui, per la spiaggia e il borgo l'auto non serve; per la spesa e i servizi sì, sono a circa cinque minuti.",
          href: "/come-arrivare.html", linkLabel: "Tutti i dettagli su come arrivare" },
      ],
    },
    booking: {
      eyebrow: "Prenota",
      title: "Pronto a svegliarti con il mare davanti?",
      /* La ragione dello sconto è scritta, non promessa: prenotando qui non
         c'è la commissione della piattaforma. È una frase da mantenere
         davvero — se il prezzo diretto non è più basso, è pubblicità
         ingannevole (vedi il commento su "promo"). Prezzi diversi sul sito
         si possono fare: in Italia le clausole di parity rate sono nulle per
         legge dal 2017 (L. 124/2017, art. 1 c. 166), e nell'UE il Digital
         Markets Act vieta a Booking.com di impedirli o di penalizzarli nel
         posizionamento. */
      text: "Prenota direttamente con noi via email, WhatsApp o con il modulo: rispetto alle tariffe di Booking.com e Airbnb per le stesse date hai fino al 25% di sconto, perché non paghi le commissioni delle piattaforme.",
      direct: "Scrivici e prenota diretto",
      alt: "Oppure prenota dove preferisci",
      booking: "Booking.com",
      airbnb: "Airbnb",
    },
    form: {
      eyebrow: "Richiesta",
      title: "Verifica le date del tuo soggiorno",
      text: "Scrivici quando vorresti venire e quanti siete: ti rispondiamo con disponibilità e prezzo, di solito entro poche ore. Se le date non sono ancora certe, lasciale in bianco e raccontacelo nel messaggio.",
      name: "Nome e cognome",
      /* Le date NON sono obbligatorie: chi cerca a gennaio per agosto non le
         ha, e un campo obbligatorio che non si può compilare fa chiudere la
         pagina invece di far scrivere. */
      arrival: "Arrivo (facoltativo)",
      departure: "Partenza (facoltativo)",
      email: "Email",
      guests: "Ospiti",
      message: "Messaggio (facoltativo)",
      consent: "Ho letto e accetto l'",
      consentLink: "informativa sulla privacy",
      submit: "Invia richiesta",
      sending: "Invio in corso…",
      /* Se l'invio fallisce l'ospite non deve restare senza strada: qui ci
         sono entrambi i recapiti, non solo l'email. */
      error: "Non è stato possibile inviare la richiesta. Scrivici direttamente a " + CONFIG.property.email + " oppure su WhatsApp al " + CONFIG.property.phone + ".",
      doneTitle: "Richiesta ricevuta",
      doneText: "Grazie! Ti rispondiamo al più presto con disponibilità e prezzo diretto, fino al 25% in meno rispetto a Booking.com e Airbnb. Per una risposta ancora più rapida, mandaci anche un messaggio su WhatsApp: il testo è già pronto.",
      honeypot: "Non compilare questo campo",
    },
    footer: {
      tagline: "Casa vacanze sul mare",
      contactTitle: "Contatti",
      infoTitle: "Informazioni",
      cis: "CIS",
      cin: "CIN",
      rights: "Tutti i diritti riservati.",
      top: "Torna su",
      privacyUrl: "/privacy.html",
      ospiti: "Guida per gli ospiti",
      ospitiUrl: "/ospiti.html",
    },
    /* Calendario: i testi dichiarano apertamente il limite della fonte.
       Promettere una disponibilità "certa" quando i portali si aggiornano
       ogni poche ore significa far trovare a qualcuno un no dopo un sì. */
    calendario: {
      eyebrow: "Disponibilità",
      title: "Le tue date sono libere?",
      text: "Il calendario segna le notti già prenotate. È aggiornato dai portali ogni poche ore, quindi consideralo un'indicazione: la conferma definitiva te la diamo noi.",
      caricamento: "Sto leggendo il calendario…",
      errore: "In questo momento non riesco a leggere il calendario. Scrivici le date e ti rispondiamo noi.",
      libero: "Libero",
      occupato: "Occupato",
      precedente: "Mese precedente",
      successivo: "Mese successivo",
      mesi: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"],
      giorni: ["L","M","M","G","V","S","D"],
      giorniEstesi: ["lunedì","martedì","mercoledì","giovedì","venerdì","sabato","domenica"],
      esempio: "Dati di esempio — in locale il calendario vero non è disponibile",
      guidaArrivo: "Tocca il giorno di arrivo, poi quello di partenza: le date passano da sole nel modulo di richiesta.",
      guidaPartenza: "Arrivo il {data}. Ora tocca il giorno di partenza.",
      conflitto: "Tra queste date c'è una notte già prenotata: scegli un'altra partenza o un altro arrivo.",
      dal: "Dal", al: "al", notte: "notte", notti: "notti",
      arrivoAria: "arrivo", partenzaAria: "partenza",
      richiedi: "Richiedi queste date",
      annulla: "Cancella le date",
    },
    stickyCta: "Verifica disponibilità",
    /* Il messaggio precompilato di WhatsApp e la descrizione per gli screen
       reader vivono qui e non nel componente: un ospite inglese che tocca il
       pulsante non deve ritrovarsi a scrivere in italiano. */
    whatsapp: {
      aria: "Scrivici su WhatsApp: fino al 25% di sconto prenotando diretto",
      message: "Ciao! Vorrei prenotare direttamente Bellavista Domus con lo sconto fino al 25%. Mi dici disponibilità e prezzo per queste date: ",
    },
    /* Promozione della prenotazione diretta (settembre 2026). Francesco l'ha
       voluta deliberatamente insistente: compare in molti punti della home e
       in tutte le guide. Due regole da non perdere:
       1. "Fino al" deve restare vero: in alcune date lo sconto rispetto alle
          tariffe di Booking.com e Airbnb arriva davvero al 25%. Se non è più
          così, la cifra si abbassa qui, nelle FAQ (anche nel JSON-LD delle due
          home), nelle meta description e nelle 18 guide. Un vantaggio di
          prezzo annunciato e non reale è pubblicità ingannevole (Codice del
          Consumo, art. 21 c. 1 lett. d).
       2. Nessun testo invita a mandare dati di pagamento o documenti via
          email o WhatsApp. */
    promo: {
      cifra: "−25%",
      chip: "fino a −25%",
      barraLunga: "Fino al 25% di sconto se prenoti direttamente, via email o WhatsApp, rispetto alle tariffe di Booking.com e Airbnb",
      barraMedia: "Fino al 25% di sconto prenotando diretto rispetto a Booking.com e Airbnb",
      barraBreve: "prenotando diretto",
      hero: "Fino al 25% di sconto se prenoti direttamente, rispetto alle tariffe di Booking.com e Airbnb.",
      heroCta: "Scrivici su WhatsApp",
      fino: "Fino al",
      percento: "25%",
      sconto: "di sconto",
      fasciaAlto: "Fino al 25% di sconto se prenoti direttamente con noi, rispetto alle tariffe di Booking.com e Airbnb.",
      fasciaRecensioni: "Vuoi essere il prossimo ospite? Prenota diretto e paghi fino al 25% in meno rispetto a Booking.com e Airbnb.",
      modulo: "Richiedi un preventivo",
      moduloTesto: "Fino al 25% di sconto rispetto a Booking.com e Airbnb. Preferisci scriverci subito?",
      nota: "La percentuale esatta dipende dalle date: te la confermiamo nel preventivo.",
      calendario: "Prenotando diretto paghi fino al 25% in meno rispetto a Booking.com e Airbnb.",
      footer: "Prenota diretto: fino al 25% di sconto rispetto a Booking.com e Airbnb.",
      whatsapp: "WhatsApp",
      email: "Email",
      emailOggetto: "Prenotazione diretta Bellavista Domus",
      emailTesto: "Ciao, vorrei prenotare direttamente Bellavista Domus con lo sconto fino al 25%.\n\nArrivo:\nPartenza:\nNumero di ospiti:\n",
      /* Dopo l'invio del modulo: il messaggio WhatsApp arriva già scritto,
         con il nome e le date appena inseriti, così Francesco lo collega
         subito alla richiesta. */
      dopoModulo: "Continua su WhatsApp",
      dopoModuloMessaggio: "Ciao, sono {nome}. Ho appena inviato una richiesta dal sito{date} (ospiti: {ospiti}). Vorrei prenotare diretto con lo sconto: mi confermi disponibilità e prezzo?",
      dopoModuloDate: ", dal {arrivo} al {partenza}",
    },
    photoPlaceholder: "Fotografia in arrivo",
    cookieBanner: {
      ariaLabel: "Consenso cookie",
      text: "Usiamo Google Analytics solo se acconsenti, per capire come viene usato il sito. Nessun cookie di profilazione.",
      linkLabel: "Maggiori informazioni",
      reject: "Rifiuta",
      accept: "Accetta",
    },
  },
  en: {
    nav: { home: "Home", house: "The House", gallery: "Gallery", location: "Location", explore: "Nearby", contact: "Contact", book: "Book now" },
    topbar: { address: "Open the location on Google Maps", phone: "Call Bellavista Domus", email: "Email Bellavista Domus" },
    hero: {
      title: "Bellavista Domus",
      subtitle: "A few steps from the sea.",
      info: `Up to ${CONFIG.property.guests} guests, ${CONFIG.property.bedrooms} bedrooms, ${CONFIG.property.bathrooms} bathrooms`,
      ctaPrimary: "Check availability",
      ctaSecondary: "Explore the house",
      scroll: "Scroll",
    },
    intro: {
      eyebrow: "Welcome",
      title: "Your stay by the Adriatic",
      text: "Wake up by the sea, slow down and experience Puglia at your own pace. Bellavista Domus is a private holiday home designed for families and groups looking for space, comfort and the sea just steps away.",
    },
    features: [
      { title: "10 m from the sea", desc: "Free public beach just outside the door." },
      { title: `Up to ${CONFIG.property.guests} guests`, desc: "Space designed for families and larger groups." },
      { title: `${CONFIG.property.bedrooms} bedrooms`, desc: "Private, comfortable rooms for everyone." },
      { title: `${CONFIG.property.bathrooms} bathrooms`, desc: "Comfort and practicality for the whole group." },
      { title: "Private parking", desc: "A reserved parking space, no stress." },
      { title: "Outdoor spaces", desc: "Balconies and a barbecue area for outdoor living." },
    ],
    house: {
      eyebrow: "The property",
      title: "The House",
      text: "Bellavista Domus is a whole house, designed for those who want to share their time in Puglia with family or a group of friends, without giving up space and privacy.",
      items: {
        living: "Living room",
        bedroom: "Bedrooms",
        kitchen: "Full kitchen",
        bathroom: "Bathrooms",
        balcony: "Balconies",
        outdoor: "Outdoor spaces",
        parking: "Private parking",
      },
    },
    gallery: { eyebrow: "Photographs", title: "Gallery" },
    /* Stesse recensioni della versione italiana, nella lingua in cui le
       hanno scritte gli ospiti: quella di Gaetana resta in italiano con la
       traduzione sotto. Tradurla e basta la farebbe sembrare scritta da noi. */
    testimonial: {
      title: "What our guests say",
      translationLabel: "Read the English translation",
      note: "Genuine reviews from guests who stayed here, reproduced in full from the platforms they booked on. Each one links to the house's page on Airbnb or Booking.com, where the original can be read.",
      reviews: [
        { platform: "airbnb", author: "Renáta", when: "September 2026", iso: "2026-09", stars: 5, rating: "Rated 5 out of 5", title: null, lang: "en",
          quote: "A wonderful place to stay – everything was perfect! The rooms are huge and spacious, with a large communal area that creates a really warm and welcoming atmosphere. The house also has a beautiful garden and a large terrace, which was perfect for relaxing and enjoying the surroundings.\nThe kitchen is fully equipped, and the whole house is spotlessly clean and has such a lovely atmosphere. It is a charming seaside home.\nWe were also welcomed with a lovely welcome package upon arrival, which was such a thoughtful touch.\nFrancesco was incredibly kind, helpful, and attentive, and we could always count on him whenever we needed anything.\nWe had a fantastic stay and would wholeheartedly recommend this beautiful place! ❤️",
          translation: null,
          source: "Read on Airbnb" },
        { platform: "booking", author: "Angela", when: "September 2026", iso: "2026-09", score: "9/10", rating: "Scored 9 out of 10", title: "Fantastic!", lang: "en",
          quote: "The villa was a perfect location for my needs,, close to family and a few steps from the sea. The host Francesco was amazing, very attentive and prompt\nIt's a perfect villa for a family, beautiful garden and very comfortable interior with a full kitchen , with all the amenities needed I will definitely be back.",
          translation: null,
          source: "Read on Booking.com" },
        { platform: "airbnb", author: "Gaetana", when: "August 2026", iso: "2026-08", stars: 5, rating: "Rated 5 out of 5", title: null, lang: "it",
          quote:
            "Ci siamo trovati benissimo in 6, spazi ampi, casa completa di tutto e camere con aria condizionata, terrazzino esterno stupendo. Francesco è stato gentilissimo e disponibile per qualsiasi dubbio riguardo la casa e non solo. Ci è sembrato di essere a casa, con il vantaggio di essere a due passi dal mare. Consigliatissimo, spero di poterci tornare presto",
          translation:
            "The six of us had a wonderful stay: plenty of room, a house with everything you need, air conditioning in the bedrooms and a beautiful terrace. Francesco was extremely kind and happy to answer any question, about the house and beyond. It felt like being at home, with the sea a couple of steps away. Highly recommended, I hope to come back soon.",
          source: "Read on Airbnb" },
      ],
    },
    amenities: {
      eyebrow: "Amenities",
      title: "What you will find inside",
      text: "Everything you need for a week with family or friends, without having to buy anything on arrival.",
      bedsTitle: "Sleeping arrangements",
      beds: [
        { room: "Bedroom 1", detail: "Double bed", places: "2 guests" },
        { room: "Bedroom 2", detail: "Double bed", places: "2 guests" },
        { room: "Bedroom 3", detail: "Small double bed and bunk bed", places: "3 guests" },
      ],
      groups: [
        {
          title: "Kitchen",
          items: ["Oven", "Air fryer", "Dishwasher", "Fridge with freezer", "Coffee machine", "Pots and pans", "Plates, glasses, cutlery and cups"],
        },
        {
          title: "Climate",
          items: ["Air conditioning with heating in all three bedrooms", "Air conditioning with heating in the living room"],
        },
        {
          title: "Bathrooms and linen",
          items: ["Two bathrooms, both with a shower", "Bed linen and towels included", "Washing machine", "Clothes airer", "Hairdryer", "Soap"],
        },
        {
          title: "Connectivity",
          items: ["Fibre Wi-Fi up to 500 Mbps", "Living room TV with Netflix and other streaming services"],
        },
        {
          title: "Outdoor spaces",
          items: ["Private garden", "Charcoal barbecue", "Over 12 outdoor seats across several tables", "Sun loungers"],
        },
        {
          title: "Parking",
          items: ["Two free private parking spaces", "Room for scooters and bicycles", "Free on-street parking outside the property"],
        },
      ],
      familyTitle: "For families",
      familyText: "A high chair, cot, bed rails and a changing mat are available at no extra cost. Just tell us when you book, and everything will be ready when you arrive.",
      rulesTitle: "Practical information",
      rules: [
        { label: "Minimum stay", value: "2 nights in low season, 4 in high season" },
        { label: "Final cleaning", value: "€99, added to the stay" },
        { label: "Check-in", value: "from 3:00 pm" },
        { label: "Check-out", value: "by 11:00 am" },
        { label: "Smoking", value: "outdoors only" },
        { label: "Pets", value: "small and medium sized, with a small cleaning surcharge" },
        { label: "Parties", value: "not allowed" },
        { label: "Deposit", value: "€500, payable on arrival and returned at the end of your stay" },
      ],
    },
    location: {
      eyebrow: "Where we are",
      title: "The sea is just outside",
      text: "Just a few steps from the Adriatic Sea, Bellavista Domus offers an authentic coastal stay in Torre a Mare, while remaining close to Bari and the best of Puglia.",
      mapEyebrow: "On the map",
      mapTitle: "Where to find us",
      mapShow: "Show the map",
      mapPrivacy: "Loading the map shares your IP address with Google.",
      mapOpen: "Open in Google Maps",
      distances: [
        { value: "10 m", label: "to the beach" },
        { value: "5 min", label: "walk to the harbour" },
        { value: "15 min", label: "drive to Bari" },
        { value: "25 min", label: "from Bari airport" },
      ],
      exploreEyebrow: "Nearby",
      exploreTitle: "Explore Puglia",
      places: [
        { key: "torreamare", name: "Torre a Mare", desc: "The seaside village where Bellavista Domus is located.", link: "/torre-a-mare-en.html", linkLabel: "What to see in Torre a Mare" },
        { key: "bari", name: "Bari", desc: "The capital of Puglia, historic centre and seafront.", link: "/bari-en.html", linkLabel: "What to see in Bari" },
        { key: "polignano", name: "Polignano a Mare", desc: "Famous for its cliffs overlooking the sea.", link: "/polignano-a-mare-en.html", linkLabel: "What to see in Polignano a Mare" },
        { key: "monopoli", name: "Monopoli", desc: "Historic port and old town facing the Adriatic.", link: "/monopoli-en.html", linkLabel: "What to see in Monopoli" },
        { key: "alberobello", name: "Alberobello", desc: "UNESCO World Heritage site, famous for its trulli.", link: "/alberobello-en.html", linkLabel: "What to see in Alberobello" },
        { key: "castellana", name: "Castellana Caves", desc: "Sixty metres underground, among stalactites and alabaster.", link: "/grotte-di-castellana-en.html", linkLabel: "How to visit" },
        { key: "valleditria", name: "Valle d'Itria", desc: "Locorotondo, Cisternino, Martina Franca and Ostuni.", link: "/valle-d-itria-en.html", linkLabel: "A day out" },
        { key: "matera", name: "Matera", desc: "The Sassi, a UNESCO site, a little over an hour away.", link: "/matera-en.html", linkLabel: "Planning the visit" },
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Answers to the most common questions",
      text: "If you cannot find what you are looking for, write to us: we usually reply within a few hours.",
      items: [
        { q: "Is it cheaper to book direct?",
          a: "Yes: if you book directly with us, by email, WhatsApp or the form on this site, you get up to 25% off the Booking.com and Airbnb rates for the same dates, because you pay no platform commission. The exact percentage depends on your dates: we confirm it in your quote." },
        { q: "How many guests can the house sleep?",
          a: "Up to 7 guests in 3 bedrooms: two bedrooms with a double bed, and a third with a small double bed plus a bunk bed. There are two bathrooms, both with a shower." },
        { q: "How far is the sea, really?",
          a: "Ten metres, with a sandy cove right in front of the house. You cross the road and you are on the free public beach, where sand alternates with rocks. The sea is visible from two of the three bedrooms, and you can hear it in the evening with the windows open." },
        { q: "What is the minimum stay?",
          a: "Two nights in low season and four nights in high season." },
        { q: "What are the check-in and check-out times?",
          a: "Check-in is from 3:00 pm and check-out by 11:00 am. If your flight or train times are awkward, do write to us: we try to accommodate you whenever the calendar allows." },
        { q: "Is the final cleaning included?",
          a: "No, it is added to the cost of the stay and comes to €99. It is a single charge, regardless of how long you stay or how many of you there are." },
        { q: "Is a deposit required?",
          a: "Yes, €500, payable on arrival at the property. It is returned in full at the end of your stay, barring damage." },
        { q: "Is there a tourist tax?",
          a: "Yes. It is paid at the property and is owed to the Municipality of Bari, not to us. The municipal regulation provides exemptions — for children and beyond a certain number of consecutive nights — so we confirm the exact amount when you book, based on how many you are and how long you stay." },
        { q: "Are bed linen and towels included?",
          a: "Yes, bed linen and towels are included and ready when you arrive. You will also find soap, a hairdryer, a washing machine and a clothes airer." },
        { q: "Is there parking?",
          a: "Yes, two free private parking spaces within the property, with room for scooters and bicycles too. Outside the property, on-street parking is free and unrestricted." },
        { q: "Are pets allowed?",
          a: "Yes, small and medium sized dogs and cats are welcome, with a small cleaning surcharge. Please let us know when you book." },
        { q: "Is smoking allowed?",
          a: "Outdoors only. The garden and outdoor spaces are at your disposal; there is no smoking inside the house." },
        { q: "Is there air conditioning?",
          a: "Yes, in all three bedrooms and in the living room, with both cooling and heating. The house is therefore comfortable outside the summer season too." },
        { q: "What is the internet connection like?",
          a: "Fibre Wi-Fi up to 500 Mbps throughout the house. It is fast enough for working and video calls during your stay." },
        { q: "Do you have equipment for small children?",
          a: "Yes: a high chair, cot, bed rails and a changing mat, at no extra cost. Please request them when you book, so everything is ready when you arrive." },
        { q: "Can I host a party or an event?",
          a: "No, parties and events are not allowed. The house is designed for families and groups looking for peace and quiet, and we value our relationship with the neighbours." },
        { q: "Is there a swimming pool?",
          a: "Not yet: a pool is planned for summer 2027. Today the house offers something else — ten metres from the sea, with a sandy cove in front, and a private garden with over 12 outdoor seats and a barbecue. If you are considering a stay in summer 2027, write to us before booking: we will tell you where the works stand, so you are not booking on an expectation." },
        { q: "How do I get to Torre a Mare?",
          a: "By car, take the Torre a Mare centro exit and you are at the house in two minutes; from Bari airport it is about 20 minutes, 25 with traffic. By public transport the simplest way is bus 12 (or 12/) from Bari central station. Once here, you will not need a car for the beach and the village; for shopping and errands you will, as they are about five minutes away.",
          href: "/come-arrivare-en.html", linkLabel: "Full details on getting here" },
      ],
    },
    booking: {
      eyebrow: "Book",
      title: "Ready to wake up by the sea?",
      text: "Book directly with us by email, WhatsApp or the form: compared with the Booking.com and Airbnb rates for the same dates you get up to 25% off, because you pay no platform commission.",
      direct: "Write to us and book direct",
      alt: "Or book wherever you prefer",
      booking: "Booking.com",
      airbnb: "Airbnb",
    },
    form: {
      eyebrow: "Enquiry",
      title: "Check the dates of your stay",
      text: "Tell us when you would like to come and how many you are: we reply with availability and price, usually within a few hours. If your dates are not fixed yet, leave them blank and tell us in the message.",
      name: "Full name",
      arrival: "Arrival (optional)",
      departure: "Departure (optional)",
      email: "Email",
      guests: "Guests",
      message: "Message (optional)",
      consent: "I have read and accept the",
      consentLink: "privacy policy",
      submit: "Send enquiry",
      sending: "Sending…",
      error: "We could not send your enquiry. Please write to us directly at " + CONFIG.property.email + " or on WhatsApp at " + CONFIG.property.phone + ".",
      doneTitle: "Enquiry received",
      doneText: "Thank you! We will get back to you shortly with availability and your direct price, up to 25% less than on Booking.com and Airbnb. For an even faster reply, send us a WhatsApp message too: the text is ready to go.",
      honeypot: "Do not fill in this field",
    },
    footer: {
      tagline: "Seafront holiday home",
      contactTitle: "Contact",
      infoTitle: "Information",
      cis: "CIS",
      cin: "CIN",
      rights: "All rights reserved.",
      top: "Back to top",
      privacyUrl: "/privacy-en.html",
      ospiti: "Guest guide",
      ospitiUrl: "/ospiti-en.html",
    },
    calendario: {
      eyebrow: "Availability",
      title: "Are your dates free?",
      text: "The calendar marks the nights already booked. It is refreshed from the platforms every few hours, so treat it as a guide: the final confirmation comes from us.",
      caricamento: "Loading the calendar…",
      errore: "We cannot read the calendar right now. Send us your dates and we will reply.",
      libero: "Free",
      occupato: "Booked",
      precedente: "Previous month",
      successivo: "Next month",
      mesi: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      giorni: ["M","T","W","T","F","S","S"],
      giorniEstesi: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      esempio: "Sample data — the real calendar is not available locally",
      guidaArrivo: "Tap your arrival day, then your departure day: the dates go straight into the request form.",
      guidaPartenza: "Arrival on {data}. Now tap your departure day.",
      conflitto: "There is a night already booked between these dates: choose another departure or arrival.",
      dal: "From", al: "to", notte: "night", notti: "nights",
      arrivoAria: "arrival", partenzaAria: "departure",
      richiedi: "Request these dates",
      annulla: "Clear dates",
    },
    stickyCta: "Check availability",
    whatsapp: {
      aria: "Message us on WhatsApp: up to 25% off when you book direct",
      message: "Hello! I would like to book Bellavista Domus directly with the discount of up to 25%. Could you tell me availability and price for these dates: ",
    },
    promo: {
      cifra: "−25%",
      chip: "up to −25%",
      barraLunga: "Up to 25% off when you book direct, by email or WhatsApp, compared with Booking.com and Airbnb rates",
      barraMedia: "Up to 25% off when you book direct, compared with Booking.com and Airbnb",
      barraBreve: "when you book direct",
      hero: "Up to 25% off when you book direct, compared with Booking.com and Airbnb rates.",
      heroCta: "Message us on WhatsApp",
      fino: "Up to",
      percento: "25%",
      sconto: "off",
      fasciaAlto: "Up to 25% off when you book directly with us, compared with Booking.com and Airbnb rates.",
      fasciaRecensioni: "Want to be our next guest? Book direct and pay up to 25% less than on Booking.com and Airbnb.",
      modulo: "Request a quote",
      moduloTesto: "Up to 25% off compared with Booking.com and Airbnb. Prefer to message us right away?",
      nota: "The exact percentage depends on your dates: we confirm it in your quote.",
      calendario: "Book direct and pay up to 25% less than on Booking.com and Airbnb.",
      footer: "Book direct: up to 25% off compared with Booking.com and Airbnb.",
      whatsapp: "WhatsApp",
      email: "Email",
      emailOggetto: "Direct booking Bellavista Domus",
      emailTesto: "Hello, I would like to book Bellavista Domus directly with the discount of up to 25%.\n\nArrival:\nDeparture:\nNumber of guests:\n",
      dopoModulo: "Continue on WhatsApp",
      dopoModuloMessaggio: "Hello, I am {nome}. I have just sent an enquiry from the website{date} (guests: {ospiti}). I would like to book direct with the discount: could you confirm availability and price?",
      dopoModuloDate: ", from {arrivo} to {partenza}",
    },
    photoPlaceholder: "Photo coming soon",
    cookieBanner: {
      ariaLabel: "Cookie consent",
      text: "We only use Google Analytics if you consent, to understand how the site is used. No profiling cookies.",
      linkLabel: "Learn more",
      reject: "Decline",
      accept: "Accept",
    },
  },
  /* Francese e tedesco (settembre 2026): stessa struttura a chiavi di it/en.
     Nel testo "25 %" porta uno spazio che non va a capo ( ), come vuole
     la tipografia francese e tedesca. Le recensioni restano nella lingua
     originale, con la traduzione sotto. */
  fr: {
    luogo: "Torre a Mare, Bari, Pouilles",
    nav: { home: "Accueil", house: "La maison", gallery: "Galerie", location: "Emplacement", explore: "Alentours", contact: "Contact", book: "Réserver" },
    topbar: { address: "Ouvrir l'emplacement dans Google Maps", phone: "Appeler Bellavista Domus", email: "Écrire à Bellavista Domus" },
    hero: {
      title: "Bellavista Domus",
      subtitle: "À quelques pas de la mer.",
      info: `Jusqu'à ${CONFIG.property.guests} personnes, ${CONFIG.property.bedrooms} chambres, ${CONFIG.property.bathrooms} salles de bains`,
      ctaPrimary: "Vérifier les disponibilités",
      ctaSecondary: "Découvrir la maison",
      scroll: "Défiler",
    },
    intro: {
      eyebrow: "Bienvenue",
      title: "Votre séjour au bord de l'Adriatique",
      text: "Réveillez-vous face à la mer, ralentissez et vivez les Pouilles à votre rythme. Bellavista Domus est une maison de vacances privée, pensée pour les familles et les groupes qui recherchent de l'espace, du confort et la mer à deux pas.",
    },
    features: [
      { title: "À 10 m de la mer", desc: "Plage publique gratuite à deux pas de la porte." },
      { title: `Jusqu'à ${CONFIG.property.guests} personnes`, desc: "Des espaces pensés pour les familles et les groupes." },
      { title: `${CONFIG.property.bedrooms} chambres`, desc: "Des pièces privées et confortables pour chacun." },
      { title: `${CONFIG.property.bathrooms} salles de bains`, desc: "Confort et praticité pour tout le groupe." },
      { title: "Parking privé", desc: "Une place réservée, sans souci." },
      { title: "Espaces extérieurs", desc: "Balcons et coin barbecue pour vivre dehors." },
    ],
    house: {
      eyebrow: "La propriété",
      title: "La maison",
      text: "Bellavista Domus est une maison entière, pensée pour ceux qui veulent partager leur séjour dans les Pouilles en famille ou entre amis, sans renoncer à l'espace ni à l'intimité.",
      items: {
        living: "Séjour",
        bedroom: "Chambres",
        kitchen: "Cuisine équipée",
        bathroom: "Salles de bains",
        balcony: "Balcons",
        outdoor: "Espaces extérieurs",
        parking: "Parking privé",
      },
    },
    gallery: { eyebrow: "Photographies", title: "Galerie" },
    testimonial: {
      title: "Ce qu'en disent nos voyageurs",
      translationLabel: "Lire la traduction en français",
      note: "Avis authentiques de voyageurs qui ont séjourné ici, reproduits intégralement depuis les plateformes sur lesquelles ils ont réservé. Chacun renvoie à la page de la maison sur Airbnb ou Booking.com, où l'on peut lire l'original.",
      reviews: [
        { platform: "airbnb", author: "Renáta", when: "septembre 2026", iso: "2026-09", stars: 5, rating: "Note de 5 sur 5", title: null, lang: "en",
          quote: "A wonderful place to stay – everything was perfect! The rooms are huge and spacious, with a large communal area that creates a really warm and welcoming atmosphere. The house also has a beautiful garden and a large terrace, which was perfect for relaxing and enjoying the surroundings.\nThe kitchen is fully equipped, and the whole house is spotlessly clean and has such a lovely atmosphere. It is a charming seaside home.\nWe were also welcomed with a lovely welcome package upon arrival, which was such a thoughtful touch.\nFrancesco was incredibly kind, helpful, and attentive, and we could always count on him whenever we needed anything.\nWe had a fantastic stay and would wholeheartedly recommend this beautiful place! ❤️",
          translation: "Un endroit merveilleux où séjourner : tout était parfait ! Les chambres sont immenses et spacieuses, avec un grand espace commun qui crée une atmosphère vraiment chaleureuse et accueillante. La maison a aussi un beau jardin et une grande terrasse, parfaite pour se détendre et profiter des environs.\nLa cuisine est entièrement équipée, toute la maison est d'une propreté impeccable et l'ambiance y est très agréable. C'est une charmante maison au bord de la mer.\nÀ notre arrivée, nous avons aussi été accueillis avec un joli panier de bienvenue, une attention vraiment délicate.\nFrancesco a été incroyablement gentil, serviable et attentionné, et nous avons toujours pu compter sur lui en cas de besoin.\nNous avons passé un séjour fantastique et recommandons de tout cœur ce magnifique endroit ! ❤️",
          source: "Lire sur Airbnb" },
        { platform: "booking", author: "Angela", when: "septembre 2026", iso: "2026-09", score: "9/10", rating: "Note de 9 sur 10", title: "Fantastic!", lang: "en",
          quote: "The villa was a perfect location for my needs,, close to family and a few steps from the sea. The host Francesco was amazing, very attentive and prompt\nIt's a perfect villa for a family, beautiful garden and very comfortable interior with a full kitchen , with all the amenities needed I will definitely be back.",
          translation: "Fantastique !\nLa villa était idéalement située pour mes besoins, près de ma famille et à quelques pas de la mer. L'hôte, Francesco, a été formidable, très attentionné et réactif.\nC'est une villa parfaite pour une famille, avec un beau jardin et un intérieur très confortable, une cuisine complète et tous les équipements nécessaires. Je reviendrai sans aucun doute.",
          source: "Lire sur Booking.com" },
        { platform: "airbnb", author: "Gaetana", when: "août 2026", iso: "2026-08", stars: 5, rating: "Note de 5 sur 5", title: null, lang: "it",
          quote:
            "Ci siamo trovati benissimo in 6, spazi ampi, casa completa di tutto e camere con aria condizionata, terrazzino esterno stupendo. Francesco è stato gentilissimo e disponibile per qualsiasi dubbio riguardo la casa e non solo. Ci è sembrato di essere a casa, con il vantaggio di essere a due passi dal mare. Consigliatissimo, spero di poterci tornare presto",
          translation:
            "Nous nous sommes très bien sentis à six : de grands espaces, une maison équipée de tout, des chambres climatisées et une magnifique petite terrasse. Francesco a été très gentil et disponible pour toutes nos questions, sur la maison et au-delà. Nous nous sommes sentis comme chez nous, avec l'avantage d'être à deux pas de la mer. Vivement recommandé, j'espère pouvoir y revenir bientôt.",
          source: "Lire sur Airbnb" },
      ],
    },
    amenities: {
      eyebrow: "Équipements",
      title: "Ce que vous trouverez sur place",
      text: "Tout le nécessaire pour une semaine en famille ou entre amis, sans rien devoir acheter en arrivant.",
      bedsTitle: "Les couchages",
      beds: [
        { room: "Chambre 1", detail: "Lit double", places: "2 places" },
        { room: "Chambre 2", detail: "Lit double", places: "2 places" },
        { room: "Chambre 3", detail: "Petit lit double et lits superposés", places: "3 places" },
      ],
      groups: [
        {
          title: "Cuisine",
          items: ["Four", "Friteuse à air", "Lave-vaisselle", "Réfrigérateur avec congélateur", "Machine à café", "Casseroles et poêles", "Assiettes, verres, couverts et tasses"],
        },
        {
          title: "Climatisation",
          items: ["Climatisation réversible (chaud/froid) dans les trois chambres", "Climatisation réversible (chaud/froid) dans le salon"],
        },
        {
          title: "Salles de bains et linge",
          items: ["Deux salles de bains, toutes deux avec douche", "Draps et serviettes inclus", "Lave-linge", "Étendoir", "Sèche-cheveux", "Savon"],
        },
        {
          title: "Connexion",
          items: ["Wi-Fi fibre jusqu'à 500 Mbit/s", "TV au salon avec Netflix et d'autres services de streaming"],
        },
        {
          title: "Espaces extérieurs",
          items: ["Jardin privé", "Barbecue au charbon de bois", "Plus de 12 places assises en plein air, sur plusieurs tables", "Chaises longues"],
        },
        {
          title: "Parking",
          items: ["Deux places de parking privées et gratuites", "De la place pour les scooters et les vélos", "Stationnement libre et gratuit également dans la rue"],
        },
      ],
      familyTitle: "Pour les familles",
      familyText: "Chaise haute, lit bébé, barrières de lit et table à langer sont disponibles sans frais supplémentaires. Signalez-le-nous au moment de la réservation, et tout sera prêt à votre arrivée.",
      rulesTitle: "Informations pratiques",
      rules: [
        { label: "Séjour minimum", value: "2 nuits en basse saison, 4 en haute saison" },
        { label: "Ménage de fin de séjour", value: "99 €, en supplément du séjour" },
        { label: "Arrivée", value: "à partir de 15h00" },
        { label: "Départ", value: "avant 11h00" },
        { label: "Tabac", value: "uniquement à l'extérieur" },
        { label: "Animaux", value: "de petite et moyenne taille, avec un léger supplément pour le ménage" },
        { label: "Fêtes", value: "non autorisées" },
        { label: "Caution", value: "500 €, à verser sur place et restituée en fin de séjour" },
      ],
    },
    location: {
      eyebrow: "Où nous sommes",
      title: "La mer est juste devant",
      text: "À quelques pas de l'Adriatique, Bellavista Domus offre un séjour authentique en bord de mer à Torre a Mare, tout près de Bari et du meilleur des Pouilles.",
      mapEyebrow: "Sur la carte",
      mapTitle: "Comment nous trouver",
      mapShow: "Afficher la carte",
      mapPrivacy: "En chargeant la carte, Google reçoit votre adresse IP.",
      mapOpen: "Ouvrir dans Google Maps",
      distances: [
        { value: "10 m", label: "de la plage" },
        { value: "5 min", label: "à pied du petit port" },
        { value: "15 min", label: "en voiture de Bari" },
        { value: "25 min", label: "de l'aéroport de Bari" },
      ],
      exploreEyebrow: "Aux alentours",
      exploreTitle: "Découvrir les Pouilles",
      places: [
        { key: "torreamare", name: "Torre a Mare", desc: "Le village de pêcheurs où se trouve Bellavista Domus.", link: "/torre-a-mare-fr.html", linkLabel: "Que voir à Torre a Mare" },
        { key: "bari", name: "Bari", desc: "La capitale des Pouilles, entre vieille ville et front de mer.", link: "/bari-fr.html", linkLabel: "Que voir à Bari" },
        { key: "polignano", name: "Polignano a Mare", desc: "Célèbre pour ses falaises à pic sur la mer.", link: "/polignano-a-mare-fr.html", linkLabel: "Que voir à Polignano a Mare" },
        { key: "monopoli", name: "Monopoli", desc: "Port historique et vieille ville face à l'Adriatique.", link: "/monopoli-fr.html", linkLabel: "Que voir à Monopoli" },
        { key: "alberobello", name: "Alberobello", desc: "Patrimoine de l'UNESCO, célèbre pour ses trulli.", link: "/alberobello-fr.html", linkLabel: "Que voir à Alberobello" },
        { key: "castellana", name: "Grottes de Castellana", desc: "Soixante mètres sous terre, entre stalactites et albâtre.", link: "/grotte-di-castellana-fr.html", linkLabel: "Comment les visiter" },
        { key: "valleditria", name: "Vallée d'Itria", desc: "Locorotondo, Cisternino, Martina Franca et Ostuni.", link: "/valle-d-itria-fr.html", linkLabel: "Le circuit en une journée" },
        { key: "matera", name: "Matera", desc: "Les Sassi, patrimoine de l'UNESCO, à un peu plus d'une heure.", link: "/matera-fr.html", linkLabel: "Organiser la visite" },
      ],
    },
    faq: {
      eyebrow: "Questions fréquentes",
      title: "Les réponses aux questions les plus courantes",
      text: "Si vous ne trouvez pas ce que vous cherchez, écrivez-nous : nous répondons généralement en quelques heures.",
      items: [
        { q: "Est-il plus avantageux de réserver en direct ?",
          a: "Oui : si vous réservez directement auprès de nous, par e-mail, WhatsApp ou avec le formulaire du site, vous avez jusqu'à 25 % de réduction par rapport aux tarifs de Booking.com et Airbnb pour les mêmes dates, car vous ne payez pas les commissions des plateformes. Le pourcentage exact dépend des dates : nous vous le confirmons dans le devis." },
        { q: "Combien de personnes la maison peut-elle accueillir ?",
          a: "Jusqu'à 7 personnes dans 3 chambres : deux chambres avec lit double et une troisième avec un petit lit double et des lits superposés. Il y a deux salles de bains, toutes deux avec douche." },
        { q: "À quelle distance se trouve vraiment la mer ?",
          a: "Dix mètres, avec une petite anse de sable juste devant la maison. On traverse la route et on est sur la plage publique, où sable et rochers alternent. La mer se voit depuis deux des trois chambres, et on l'entend le soir, fenêtres ouvertes." },
        { q: "Quelle est la durée minimale du séjour ?",
          a: "Deux nuits en basse saison et quatre nuits en haute saison." },
        { q: "À quelle heure se font l'arrivée et le départ ?",
          a: "L'arrivée se fait à partir de 15h00, le départ avant 11h00. Si votre vol ou votre train a des horaires compliqués, écrivez-nous : nous essayons de nous adapter quand le calendrier le permet." },
        { q: "Le ménage de fin de séjour est-il inclus ?",
          a: "Non, il s'ajoute au prix du séjour et coûte 99 €. C'est un montant unique, qui ne dépend ni de la durée du séjour ni du nombre de personnes." },
        { q: "Une caution est-elle demandée ?",
          a: "Oui, 500 €, à verser à l'arrivée sur place. Elle est restituée intégralement à la fin du séjour, sauf en cas de dommages." },
        { q: "Faut-il payer la taxe de séjour ?",
          a: "Oui, elle se paie sur place et elle est due à la commune de Bari, pas à nous. Le règlement municipal prévoit des exonérations — pour les mineurs et au-delà d'un certain nombre de nuits consécutives — nous vous confirmons donc le montant exact au moment de la réservation, selon le nombre de personnes et la durée du séjour." },
        { q: "Les draps et les serviettes sont-ils fournis ?",
          a: "Oui, les draps et les serviettes sont inclus et prêts à votre arrivée. Vous trouverez aussi sur place du savon, un sèche-cheveux, un lave-linge et un étendoir." },
        { q: "Y a-t-il un parking ?",
          a: "Oui, deux places de parking privées et gratuites à l'intérieur de la propriété, avec de la place aussi pour les scooters et les vélos. À l'extérieur, le stationnement est libre et gratuit." },
        { q: "Les animaux sont-ils acceptés ?",
          a: "Oui, les chiens et les chats de petite et moyenne taille sont les bienvenus, avec un léger supplément pour le ménage. Merci de nous le signaler au moment de la réservation." },
        { q: "Peut-on fumer ?",
          a: "Uniquement à l'extérieur. Le jardin et les espaces extérieurs sont à votre disposition ; on ne fume pas à l'intérieur de la maison." },
        { q: "Y a-t-il la climatisation ?",
          a: "Oui, dans les trois chambres et au salon, avec une fonction rafraîchissement et chauffage. La maison est donc confortable aussi hors saison." },
        { q: "Comment est la connexion internet ?",
          a: "Wi-Fi fibre jusqu'à 500 Mbit/s dans toute la maison. La connexion convient aussi à ceux qui doivent travailler ou faire des visioconférences pendant le séjour." },
        { q: "Avez-vous des équipements pour les jeunes enfants ?",
          a: "Oui : chaise haute, lit bébé, barrières de lit et table à langer, sans frais supplémentaires. Il faut toutefois les demander au moment de la réservation, pour que tout soit prêt à votre arrivée." },
        { q: "Peut-on organiser des fêtes ou des événements ?",
          a: "Non, les fêtes et les événements ne sont pas autorisés. La maison est pensée pour les familles et les groupes en quête de tranquillité, et nous tenons à nos bonnes relations avec le voisinage." },
        { q: "Y a-t-il une piscine ?",
          a: "Pas encore : une piscine est prévue pour l'été 2027. Aujourd'hui, la maison mise sur autre chose — la mer à dix mètres, avec l'anse de sable juste devant, et un jardin privé avec plus de 12 places assises en plein air et le barbecue. Si vous envisagez un séjour à l'été 2027, écrivez-nous avant de réserver : nous vous dirons où en sont les travaux, pour que vous ne réserviez pas sur une simple promesse." },
        { q: "Comment rejoindre Torre a Mare ?",
          a: "En voiture, on prend la sortie Torre a Mare centro et on est à la maison en deux minutes ; depuis l'aéroport de Bari, il faut environ 20 minutes, 25 avec la circulation. En transports en commun, le plus simple est le bus 12 (ou 12/) depuis la gare centrale de Bari. Une fois sur place, la voiture n'est pas nécessaire pour la plage et le village ; elle l'est pour les courses et les services, à environ cinq minutes.",
          href: "/come-arrivare-fr.html", linkLabel: "Tous les détails pour venir" },
      ],
    },
    booking: {
      eyebrow: "Réserver",
      title: "Prêt à vous réveiller face à la mer ?",
      text: "Réservez directement auprès de nous par e-mail, WhatsApp ou avec le formulaire : par rapport aux tarifs de Booking.com et Airbnb pour les mêmes dates, vous avez jusqu'à 25 % de réduction, car vous ne payez pas les commissions des plateformes.",
      direct: "Écrivez-nous et réservez en direct",
      alt: "Ou réservez où vous préférez",
      booking: "Booking.com",
      airbnb: "Airbnb",
    },
    form: {
      eyebrow: "Demande",
      title: "Vérifiez les dates de votre séjour",
      text: "Dites-nous quand vous aimeriez venir et combien vous êtes : nous vous répondons avec les disponibilités et le prix, généralement en quelques heures. Si vos dates ne sont pas encore fixées, laissez-les vides et précisez-le dans le message.",
      name: "Nom et prénom",
      arrival: "Arrivée (facultatif)",
      departure: "Départ (facultatif)",
      email: "E-mail",
      guests: "Personnes",
      message: "Message (facultatif)",
      consent: "J'ai lu et j'accepte la",
      consentLink: "politique de confidentialité",
      submit: "Envoyer la demande",
      sending: "Envoi en cours…",
      error: "Impossible d'envoyer la demande. Écrivez-nous directement à " + CONFIG.property.email + " ou sur WhatsApp au " + CONFIG.property.phone + ".",
      doneTitle: "Demande reçue",
      doneText: "Merci ! Nous vous répondons au plus vite avec les disponibilités et le prix direct, jusqu'à 25 % moins cher que sur Booking.com et Airbnb. Pour une réponse encore plus rapide, envoyez-nous aussi un message sur WhatsApp : le texte est déjà prêt.",
      honeypot: "Ne pas remplir ce champ",
    },
    footer: {
      tagline: "Maison de vacances en bord de mer",
      contactTitle: "Contact",
      infoTitle: "Informations",
      cis: "CIS",
      cin: "CIN",
      rights: "Tous droits réservés.",
      top: "Haut de page",
      privacyUrl: "/privacy-fr.html",
      ospiti: "Guide des voyageurs",
      ospitiUrl: "/ospiti-fr.html",
    },
    calendario: {
      eyebrow: "Disponibilités",
      title: "Vos dates sont-elles libres ?",
      text: "Le calendrier indique les nuits déjà réservées. Il est mis à jour depuis les plateformes toutes les quelques heures : considérez-le comme une indication, la confirmation définitive vient de nous.",
      caricamento: "Lecture du calendrier…",
      errore: "Impossible de lire le calendrier pour le moment. Envoyez-nous vos dates et nous vous répondrons.",
      libero: "Libre",
      occupato: "Réservé",
      precedente: "Mois précédent",
      successivo: "Mois suivant",
      mesi: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
      giorni: ["L","M","M","J","V","S","D"],
      giorniEstesi: ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"],
      esempio: "Données d'exemple — le vrai calendrier n'est pas disponible en local",
      guidaArrivo: "Touchez le jour d'arrivée, puis celui du départ : les dates passent directement dans le formulaire de demande.",
      guidaPartenza: "Arrivée le {data}. Touchez maintenant le jour du départ.",
      conflitto: "Une nuit est déjà réservée entre ces dates : choisissez un autre départ ou une autre arrivée.",
      dal: "Du", al: "au", notte: "nuit", notti: "nuits",
      arrivoAria: "arrivée", partenzaAria: "départ",
      richiedi: "Demander ces dates",
      annulla: "Effacer les dates",
    },
    stickyCta: "Vérifier les disponibilités",
    whatsapp: {
      aria: "Écrivez-nous sur WhatsApp : jusqu'à 25 % de réduction en réservant en direct",
      message: "Bonjour ! Je souhaite réserver Bellavista Domus en direct avec la réduction allant jusqu'à 25 %. Pourriez-vous m'indiquer les disponibilités et le prix pour ces dates : ",
    },
    promo: {
      cifra: "−25%",
      chip: "jusqu'à −25%",
      barraLunga: "Jusqu'à 25 % de réduction si vous réservez en direct, par e-mail ou WhatsApp, par rapport aux tarifs de Booking.com et Airbnb",
      barraMedia: "Jusqu'à 25 % de réduction en réservant en direct, par rapport à Booking.com et Airbnb",
      barraBreve: "en réservant en direct",
      hero: "Jusqu'à 25 % de réduction si vous réservez en direct, par rapport aux tarifs de Booking.com et Airbnb.",
      heroCta: "Écrivez-nous sur WhatsApp",
      fino: "Jusqu'à",
      percento: "25 %",
      sconto: "de réduction",
      fasciaAlto: "Jusqu'à 25 % de réduction si vous réservez directement auprès de nous, par rapport aux tarifs de Booking.com et Airbnb.",
      fasciaRecensioni: "Envie d'être nos prochains voyageurs ? Réservez en direct et payez jusqu'à 25 % de moins que sur Booking.com et Airbnb.",
      modulo: "Demander un devis",
      moduloTesto: "Jusqu'à 25 % de réduction par rapport à Booking.com et Airbnb. Vous préférez nous écrire tout de suite ?",
      nota: "Le pourcentage exact dépend des dates : nous vous le confirmons dans le devis.",
      calendario: "En réservant en direct, vous payez jusqu'à 25 % de moins que sur Booking.com et Airbnb.",
      footer: "Réservez en direct : jusqu'à 25 % de réduction par rapport à Booking.com et Airbnb.",
      whatsapp: "WhatsApp",
      email: "E-mail",
      emailOggetto: "Réservation directe Bellavista Domus",
      emailTesto: "Bonjour, je souhaite réserver Bellavista Domus en direct avec la réduction allant jusqu'à 25 %.\n\nArrivée :\nDépart :\nNombre de personnes :\n",
      dopoModulo: "Continuer sur WhatsApp",
      dopoModuloMessaggio: "Bonjour, je suis {nome}. Je viens d'envoyer une demande depuis le site{date} (personnes : {ospiti}). Je souhaite réserver en direct avec la réduction : pourriez-vous me confirmer les disponibilités et le prix ?",
      dopoModuloDate: ", du {arrivo} au {partenza}",
    },
    photoPlaceholder: "Photo à venir",
    cookieBanner: {
      ariaLabel: "Consentement aux cookies",
      text: "Nous utilisons Google Analytics uniquement si vous y consentez, pour comprendre comment le site est utilisé. Aucun cookie de profilage.",
      linkLabel: "En savoir plus",
      reject: "Refuser",
      accept: "Accepter",
    },
  },
  de: {
    luogo: "Torre a Mare, Bari, Apulien",
    nav: { home: "Start", house: "Das Haus", gallery: "Galerie", location: "Lage", explore: "Umgebung", contact: "Kontakt", book: "Jetzt buchen" },
    topbar: { address: "Lage in Google Maps öffnen", phone: "Bellavista Domus anrufen", email: "E-Mail an Bellavista Domus" },
    hero: {
      title: "Bellavista Domus",
      subtitle: "Nur wenige Schritte vom Meer.",
      info: `Bis zu ${CONFIG.property.guests} Gäste, ${CONFIG.property.bedrooms} Schlafzimmer, ${CONFIG.property.bathrooms} Badezimmer`,
      ctaPrimary: "Verfügbarkeit prüfen",
      ctaSecondary: "Das Haus entdecken",
      scroll: "Scrollen",
    },
    intro: {
      eyebrow: "Willkommen",
      title: "Ihr Aufenthalt an der Adria",
      text: "Mit Blick aufs Meer aufwachen, einen Gang zurückschalten und Apulien in Ihrem eigenen Tempo erleben. Bellavista Domus ist ein privates Ferienhaus für Familien und Gruppen, die Platz, Komfort und das Meer direkt vor der Tür suchen.",
    },
    features: [
      { title: "10 m vom Meer", desc: "Freier Strand direkt vor der Haustür." },
      { title: `Bis zu ${CONFIG.property.guests} Gäste`, desc: "Platz für Familien und größere Gruppen." },
      { title: `${CONFIG.property.bedrooms} Schlafzimmer`, desc: "Private, komfortable Zimmer für alle." },
      { title: `${CONFIG.property.bathrooms} Badezimmer`, desc: "Bequem und praktisch für die ganze Gruppe." },
      { title: "Privatparkplatz", desc: "Ein reservierter Stellplatz, ganz ohne Sorgen." },
      { title: "Außenbereiche", desc: "Balkone und Grillplatz für das Leben im Freien." },
    ],
    house: {
      eyebrow: "Die Unterkunft",
      title: "Das Haus",
      text: "Bellavista Domus ist ein ganzes Haus für alle, die ihre Zeit in Apulien mit der Familie oder mit Freunden verbringen möchten, ohne auf Platz und Privatsphäre zu verzichten.",
      items: {
        living: "Wohnzimmer",
        bedroom: "Schlafzimmer",
        kitchen: "Voll ausgestattete Küche",
        bathroom: "Badezimmer",
        balcony: "Balkone",
        outdoor: "Außenbereiche",
        parking: "Privatparkplatz",
      },
    },
    gallery: { eyebrow: "Fotos", title: "Galerie" },
    testimonial: {
      title: "Das sagen unsere Gäste",
      translationLabel: "Deutsche Übersetzung lesen",
      note: "Echte Bewertungen von Gästen, die hier übernachtet haben, vollständig von den Plattformen übernommen, auf denen sie gebucht haben. Jede verweist auf die Seite des Hauses bei Airbnb oder Booking.com, wo das Original zu lesen ist.",
      reviews: [
        { platform: "airbnb", author: "Renáta", when: "September 2026", iso: "2026-09", stars: 5, rating: "Bewertung 5 von 5", title: null, lang: "en",
          quote: "A wonderful place to stay – everything was perfect! The rooms are huge and spacious, with a large communal area that creates a really warm and welcoming atmosphere. The house also has a beautiful garden and a large terrace, which was perfect for relaxing and enjoying the surroundings.\nThe kitchen is fully equipped, and the whole house is spotlessly clean and has such a lovely atmosphere. It is a charming seaside home.\nWe were also welcomed with a lovely welcome package upon arrival, which was such a thoughtful touch.\nFrancesco was incredibly kind, helpful, and attentive, and we could always count on him whenever we needed anything.\nWe had a fantastic stay and would wholeheartedly recommend this beautiful place! ❤️",
          translation: "Ein wunderbarer Ort für einen Aufenthalt – alles war perfekt! Die Zimmer sind riesig und geräumig, mit einem großen Gemeinschaftsbereich, der eine wirklich warme und einladende Atmosphäre schafft. Das Haus hat außerdem einen schönen Garten und eine große Terrasse, perfekt zum Entspannen und um die Umgebung zu genießen.\nDie Küche ist voll ausgestattet, das ganze Haus ist blitzsauber und hat eine sehr angenehme Atmosphäre. Ein charmantes Haus am Meer.\nBei der Ankunft wurden wir außerdem mit einem schönen Willkommenspaket empfangen – eine wirklich aufmerksame Geste.\nFrancesco war unglaublich freundlich, hilfsbereit und aufmerksam, und wir konnten uns jederzeit auf ihn verlassen, wenn wir etwas brauchten.\nWir hatten einen fantastischen Aufenthalt und können diesen wunderschönen Ort von Herzen empfehlen! ❤️",
          source: "Auf Airbnb lesen" },
        { platform: "booking", author: "Angela", when: "September 2026", iso: "2026-09", score: "9/10", rating: "Bewertung 9 von 10", title: "Fantastic!", lang: "en",
          quote: "The villa was a perfect location for my needs,, close to family and a few steps from the sea. The host Francesco was amazing, very attentive and prompt\nIt's a perfect villa for a family, beautiful garden and very comfortable interior with a full kitchen , with all the amenities needed I will definitely be back.",
          translation: "Fantastisch!\nDie Villa lag perfekt für meine Bedürfnisse, nah bei der Familie und nur wenige Schritte vom Meer. Der Gastgeber Francesco war großartig, sehr aufmerksam und schnell.\nEine perfekte Villa für eine Familie, mit schönem Garten und sehr gemütlichen Innenräumen, einer voll ausgestatteten Küche und allem, was man braucht. Ich komme ganz sicher wieder.",
          source: "Auf Booking.com lesen" },
        { platform: "airbnb", author: "Gaetana", when: "August 2026", iso: "2026-08", stars: 5, rating: "Bewertung 5 von 5", title: null, lang: "it",
          quote:
            "Ci siamo trovati benissimo in 6, spazi ampi, casa completa di tutto e camere con aria condizionata, terrazzino esterno stupendo. Francesco è stato gentilissimo e disponibile per qualsiasi dubbio riguardo la casa e non solo. Ci è sembrato di essere a casa, con il vantaggio di essere a due passi dal mare. Consigliatissimo, spero di poterci tornare presto",
          translation:
            "Wir haben uns zu sechst sehr wohlgefühlt: viel Platz, ein Haus mit allem, was man braucht, klimatisierte Zimmer und eine wunderschöne kleine Terrasse. Francesco war äußerst freundlich und bei jeder Frage zum Haus und darüber hinaus hilfsbereit. Wir haben uns wie zu Hause gefühlt, mit dem Vorteil, nur zwei Schritte vom Meer entfernt zu sein. Sehr zu empfehlen, ich hoffe, bald wiederzukommen.",
          source: "Auf Airbnb lesen" },
      ],
    },
    amenities: {
      eyebrow: "Ausstattung",
      title: "Was Sie im Haus erwartet",
      text: "Alles, was Sie für eine Woche mit Familie oder Freunden brauchen, ohne bei der Ankunft etwas kaufen zu müssen.",
      bedsTitle: "Schlafmöglichkeiten",
      beds: [
        { room: "Schlafzimmer 1", detail: "Doppelbett", places: "2 Personen" },
        { room: "Schlafzimmer 2", detail: "Doppelbett", places: "2 Personen" },
        { room: "Schlafzimmer 3", detail: "Kleines Doppelbett und Etagenbett", places: "3 Personen" },
      ],
      groups: [
        {
          title: "Küche",
          items: ["Backofen", "Heißluftfritteuse", "Geschirrspüler", "Kühlschrank mit Gefrierfach", "Kaffeemaschine", "Töpfe und Pfannen", "Teller, Gläser, Besteck und Tassen"],
        },
        {
          title: "Klima",
          items: ["Klimaanlage mit Heizfunktion in allen drei Schlafzimmern", "Klimaanlage mit Heizfunktion im Wohnzimmer"],
        },
        {
          title: "Bäder und Wäsche",
          items: ["Zwei Badezimmer, beide mit Dusche", "Bettwäsche und Handtücher inklusive", "Waschmaschine", "Wäscheständer", "Haartrockner", "Seife"],
        },
        {
          title: "Internet",
          items: ["Glasfaser-WLAN bis 500 Mbit/s", "Fernseher im Wohnzimmer mit Netflix und weiteren Streamingdiensten"],
        },
        {
          title: "Außenbereiche",
          items: ["Privater Garten", "Holzkohlegrill", "Über 12 Sitzplätze im Freien an mehreren Tischen", "Liegestühle"],
        },
        {
          title: "Parken",
          items: ["Zwei kostenlose Privatparkplätze", "Platz für Roller und Fahrräder", "Kostenloses Parken auch auf der Straße vor dem Grundstück"],
        },
      ],
      familyTitle: "Für Familien",
      familyText: "Hochstuhl, Babybett, Bettgitter und Wickelauflage stehen ohne Aufpreis zur Verfügung. Sagen Sie uns bei der Buchung Bescheid, dann ist bei Ihrer Ankunft alles vorbereitet.",
      rulesTitle: "Praktische Informationen",
      rules: [
        { label: "Mindestaufenthalt", value: "2 Nächte in der Nebensaison, 4 in der Hochsaison" },
        { label: "Endreinigung", value: "99 €, zusätzlich zum Aufenthalt" },
        { label: "Check-in", value: "ab 15:00 Uhr" },
        { label: "Check-out", value: "bis 11:00 Uhr" },
        { label: "Rauchen", value: "nur im Freien" },
        { label: "Haustiere", value: "kleine und mittelgroße, mit geringem Reinigungsaufschlag" },
        { label: "Partys", value: "nicht erlaubt" },
        { label: "Kaution", value: "500 €, vor Ort zu hinterlegen und am Ende des Aufenthalts zurückerstattet" },
      ],
    },
    location: {
      eyebrow: "Wo wir sind",
      title: "Das Meer liegt direkt vor der Tür",
      text: "Nur wenige Schritte von der Adria entfernt bietet Bellavista Domus einen authentischen Aufenthalt an der Küste von Torre a Mare, ganz in der Nähe von Bari und den schönsten Orten Apuliens.",
      mapEyebrow: "Auf der Karte",
      mapTitle: "So finden Sie uns",
      mapShow: "Karte anzeigen",
      mapPrivacy: "Beim Laden der Karte erhält Google Ihre IP-Adresse.",
      mapOpen: "In Google Maps öffnen",
      distances: [
        { value: "10 m", label: "zum Strand" },
        { value: "5 Min.", label: "zu Fuß zum kleinen Hafen" },
        { value: "15 Min.", label: "mit dem Auto nach Bari" },
        { value: "25 Min.", label: "vom Flughafen Bari" },
      ],
      exploreEyebrow: "In der Umgebung",
      exploreTitle: "Apulien entdecken",
      places: [
        { key: "torreamare", name: "Torre a Mare", desc: "Das Fischerdorf, in dem Bellavista Domus liegt.", link: "/torre-a-mare-de.html", linkLabel: "Sehenswertes in Torre a Mare" },
        { key: "bari", name: "Bari", desc: "Die Hauptstadt Apuliens, zwischen Altstadt und Uferpromenade.", link: "/bari-de.html", linkLabel: "Sehenswertes in Bari" },
        { key: "polignano", name: "Polignano a Mare", desc: "Berühmt für seine steil ins Meer abfallenden Klippen.", link: "/polignano-a-mare-de.html", linkLabel: "Sehenswertes in Polignano a Mare" },
        { key: "monopoli", name: "Monopoli", desc: "Historischer Hafen und Altstadt an der Adria.", link: "/monopoli-de.html", linkLabel: "Sehenswertes in Monopoli" },
        { key: "alberobello", name: "Alberobello", desc: "UNESCO-Welterbe, berühmt für seine Trulli.", link: "/alberobello-de.html", linkLabel: "Sehenswertes in Alberobello" },
        { key: "castellana", name: "Grotten von Castellana", desc: "Sechzig Meter unter der Erde, zwischen Stalaktiten und Alabaster.", link: "/grotte-di-castellana-de.html", linkLabel: "So besuchen Sie sie" },
        { key: "valleditria", name: "Valle d'Itria", desc: "Locorotondo, Cisternino, Martina Franca und Ostuni.", link: "/valle-d-itria-de.html", linkLabel: "Die Tagestour" },
        { key: "matera", name: "Matera", desc: "Die Sassi, UNESCO-Welterbe, gut eine Stunde entfernt.", link: "/matera-de.html", linkLabel: "Den Besuch planen" },
      ],
    },
    faq: {
      eyebrow: "Häufige Fragen",
      title: "Antworten auf die häufigsten Fragen",
      text: "Wenn Sie nicht finden, was Sie suchen, schreiben Sie uns: Wir antworten meist innerhalb weniger Stunden.",
      items: [
        { q: "Lohnt es sich, direkt zu buchen?",
          a: "Ja: Wenn Sie direkt bei uns buchen, per E-Mail, WhatsApp oder über das Formular auf der Website, erhalten Sie bis zu 25 % Rabatt gegenüber den Preisen von Booking.com und Airbnb für dieselben Daten, weil Sie keine Provisionen der Plattformen zahlen. Der genaue Prozentsatz hängt von den Daten ab: Wir bestätigen ihn Ihnen im Angebot." },
        { q: "Wie viele Personen finden im Haus Platz?",
          a: "Bis zu 7 Gäste in 3 Schlafzimmern: zwei Schlafzimmer mit Doppelbett und ein drittes mit einem kleinen Doppelbett und einem Etagenbett. Es gibt zwei Badezimmer, beide mit Dusche." },
        { q: "Wie weit ist das Meer wirklich entfernt?",
          a: "Zehn Meter, mit einer kleinen Sandbucht direkt vor dem Haus. Man überquert die Straße und ist am freien Strand, wo sich Sand und Felsen abwechseln. Das Meer sieht man von zwei der drei Schlafzimmer aus, und abends hört man es bei offenem Fenster." },
        { q: "Wie lange ist der Mindestaufenthalt?",
          a: "Zwei Nächte in der Nebensaison und vier Nächte in der Hochsaison." },
        { q: "Wann sind Check-in und Check-out?",
          a: "Check-in ist ab 15:00 Uhr, Check-out bis 11:00 Uhr. Wenn Ihr Flug oder Zug zu ungünstigen Zeiten geht, schreiben Sie uns: Wir versuchen, Ihnen entgegenzukommen, wenn der Kalender es erlaubt." },
        { q: "Ist die Endreinigung inbegriffen?",
          a: "Nein, sie kommt zum Preis des Aufenthalts hinzu und kostet 99 €. Es ist ein einmaliger Betrag, unabhängig von der Dauer des Aufenthalts und der Zahl der Gäste." },
        { q: "Ist eine Kaution vorgesehen?",
          a: "Ja, 500 €, bei der Ankunft vor Ort zu hinterlegen. Sie wird am Ende des Aufenthalts vollständig zurückerstattet, sofern keine Schäden entstanden sind." },
        { q: "Muss man Kurtaxe zahlen?",
          a: "Ja, sie wird vor Ort bezahlt und steht der Gemeinde Bari zu, nicht uns. Die städtische Satzung sieht Befreiungen vor – für Minderjährige und ab einer bestimmten Zahl aufeinanderfolgender Nächte –, daher bestätigen wir Ihnen den genauen Betrag bei der Buchung, je nachdem, wie viele Sie sind und wie lange Sie bleiben." },
        { q: "Sind Bettwäsche und Handtücher inklusive?",
          a: "Ja, Bettwäsche und Handtücher sind inklusive und liegen bei Ihrer Ankunft bereit. Im Haus finden Sie außerdem Seife, einen Haartrockner, eine Waschmaschine und einen Wäscheständer." },
        { q: "Gibt es einen Parkplatz?",
          a: "Ja, zwei kostenlose Privatparkplätze auf dem Grundstück, mit Platz auch für Roller und Fahrräder. Außerhalb des Grundstücks ist das Parken frei und kostenlos." },
        { q: "Sind Haustiere erlaubt?",
          a: "Ja, kleine und mittelgroße Hunde und Katzen sind willkommen, gegen einen geringen Reinigungsaufschlag. Bitte geben Sie es bei der Buchung an." },
        { q: "Darf man rauchen?",
          a: "Nur im Freien. Der Garten und die Außenbereiche stehen Ihnen zur Verfügung; im Haus wird nicht geraucht." },
        { q: "Gibt es eine Klimaanlage?",
          a: "Ja, in allen drei Schlafzimmern und im Wohnzimmer, mit Kühl- und Heizfunktion. Das Haus ist daher auch außerhalb der Saison angenehm." },
        { q: "Wie ist die Internetverbindung?",
          a: "Glasfaser-WLAN mit bis zu 500 Mbit/s im ganzen Haus. Die Verbindung eignet sich auch, wenn Sie während des Aufenthalts arbeiten oder Videokonferenzen führen müssen." },
        { q: "Gibt es Ausstattung für kleine Kinder?",
          a: "Ja: Hochstuhl, Babybett, Bettgitter und Wickelauflage, ohne Aufpreis. Bitte fragen Sie bei der Buchung danach, damit bei Ihrer Ankunft alles bereitsteht." },
        { q: "Kann man Partys oder Veranstaltungen organisieren?",
          a: "Nein, Partys und Veranstaltungen sind nicht erlaubt. Das Haus ist für Familien und Gruppen gedacht, die Ruhe suchen, und uns liegt ein gutes Verhältnis zur Nachbarschaft am Herzen." },
        { q: "Gibt es einen Pool?",
          a: "Noch nicht: Ein Pool ist für den Sommer 2027 geplant. Heute setzt das Haus auf anderes – zehn Meter bis zum Meer, mit der Sandbucht direkt davor, und einen privaten Garten mit über 12 Sitzplätzen im Freien und Grill. Wenn Sie einen Aufenthalt im Sommer 2027 planen, schreiben Sie uns vor der Buchung: Wir sagen Ihnen, wie weit die Arbeiten sind, damit Sie nicht auf eine bloße Erwartung hin buchen." },
        { q: "Wie kommt man nach Torre a Mare?",
          a: "Mit dem Auto nimmt man die Ausfahrt Torre a Mare centro und ist in zwei Minuten am Haus; vom Flughafen Bari sind es etwa 20 Minuten, 25 bei Verkehr. Mit öffentlichen Verkehrsmitteln ist der Bus 12 (oder 12/) ab dem Hauptbahnhof Bari am einfachsten. Vor Ort braucht man für den Strand und den Ort kein Auto; für Einkäufe und Besorgungen schon, sie sind etwa fünf Minuten entfernt.",
          href: "/come-arrivare-de.html", linkLabel: "Alle Details zur Anreise" },
      ],
    },
    booking: {
      eyebrow: "Buchen",
      title: "Bereit, mit Blick aufs Meer aufzuwachen?",
      text: "Buchen Sie direkt bei uns per E-Mail, WhatsApp oder über das Formular: Gegenüber den Preisen von Booking.com und Airbnb für dieselben Daten erhalten Sie bis zu 25 % Rabatt, weil Sie keine Provisionen der Plattformen zahlen.",
      direct: "Schreiben Sie uns und buchen Sie direkt",
      alt: "Oder buchen Sie, wo Sie möchten",
      booking: "Booking.com",
      airbnb: "Airbnb",
    },
    form: {
      eyebrow: "Anfrage",
      title: "Prüfen Sie Ihre Reisedaten",
      text: "Schreiben Sie uns, wann Sie kommen möchten und wie viele Sie sind: Wir antworten mit Verfügbarkeit und Preis, meist innerhalb weniger Stunden. Wenn Ihre Daten noch nicht feststehen, lassen Sie die Felder leer und schreiben Sie es in die Nachricht.",
      name: "Vor- und Nachname",
      arrival: "Anreise (optional)",
      departure: "Abreise (optional)",
      email: "E-Mail",
      guests: "Gäste",
      message: "Nachricht (optional)",
      consent: "Ich akzeptiere die",
      consentLink: "Datenschutzerklärung",
      submit: "Anfrage senden",
      sending: "Wird gesendet…",
      error: "Die Anfrage konnte nicht gesendet werden. Schreiben Sie uns bitte direkt an " + CONFIG.property.email + " oder per WhatsApp an " + CONFIG.property.phone + ".",
      doneTitle: "Anfrage erhalten",
      doneText: "Vielen Dank! Wir melden uns so schnell wie möglich mit Verfügbarkeit und Direktpreis, bis zu 25 % günstiger als bei Booking.com und Airbnb. Für eine noch schnellere Antwort schicken Sie uns auch eine WhatsApp-Nachricht: Der Text ist schon vorbereitet.",
      honeypot: "Dieses Feld nicht ausfüllen",
    },
    footer: {
      tagline: "Ferienhaus am Meer",
      contactTitle: "Kontakt",
      infoTitle: "Informationen",
      cis: "CIS",
      cin: "CIN",
      rights: "Alle Rechte vorbehalten.",
      top: "Nach oben",
      privacyUrl: "/privacy-de.html",
      ospiti: "Gästeinformationen",
      ospitiUrl: "/ospiti-de.html",
    },
    calendario: {
      eyebrow: "Verfügbarkeit",
      title: "Sind Ihre Daten frei?",
      text: "Der Kalender zeigt die bereits gebuchten Nächte. Er wird alle paar Stunden von den Plattformen aktualisiert, betrachten Sie ihn also als Orientierung: Die endgültige Bestätigung erhalten Sie von uns.",
      caricamento: "Kalender wird geladen…",
      errore: "Der Kalender kann gerade nicht geladen werden. Schicken Sie uns Ihre Daten, wir antworten Ihnen.",
      libero: "Frei",
      occupato: "Belegt",
      precedente: "Vorheriger Monat",
      successivo: "Nächster Monat",
      mesi: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
      giorni: ["M","D","M","D","F","S","S"],
      giorniEstesi: ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
      esempio: "Beispieldaten – der echte Kalender ist lokal nicht verfügbar",
      guidaArrivo: "Tippen Sie auf den Anreisetag und dann auf den Abreisetag: Die Daten werden automatisch ins Anfrageformular übernommen.",
      guidaPartenza: "Anreise am {data}. Tippen Sie jetzt auf den Abreisetag.",
      conflitto: "Zwischen diesen Daten ist bereits eine Nacht gebucht: Wählen Sie eine andere Abreise oder Anreise.",
      dal: "Vom", al: "bis", notte: "Nacht", notti: "Nächte",
      arrivoAria: "Anreise", partenzaAria: "Abreise",
      richiedi: "Diese Daten anfragen",
      annulla: "Daten löschen",
      // Nelle date tedesche il giorno porta il punto: "12. Juni 2027".
      puntoGiorno: ".",
    },
    stickyCta: "Verfügbarkeit prüfen",
    whatsapp: {
      aria: "Schreiben Sie uns auf WhatsApp: bis zu 25 % Rabatt bei Direktbuchung",
      message: "Hallo! Ich möchte Bellavista Domus direkt mit dem Rabatt von bis zu 25 % buchen. Können Sie mir Verfügbarkeit und Preis für diese Daten nennen: ",
    },
    promo: {
      cifra: "−25%",
      chip: "bis zu −25%",
      barraLunga: "Bis zu 25 % Rabatt bei Direktbuchung per E-Mail oder WhatsApp, gegenüber den Preisen von Booking.com und Airbnb",
      barraMedia: "Bis zu 25 % Rabatt bei Direktbuchung gegenüber Booking.com und Airbnb",
      barraBreve: "bei Direktbuchung",
      hero: "Bis zu 25 % Rabatt, wenn Sie direkt buchen, gegenüber den Preisen von Booking.com und Airbnb.",
      heroCta: "Schreiben Sie uns auf WhatsApp",
      fino: "Bis zu",
      percento: "25 %",
      sconto: "Rabatt",
      fasciaAlto: "Bis zu 25 % Rabatt, wenn Sie direkt bei uns buchen, gegenüber den Preisen von Booking.com und Airbnb.",
      fasciaRecensioni: "Möchten Sie unsere nächsten Gäste sein? Buchen Sie direkt und zahlen Sie bis zu 25 % weniger als bei Booking.com und Airbnb.",
      modulo: "Angebot anfragen",
      moduloTesto: "Bis zu 25 % Rabatt gegenüber Booking.com und Airbnb. Möchten Sie uns lieber gleich schreiben?",
      nota: "Der genaue Prozentsatz hängt von den Daten ab: Wir bestätigen ihn Ihnen im Angebot.",
      calendario: "Bei Direktbuchung zahlen Sie bis zu 25 % weniger als bei Booking.com und Airbnb.",
      footer: "Direkt buchen: bis zu 25 % Rabatt gegenüber Booking.com und Airbnb.",
      whatsapp: "WhatsApp",
      email: "E-Mail",
      emailOggetto: "Direktbuchung Bellavista Domus",
      emailTesto: "Hallo, ich möchte Bellavista Domus direkt mit dem Rabatt von bis zu 25 % buchen.\n\nAnreise:\nAbreise:\nAnzahl der Gäste:\n",
      dopoModulo: "Weiter auf WhatsApp",
      dopoModuloMessaggio: "Hallo, ich bin {nome}. Ich habe gerade über die Website eine Anfrage gesendet{date} (Gäste: {ospiti}). Ich möchte direkt mit dem Rabatt buchen: Können Sie mir Verfügbarkeit und Preis bestätigen?",
      dopoModuloDate: ", vom {arrivo} bis {partenza}",
      separatoreData: ".",
    },
    photoPlaceholder: "Foto folgt",
    cookieBanner: {
      ariaLabel: "Cookie-Einwilligung",
      text: "Wir verwenden Google Analytics nur mit Ihrer Einwilligung, um zu verstehen, wie die Website genutzt wird. Keine Profiling-Cookies.",
      linkLabel: "Mehr erfahren",
      reject: "Ablehnen",
      accept: "Akzeptieren",
    },
  },
};

/* -------------------------------- TRACCIAMENTO -------------------------------- */

/* Invia un evento a Google Analytics. Non fa nulla finché il visitatore non
   ha accettato il banner cookie (bdAnalyticsAttivo, in public/js/consenso.js),
   né se gtag manca (sviluppo locale, blocchi pubblicitari): il sito deve
   funzionare identico in ogni caso. Gli eventi precedenti al consenso non
   vengono accodati né inviati dopo: si scartano.

   Questi eventi sono ciò che distingue "quante persone sono passate" da
   "quante hanno fatto qualcosa": senza, non è possibile valutare né una
   campagna pubblicitaria né se conviene un motore di prenotazione. */
function traccia(evento, parametri) {
  if (typeof window === "undefined" || !window.bdAnalyticsAttivo || typeof window.gtag !== "function") return;
  window.gtag("event", evento, parametri || {});
}

/* Segnala una volta sola che il visitatore è arrivato in fondo alla pagina:
   distingue chi legge davvero da chi rimbalza dopo due secondi. */
function useScrollDepth() {
  useEffect(() => {
    let inviato = false;
    const onScroll = () => {
      if (inviato) return;
      const altezza = document.documentElement.scrollHeight - window.innerHeight;
      if (altezza <= 0) return;
      if (window.scrollY / altezza >= 0.75) {
        inviato = true;
        traccia("scroll_75");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* ---------------------------------- HOOKS ----------------------------------- */

/* Reveal era un contenitore con animazione d'ingresso (dissolvenza dal basso)
   su ogni sezione. Tolta a settembre 2026: su un sito "premium" le dissolvenze
   ovunque sembrano un modello pronto e rallentano la lettura; resta un solo
   momento animato, l'apertura (hero). Il componente resta perché è usato in
   molti punti, anche con as="a" per le schede di "Scopri la Puglia": ora
   restituisce semplicemente l'elemento, senza osservatori né classi. */
function Reveal({ as: Tag = "div", delay, className = "", children, ...rest }) {
  return (
    <Tag className={className || undefined} {...rest}>
      {children}
    </Tag>
  );
}

/* --------------------------------- PHOTO SLOT ---------------------------------- */
/* Ogni fotografia del sito passa da qui. Se "src" è vuoto, o se il file non
   riesce a caricarsi, mostra un placeholder elegante e coerente con il resto
   del sito invece dell'icona di immagine rotta del browser. Lo slot occupa
   sempre l'intero spazio del suo contenitore (stessa dimensione/proporzione
   che avrà con la fotografia reale). */

/* Varianti WebP disponibili per ogni fotografia, generate una volta sola dai
   JPEG originali (vedi la sezione "Fotografie" in CLAUDE.md). Ogni voce dice
   la dimensione dell'originale e a quali larghezze esistono le copie.
   Serve perché non tutte le immagini hanno le stesse varianti: quelle già
   piccole non vengono ingrandite. Se si aggiunge o sostituisce una foto,
   questo elenco va rigenerato, altrimenti il browser chiede file inesistenti. */
const VARIANTI_IMMAGINI = {
  "casa-bagno": { w: 1100, h: 1467, v: [480, 900, 1100] },
  "casa-camera": { w: 1200, h: 1600, v: [480, 900, 1200] },
  "casa-cucina": { w: 1100, h: 1467, v: [480, 900, 1100] },
  "casa-parcheggio": { w: 1200, h: 1600, v: [480, 900, 1200] },
  "casa-soggiorno": { w: 1200, h: 1600, v: [480, 900, 1200] },
  "casa-spazi-esterni": { w: 1900, h: 2533, v: [480, 900, 1400, 1900] },
  "galleria-01": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-02": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-03": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-04": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-05": { w: 1600, h: 2133, v: [480, 900, 1400, 1600] },
  "galleria-06": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-07": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-08": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "galleria-09": { w: 1000, h: 1333, v: [480, 900, 1000] },
  "hero": { w: 1900, h: 2533, v: [480, 900, 1400, 1900] },
  "intro": { w: 1600, h: 2133, v: [480, 900, 1400, 1600] },
  "posizione-mare": { w: 1900, h: 2533, v: [480, 900, 1400, 1900] },
  "puglia-alberobello": { w: 2560, h: 823, v: [480, 900, 1400, 1900, 2560] },
  "puglia-alberobello-scheda": { w: 1080, h: 1440, v: [480, 900, 1080] },
  "puglia-bari-scheda": { w: 1080, h: 1440, v: [480, 900, 1080] },
  "puglia-monopoli-scheda": { w: 1080, h: 1440, v: [480, 900, 1080] },
  "puglia-polignano-scheda": { w: 1080, h: 1440, v: [480, 900, 1080] },
  "puglia-castellana-scheda": { w: 960, h: 1280, v: [480, 900, 960] },
  "puglia-matera-scheda": { w: 1080, h: 1440, v: [480, 900, 1080] },
  "puglia-valle-d-itria-scheda": { w: 1080, h: 1440, v: [480, 900, 1080] },
  "puglia-castellana": { w: 1920, h: 1280, v: [480, 900, 1400, 1920] },
  "puglia-matera": { w: 2560, h: 1707, v: [480, 900, 1400, 1900, 2560] },
  "puglia-valle-d-itria": { w: 2560, h: 1440, v: [480, 900, 1400, 1900, 2560] },
  "puglia-bari": { w: 2560, h: 823, v: [480, 900, 1400, 1900, 2560] },
  "puglia-monopoli": { w: 2560, h: 823, v: [480, 900, 1400, 1900, 2560] },
  "puglia-polignano": { w: 2560, h: 823, v: [480, 900, 1400, 1900, 2560] },
  "puglia-torre-a-mare": { w: 900, h: 1600, v: [480, 900] },
  "terrazzo-migliorata": { w: 1400, h: 1811, v: [480, 900, 1400] },
};

/* Da "/images/hero.jpg" ricava l'elenco delle copie WebP con la loro
   larghezza, nella forma che il browser si aspetta nell'attributo srcset.
   Restituisce null per percorsi non riconosciuti: in quel caso PhotoSlot
   serve semplicemente il JPEG, come prima. */
function sorgentiWebp(src) {
  const nome = /^\/images\/(.+)\.jpg$/.exec(src || "")?.[1];
  const dati = nome && VARIANTI_IMMAGINI[nome];
  if (!dati) return null;
  return {
    srcSet: dati.v
      .map((l) => `/images/${nome}${l === dati.w ? "" : `-${l}`}.webp ${l}w`)
      .join(", "),
    width: dati.w,
    height: dati.h,
  };
}

/* "sizes" dice al browser quanto spazio occuperà l'immagine PRIMA di aver
   letto il CSS, ed è ciò che gli permette di scegliere la variante giusta.
   Sbagliarlo per eccesso vanifica il lavoro: chiederebbe comunque il file
   grande. Il valore va passato da chi usa PhotoSlot, in base al riquadro
   in cui la fotografia vive. */
function PhotoSlot({ src, alt = "", label = "", dark = false, compact = false, position = "center", placeholderText = "Fotografia in arrivo", priority = false, sizes = "100vw" }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;
  const webp = sorgentiWebp(src);

  if (!showPlaceholder) {
    const immagine = (
      <img
        src={src}
        alt={alt}
        width={webp ? webp.width : undefined}
        height={webp ? webp.height : undefined}
        /* priority={true} va usato SOLO per la fotografia dell'hero: è
           l'immagine più grande e più in alto della pagina, quella che Google
           cronometra come LCP. Rimandarne il caricamento (loading="lazy")
           significa ritardare di proposito la metrica più importante. Tutte
           le altre restano pigre: sono sotto la piega e non servono subito. */
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className="bd-photo__img"
        style={{ objectPosition: position }}
        onError={() => setFailed(true)}
      />
    );

    /* Senza varianti (percorso non riconosciuto) si serve il JPEG e basta.
       Con le varianti, il browser sceglie da sé la copia WebP più adatta
       allo schermo; se non capisse il WebP, ricade sul JPEG dentro l'img. */
    if (!webp) return immagine;

    return (
      <picture className="bd-photo__pic">
        <source type="image/webp" srcSet={webp.srcSet} sizes={sizes} />
        {immagine}
      </picture>
    );
  }

  return (
    <div className={`bd-photo__placeholder ${dark ? "bd-photo__placeholder--dark" : ""} ${compact ? "bd-photo__placeholder--compact" : ""}`}>
      <span className="bd-photo__mark">BD</span>
      <span className="bd-photo__hair" />
      {!compact && (
        <span className="bd-photo__text">
          {label ? `${label} · ${placeholderText}` : placeholderText}
        </span>
      )}
    </div>
  );
}

/* ----------------------------------- MAPPA ------------------------------------ */

/* Indirizzo leggibile e sorgenti della mappa, ricavati da CONFIG.
   Il segnaposto usa le coordinate, non un indirizzo scritto: così è preciso
   anche senza la via, e non dipende da come Google interpreta il testo. */
function datiIndirizzo() {
  const p = CONFIG.property;
  const { lat, lng } = CONFIG.maps;
  return {
    via: (p.street || "").trim(),
    comune: `${p.postalCode} ${p.city} (${p.province})`,
    srcIframe: `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=it&output=embed`,
    linkMaps: CONFIG.maps.placeUrl,
  };
}

/* La mappa di Google carica script e cookie di Google appena viene inserita
   nella pagina. Per non vanificare il Consent Mode del banner cookie, qui
   l'iframe NON esiste finché l'utente non lo chiede: prima c'è solo una
   scheda con l'indirizzo e un pulsante. Chi non clicca non manda a Google
   nemmeno il proprio indirizzo IP. */
function MapCard({ t }) {
  const [mostraMappa, setMostraMappa] = useState(false);
  const { via, comune, srcIframe, linkMaps } = datiIndirizzo();

  return (
    <div className="bd-map">
      <div className="bd-map__info">
        <h3 className="bd-h3">{t.location.mapTitle}</h3>

        <address className="bd-map__address">
          <span className="bd-map__name">{CONFIG.property.name}</span>
          {via && <span>{via}</span>}
          <span>{comune}</span>
        </address>

        <ul className="bd-map__distances">
          {t.location.distances.map((d) => (
            <li key={d.label}>
              <span className="bd-map__dist-value">{d.value}</span>
              <span className="bd-map__dist-label">{d.label}</span>
            </li>
          ))}
        </ul>

        <a className="bd-map__open" href={linkMaps} target="_blank" rel="noopener noreferrer">
          {t.location.mapOpen}
        </a>
      </div>

      <div className="bd-map__frame">
        {mostraMappa ? (
          <iframe
            className="bd-map__iframe"
            title={t.location.mapTitle}
            src={srcIframe}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <button type="button" className="bd-map__placeholder" onClick={() => { setMostraMappa(true); traccia("apre_mappa"); }}>
            <span className="bd-map__pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
            </span>
            <span className="bd-map__cta">{t.location.mapShow}</span>
            <span className="bd-map__privacy">{t.location.mapPrivacy}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- HEADER ----------------------------------- */

/* Indirizzo della homepage per ciascuna lingua. Usato dal selettore in alto
   e dai ritorni al sito: è l'unico punto da toccare se un giorno si
   aggiunge una terza lingua. */
const HOME_LINGUE = { it: "/", en: "/en/", fr: "/fr/", de: "/de/" };

/* Icone della barra contatti: piccole, disegnate a mano, ereditano il colore
   dal testo. Meglio di una libreria di icone per tre sole forme. */
/* ------------------------- PROMO PRENOTAZIONE DIRETTA ------------------------- */

/* Link a WhatsApp e all'email con il testo già scritto. Sono link normali:
   non caricano nulla da terzi finché il visitatore non li tocca, quindi non
   servono né consenso né modifiche alla Content-Security-Policy.
   encodeURIComponent esiste anche in Node: si possono usare nel render. */
function linkWhatsApp(testo) {
  const numero = CONFIG.property.phone.replace(/\D/g, ""); // solo cifre, per wa.me
  return `https://wa.me/${numero}?text=${encodeURIComponent(testo)}`;
}
function linkEmail(p) {
  return `mailto:${CONFIG.property.email}?subject=${encodeURIComponent(p.emailOggetto)}&body=${encodeURIComponent(p.emailTesto)}`;
}

function IconaWhatsApp({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.1c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .9 2.14.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.65-.14.27.1 1.69.8 1.98.94.29.15.48.22.55.34.07.13.07.72-.17 1.4Z"/>
    </svg>
  );
}

function IconaEmail({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

/* I pulsanti dei tre canali diretti. "posizione" finisce nell'evento di
   Analytics (es. "whatsapp_hero", "email_barra"): così si vede quale banner
   porta davvero contatti. Con modulo={false} il pulsante del modulo non
   compare (serve dove il modulo è già lì sotto). */
function PromoAzioni({ t, go, posizione, modulo = true }) {
  const p = t.promo;
  return (
    <div className="bd-promo__azioni">
      <a
        className="bd-promo__btn bd-promo__btn--wa"
        href={linkWhatsApp(t.whatsapp.message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => traccia("contatto", { metodo: "whatsapp_" + posizione })}
      >
        <IconaWhatsApp /> {p.whatsapp}
      </a>
      <a
        className="bd-promo__btn bd-promo__btn--email"
        href={linkEmail(p)}
        onClick={() => traccia("contatto", { metodo: "email_" + posizione })}
      >
        <IconaEmail /> {p.email}
      </a>
      {modulo && go ? (
        <a
          className="bd-promo__btn bd-promo__btn--modulo"
          href="#contact"
          onClick={(e) => { e.preventDefault(); go("#contact"); traccia("contatto", { metodo: "modulo_" + posizione }); }}
        >
          {p.modulo}
        </a>
      ) : null}
    </div>
  );
}

/* Striscia in cima alla pagina, dentro l'intestazione fissa: resta sempre
   visibile. Sostituisce la vecchia barra contatti blu (tolta a settembre
   2026) ma con un compito diverso: vendere la prenotazione diretta. Tre
   lunghezze di testo, una sola visibile per volta a seconda dello schermo. */
function PromoBarra({ t }) {
  const p = t.promo;
  return (
    <div className="bd-promobar">
      <p className="bd-promobar__testo">
        <span className="bd-chip">{p.cifra}</span>
        <span className="bd-promobar__lunga">{p.barraLunga}</span>
        <span className="bd-promobar__media">{p.barraMedia}</span>
        <span className="bd-promobar__breve">{p.barraBreve}</span>
      </p>
      <span className="bd-promobar__link">
        <a
          href={linkWhatsApp(t.whatsapp.message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => traccia("contatto", { metodo: "whatsapp_barra" })}
        >
          <IconaWhatsApp size={15} /> {p.whatsapp}
        </a>
        <a
          className="bd-promobar__email"
          href={linkEmail(p)}
          onClick={() => traccia("contatto", { metodo: "email_barra" })}
        >
          <IconaEmail size={15} /> {p.email}
        </a>
      </span>
    </div>
  );
}

/* Fascia a tutta larghezza fra una sezione e l'altra. */
function PromoFascia({ t, go, testo, posizione }) {
  const p = t.promo;
  return (
    <aside className="bd-promofascia" aria-label={p.hero}>
      <div className="bd-promofascia__inner">
        <p className="bd-promofascia__testo">
          <span className="bd-promofascia__cifra">{p.cifra}</span>
          <span>{testo}</span>
        </p>
        <PromoAzioni t={t} go={go} posizione={posizione} />
      </div>
    </aside>
  );
}

function Header({ lang, t, go }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "#home", label: t.nav.home },
    { href: "#house", label: t.nav.house },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#location", label: t.nav.location },
    { href: "#explore", label: t.nav.explore },
    { href: "#contact", label: t.nav.contact },
  ];

  const handleGo = (href) => {
    setMenuOpen(false);
    go(href);
  };

  return (
    <header className={`bd-header ${scrolled ? "bd-header--solid" : ""}`}>
      <PromoBarra t={t} />
      <div className="bd-header__inner">
        <a href="#home" className="bd-logo" onClick={(e) => { e.preventDefault(); handleGo("#home"); }}>
          {/* Due versioni dello stesso marchio: finché l'intestazione è
              trasparente sta sopra la fotografia scura dell'apertura e il blu
              sparirebbe, quindi si mostra quella chiara. Appena la barra
              diventa piena si torna a quella a colori. Solo una delle due
              porta il testo alternativo: sono la stessa cosa. */}
          <img
            src="/branding/logo-header-chiaro.png"
            alt=""
            aria-hidden="true"
            width="300"
            height="106"
            className="bd-logo__img bd-logo__img--chiaro"
          />
          <img
            src="/branding/logo-header.png"
            alt={CONFIG.property.name}
            width="300"
            height="106"
            className="bd-logo__img bd-logo__img--scuro"
          />
          <span className="bd-logo__text">{CONFIG.property.name}</span>
        </a>

        <nav className="bd-nav bd-nav--desktop">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); handleGo(item.href); }}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="bd-header__right">
          {/* Link veri, non pulsanti: cambiare lingua cambia indirizzo. Così
              la pagina inglese si può condividere e i motori di ricerca la
              vedono. L'ancora corrente viene portata dietro, per non
              rispedire in cima chi stava leggendo a metà pagina. */}
          <nav className="bd-langswitch" aria-label="Language">
            {Object.keys(HOME_LINGUE).map((codice, i) => (
              <React.Fragment key={codice}>
                {i > 0 && <span aria-hidden="true">/</span>}
                <a
                  href={HOME_LINGUE[codice]}
                  className={lang === codice ? "is-active" : ""}
                  hrefLang={codice}
                  aria-current={lang === codice ? "page" : undefined}
                  onClick={(e) => {
                    if (lang === codice) { e.preventDefault(); return; }
                    if (window.location.hash) {
                      e.preventDefault();
                      window.location.href = HOME_LINGUE[codice] + window.location.hash;
                    }
                  }}
                >
                  {codice.toUpperCase()}
                </a>
              </React.Fragment>
            ))}
          </nav>
          <a
            href="#contact"
            className="bd-btn bd-btn--primary bd-btn--sm bd-nav--desktop-only"
            onClick={(e) => { e.preventDefault(); handleGo("#contact"); }}
          >
            {t.nav.book} <span className="bd-chip">{t.promo.cifra}</span>
          </a>
          <button className="bd-burger" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
            <span className={menuOpen ? "is-open" : ""} />
          </button>
        </div>
      </div>

      <div className={`bd-mobilemenu ${menuOpen ? "is-open" : ""}`}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); handleGo(item.href); }}>
            {item.label}
          </a>
        ))}
        <a href="#contact" className="bd-btn bd-btn--primary" onClick={(e) => { e.preventDefault(); handleGo("#contact"); }}>
          {t.nav.book} <span className="bd-chip">{t.promo.cifra}</span>
        </a>
      </div>
    </header>
  );
}

/* ----------------------------------- HERO ------------------------------------ */

function Hero({ t, go }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.22);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="bd-hero">
      <div className="bd-hero__imgwrap">
        <div className="bd-hero__img" style={{ transform: `translateY(${offset}px)` }}>
          <PhotoSlot src={CONFIG.images.hero} alt={CONFIG.property.name} dark position="center 52%" placeholderText={t.photoPlaceholder} priority sizes="100vw" />
        </div>
      </div>
      <div className="bd-hero__scrim" />
      <div className="bd-hero__content">
        <p className="bd-hero__kicker">{t.luogo || CONFIG.property.locationLine}</p>
        <h1 className="bd-hero__title">{t.hero.title}</h1>
        <p className="bd-hero__subtitle">{t.hero.subtitle}</p>
        <p className="bd-hero__info">{t.hero.info}</p>
        <div className="bd-hero__ctas">
          <a href="#contact" className="bd-btn bd-btn--primary" onClick={(e) => { e.preventDefault(); go("#contact"); }}>
            {t.hero.ctaPrimary}
          </a>
          <a href="#house" className="bd-btn bd-btn--ghost" onClick={(e) => { e.preventDefault(); go("#house"); }}>
            {t.hero.ctaSecondary}
          </a>
        </div>
        {/* Il pulsante pieno porta al modulo; questo riquadro offre la
            strada più rapida, WhatsApp, e dice subito perché conviene. */}
        <a
          className="bd-hero__promo"
          href={linkWhatsApp(t.whatsapp.message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => traccia("contatto", { metodo: "whatsapp_hero" })}
        >
          <span className="bd-hero__promo-cifra">{t.promo.cifra}</span>
          <span className="bd-hero__promo-testo">
            {t.promo.hero}
            <span className="bd-hero__promo-cta"><IconaWhatsApp size={15} /> {t.promo.heroCta}</span>
          </span>
        </a>
      </div>
      <button className="bd-hero__scrolldown" onClick={() => go("#intro")} aria-label={t.hero.scroll}>
        <span className="bd-hero__scrolldown-line" />
        <span className="bd-hero__scrolldown-label">{t.hero.scroll}</span>
      </button>
    </section>
  );
}

/* ---------------------------------- INTRO ------------------------------------- */

function Intro({ t }) {
  return (
    <section id="intro" className="bd-intro">
      <div className="bd-intro__grid">
        <Reveal className="bd-intro__text">
          <h2 className="bd-h2">{t.intro.title}</h2>
          <p className="bd-body">{t.intro.text}</p>
        </Reveal>
        <Reveal delay={150} className="bd-intro__img">
          <PhotoSlot src={CONFIG.images.intro} alt={CONFIG.property.name} position="center 78%" placeholderText={t.photoPlaceholder} sizes="(max-width: 900px) 100vw, 50vw" />
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- FEATURES (fact strip) ------------------------------------ */

function Features({ t }) {
  return (
    <section className="bd-facts">
      <div className="bd-facts__row">
        {t.features.map((f, i) => (
          <Reveal as="div" key={f.title} delay={i * 60} className="bd-fact">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- HOUSE -------------------------------------- */

function House({ t }) {
  const items = CONFIG.images.house;
  return (
    <section id="house" className="bd-house">
      <Reveal className="bd-section-head">
        <h2 className="bd-h2">{t.house.title}</h2>
        <p className="bd-body bd-body--narrow">{t.house.text}</p>
      </Reveal>

      <div className="bd-house__grid" tabIndex={0} role="region" aria-label={t.house.title}>
        {items.map((item, i) => (
          <Reveal
            key={item.key}
            delay={(i % 3) * 70}
            className="bd-house__card"
            style={{ gridColumn: `span ${item.span}` }}
          >
            <div className="bd-house__frame" style={{ aspectRatio: item.aspect }}>
              <PhotoSlot src={item.url} alt={t.house.items[item.key]} placeholderText={t.photoPlaceholder} sizes="(max-width: 900px) 100vw, 45vw" />
            </div>
            <p className="bd-house__caption">{t.house.items[item.key]}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- GALLERY -------------------------------------- */

function Gallery({ t }) {
  const images = CONFIG.images.gallery;
  const [lightbox, setLightbox] = useState(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback((e) => {
    e && e.stopPropagation();
    setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback((e) => {
    e && e.stopPropagation();
    setLightbox((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  return (
    <section id="gallery" className="bd-gallery">
      <Reveal className="bd-section-head">
        <h2 className="bd-h2">{t.gallery.title}</h2>
      </Reveal>

      <div className="bd-gallery__grid">
        {images.map((src, i) => (
          <Reveal
            key={src + i}
            delay={(i % 6) * 45}
            as="button"
            className={i === 0 ? "bd-gallery__item bd-gallery__item--grande" : "bd-gallery__item"}
            onClick={() => { setLightbox(i); traccia("apre_galleria", { indice: i + 1 }); }}
            aria-label={`${t.gallery.title} ${i + 1}`}
          >
            <PhotoSlot src={src} alt={`${CONFIG.property.name} ${i + 1}`} compact placeholderText={t.photoPlaceholder} sizes="(max-width: 700px) 50vw, 25vw" />
          </Reveal>
        ))}
      </div>

      {lightbox !== null && (
        <div className="bd-lightbox" onClick={close}>
          <button className="bd-lightbox__close" onClick={close} aria-label="Close">×</button>
          <button className="bd-lightbox__nav bd-lightbox__nav--prev" onClick={prev} aria-label="Previous">‹</button>
          <figure className="bd-lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <div className="bd-lightbox__imgwrap">
              <PhotoSlot src={images[lightbox]} alt="" placeholderText={t.photoPlaceholder} sizes="100vw" />
            </div>
            <figcaption>{CONFIG.property.name} — {String(lightbox + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</figcaption>
          </figure>
          <button className="bd-lightbox__nav bd-lightbox__nav--next" onClick={next} aria-label="Next">›</button>
        </div>
      )}
    </section>
  );
}

/* -------------------------------- TESTIMONIAL ------------------------------------ */

/* Una sola citazione, a tutta larghezza. Struttura figure/blockquote/
   figcaption: l'attribuzione non può stare dentro il blockquote, perché il
   blockquote contiene solo ciò che l'ospite ha effettivamente scritto.
   Il componente si toglie da solo di mezzo se la chiave non c'è, così
   aggiungere una lingua non può far esplodere la pagina. */
function Testimonial({ t }) {
  const v = t.testimonial;
  if (!v || !v.reviews || v.reviews.length === 0) return null;
  return (
    <section className="bd-quote" aria-labelledby="recensioni-titolo">
      <Reveal className="bd-rec">
        <div className="bd-section-head">
          <h2 className="bd-h3" id="recensioni-titolo">{v.title}</h2>
        </div>
        <div className="bd-rec__lista" tabIndex={0} role="region" aria-label={v.title}>
          {v.reviews.map((r) => {
            const link = r.platform === "booking" ? CONFIG.links.booking : CONFIG.links.airbnb;
            return (
              <figure className="bd-rec__card" key={r.author + r.iso}>
                <p className="bd-rec__voto">
                  {/* Il punteggio lo legge lo screen reader dall'aria-label.
                      Booking usa i voti su 10: si mostra il voto, non stelle
                      inventate. */}
                  {r.stars ? (
                    <span className="bd-rec__stelle" role="img" aria-label={r.rating}>
                      <span aria-hidden="true">{"★".repeat(r.stars)}</span>
                    </span>
                  ) : (
                    <span className="bd-rec__punteggio" role="img" aria-label={r.rating}>{r.score}</span>
                  )}
                  <span className="bd-rec__piattaforma">{r.platform === "booking" ? "Booking.com" : "Airbnb"}</span>
                </p>
                <blockquote className="bd-rec__testo" cite={link} lang={r.lang}>
                  {r.title ? <p className="bd-rec__titolo">{r.title}</p> : null}
                  <p>{r.quote}</p>
                </blockquote>
                {r.translation ? (
                  <details className="bd-rec__traduzione">
                    <summary>{v.translationLabel}</summary>
                    <p>{r.translation}</p>
                  </details>
                ) : null}
                <figcaption className="bd-rec__firma">
                  <span className="bd-rec__autore">{r.author}</span>
                  <time dateTime={r.iso}>{r.when}</time>
                  <a
                    className="bd-rec__link"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => traccia("click_ota", { piattaforma: `${r.platform}_recensione` })}
                  >
                    {r.source}
                  </a>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <p className="bd-rec__nota">{v.note}</p>
      </Reveal>
    </section>
  );
}

/* --------------------------------- LOCATION -------------------------------------- */

function Location({ t }) {
  return (
    <section id="location" className="bd-location">
      <div className="bd-location__hero">
        <PhotoSlot src={CONFIG.images.location} alt={t.location.title} dark position="center 40%" placeholderText={t.photoPlaceholder} sizes="100vw" />
        <div className="bd-location__hero-content">
          <Reveal>
            <h2 className="bd-h2 bd-h2--light">{t.location.title}</h2>
            <p className="bd-body bd-body--light bd-body--narrow">{t.location.text}</p>
          </Reveal>
        </div>
      </div>

      <Reveal>
        <MapCard t={t} />
      </Reveal>

      {/* L'id serve alla voce "Dintorni" del menu: senza, la sezione delle
          guide sarebbe raggiungibile solo scorrendo fin dentro "Posizione". */}
      <div className="bd-explore" id="explore">
        <Reveal className="bd-section-head">
          <h3 className="bd-h3">{t.location.exploreTitle}</h3>
        </Reveal>
        <div className="bd-explore__grid">
          {/* La scheda intera è il link, fotografia compresa: è dove la gente
              clicca per istinto. Di conseguenza l'etichetta in fondo è uno
              <span>, non un <a>: un link dentro un link non è HTML valido e i
              browser lo rendono in modi imprevedibili. */}
          {t.location.places.map((p, i) => (
            <Reveal
              key={p.key}
              as={p.link ? "a" : "div"}
              delay={i * 70}
              className="bd-explore__card"
              {...(p.link ? { href: p.link, onClick: () => traccia("apre_guida", { meta: p.key }) } : {})}
            >
              <div className="bd-explore__img">
                <PhotoSlot src={CONFIG.images.explore[p.key]} alt={p.name} compact placeholderText={t.photoPlaceholder} sizes="(max-width: 900px) 50vw, 25vw" />
              </div>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
              {p.link && (
                <span className="bd-explore__link">
                  {p.linkLabel}
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ SERVIZI E DOTAZIONI -------------------------------- */

function Amenities({ t }) {
  const a = t.amenities;
  return (
    <section id="servizi" className="bd-amen">
      <div className="bd-amen__inner">
        <Reveal className="bd-section-head">
          <h2 className="bd-h2">{a.title}</h2>
          <p className="bd-body bd-body--narrow">{a.text}</p>
        </Reveal>

        {/* I posti letto stanno in cima e separati dal resto: è la prima cosa
            che una famiglia verifica, prima ancora delle dotazioni. */}
        <Reveal className="bd-amen__beds">
          <h3 className="bd-amen__subtitle">{a.bedsTitle}</h3>
          <div className="bd-amen__bedrow">
            {a.beds.map((b) => (
              <div key={b.room} className="bd-bed">
                <span className="bd-bed__room">{b.room}</span>
                <span className="bd-bed__detail">{b.detail}</span>
                <span className="bd-bed__places">{b.places}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="bd-amen__grid">
          {a.groups.map((g, i) => (
            <Reveal as="div" key={g.title} delay={i * 50} className="bd-amen__group">
              <h3 className="bd-amen__grouptitle">{g.title}</h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="bd-amen__family">
          <h3 className="bd-amen__subtitle">{a.familyTitle}</h3>
          <p>{a.familyText}</p>
        </Reveal>

        <Reveal className="bd-amen__rules">
          <h3 className="bd-amen__subtitle">{a.rulesTitle}</h3>
          <dl>
            {a.rules.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- DOMANDE FREQUENTI -------------------------------- */

/* Fisarmonica costruita con details/summary nativi invece che con JavaScript:
   funziona senza script, è già accessibile da tastiera e da lettore di
   schermo, e il contenuto resta nell'HTML anche quando è chiuso — quindi
   leggibile da motori di ricerca e assistenti AI. */
function Faq({ t }) {
  const f = t.faq;
  return (
    <section id="faq" className="bd-faq">
      <div className="bd-faq__inner">
        <Reveal className="bd-section-head">
          <h2 className="bd-h2">{f.title}</h2>
          <p className="bd-body bd-body--narrow">{f.text}</p>
        </Reveal>

        <div className="bd-faq__list">
          {f.items.map((item, i) => (
            <Reveal as="details" key={item.q} delay={Math.min(i, 6) * 40} className="bd-faq__item">
              <summary>
                <span>{item.q}</span>
                <span className="bd-faq__sign" aria-hidden="true" />
              </summary>
              <div className="bd-faq__answer">
                <p>{item.a}</p>
                {/* Alcune risposte rimandano a una pagina che approfondisce.
                    Il link resta fuori dal testo della risposta perché quel
                    testo finisce identico nei dati strutturati, dove un
                    tag HTML non avrebbe senso. */}
                {item.href && (
                  <a className="bd-faq__more" href={item.href}>
                    {item.linkLabel}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ RICHIESTA DISPONIBILITÀ ---------------------------- */

/* Nome del modulo. Deve coincidere ESATTAMENTE con quello del modulo statico
   nascosto in index.html: Netlify legge l'HTML pubblicato per sapere che il
   modulo esiste e quali campi ha, e il sito qui è costruito da React nel
   browser, dove Netlify non arriva a guardare. Una sola dichiarazione basta
   per tutto il sito — anche gli invii dalla pagina inglese vengono
   riconosciuti dal valore di form-name — ma l'elenco dei campi qui sotto e
   quello del modulo statico devono restare identici. */
const NOME_MODULO = "richiesta-disponibilita";

const VUOTO = { nome: "", email: "", arrivo: "", partenza: "", ospiti: "2", messaggio: "", privacy: false };

/* Netlify si aspetta i dati nella stessa forma in cui li manderebbe un modulo
   HTML tradizionale, non in JSON. */
function codificaModulo(dati) {
  return Object.keys(dati)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(dati[k]))
    .join("&");
}

/* La data odierna si calcola solo nel browser, mai durante il prerendering:
   l'HTML viene generato il giorno della build e visitato giorni dopo, quindi
   una data scritta nell'HTML sarebbe già vecchia e farebbe litigare React
   con il markup che trova. Finché non parte l'effetto, il campo non ha
   limite minimo: il controllo vero resta comunque lato nostro. */
function useOggi() {
  const [oggi, setOggi] = useState("");
  useEffect(() => {
    setOggi(new Date().toISOString().slice(0, 10));
  }, []);
  return oggi;
}

/* ------------------------------- CALENDARIO ---------------------------------- */

/* Legge /api/disponibilita (la funzione in netlify/functions) e disegna due
   mesi con le notti già prenotate. Tre principi:
   1. Non si inventa nulla: se la lettura fallisce non mostra un calendario
      tutto libero, mostra che non è riuscita e rimanda al modulo.
   2. Non viene prerenderizzato: dipende dalla data odierna e da una chiamata
      di rete, quindi resta vuoto finché non parte nel browser.
   3. In locale la funzione non esiste — lì mostra date finte, ma con un
      avviso ben visibile, per non far credere che stia funzionando. */

function chiave(anno, mese, giorno) {
  return `${anno}-${String(mese + 1).padStart(2, "0")}-${String(giorno).padStart(2, "0")}`;
}

/* Griglia di un mese che inizia di lunedì, con le caselle vuote iniziali. */
function grigliaMese(anno, mese) {
  const primo = new Date(Date.UTC(anno, mese, 1));
  const vuote = (primo.getUTCDay() + 6) % 7; // domenica=0 -> 6
  const quanti = new Date(Date.UTC(anno, mese + 1, 0)).getUTCDate();
  const celle = Array(vuote).fill(null);
  for (let g = 1; g <= quanti; g++) celle.push(g);
  return celle;
}

/* Somma giorni a una data "AAAA-MM-GG" e conta le notti tra due date.
   Usano Date, ma girano solo nel browser: il calendario non viene
   prerenderizzato (vedi sopra). */
function aggiungiGiorni(k, n) {
  const [a, m, g] = k.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, g + n)).toISOString().slice(0, 10);
}
function contaNotti(da, a) {
  const [y1, m1, d1] = da.split("-").map(Number);
  const [y2, m2, d2] = a.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
/* Vero se tutte le notti da "da" (compresa) ad "a" (esclusa) sono libere.
   Il giorno di partenza può essere occupato: quella notte arriva qualcun
   altro, ma chi parte la mattina non la usa. */
function notteLibere(da, a, occupate) {
  for (let k = da; k < a; k = aggiungiGiorni(k, 1)) if (occupate.has(k)) return false;
  return true;
}

/* Le date si scelgono toccando il calendario: prima l'arrivo, poi la
   partenza. Passano al modulo di richiesta tramite onScegli (lo stato sta in
   BellavistaDomus), e nel modulo restano modificabili a mano. */
function Calendario({ t, go, onScegli }) {
  const v = t.calendario;
  const [stato, setStato] = useState("caricamento"); // caricamento | pronto | errore
  const [occupate, setOccupate] = useState(() => new Set());
  const [esempio, setEsempio] = useState(false);
  const [oggi, setOggi] = useState(null);
  const [scorri, setScorri] = useState(0);
  const [arrivo, setArrivo] = useState("");
  const [partenza, setPartenza] = useState("");
  const [avviso, setAvviso] = useState("");

  useEffect(() => {
    setOggi(new Date());
    let vivo = true;
    fetch("/api/disponibilita")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((dati) => {
        if (!vivo) return;
        setOccupate(new Set(dati.occupate || []));
        setStato("pronto");
      })
      .catch(() => {
        if (!vivo) return;
        const locale = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
        if (locale) {
          /* Qualche notte finta, solo per far vedere l'aspetto. */
          const d = new Date();
          const finte = new Set();
          for (const salto of [3, 4, 5, 6, 17, 18, 19, 33, 34, 48, 49, 50, 51]) {
            const x = new Date(d);
            x.setDate(x.getDate() + salto);
            finte.add(x.toISOString().slice(0, 10));
          }
          setOccupate(finte);
          setEsempio(true);
          setStato("pronto");
        } else {
          setStato("errore");
        }
      });
    return () => { vivo = false; };
  }, []);

  if (!oggi) return <section id="calendario" className="bd-cal" aria-hidden="true" />;

  const base = new Date(oggi.getFullYear(), oggi.getMonth() + scorri, 1);
  const mesi = [0, 1].map((i) => {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
    return { anno: d.getFullYear(), mese: d.getMonth() };
  });
  const ieri = chiave(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());

  const formatta = (k) => {
    const [a, m, g] = k.split("-").map(Number);
    return `${g}${v.puntoGiorno || ""} ${v.mesi[m - 1]} ${a}`;
  };
  const comunica = (da, a) => { if (onScegli) onScegli({ arrivo: da, partenza: a }); };
  const scegli = (k) => {
    setAvviso("");
    if (!arrivo || partenza || k <= arrivo) {
      if (occupate.has(k)) return; // una notte occupata non può essere l'arrivo
      setArrivo(k); setPartenza(""); comunica(k, "");
      return;
    }
    if (!notteLibere(arrivo, k, occupate)) { setAvviso(v.conflitto); return; }
    setPartenza(k); comunica(arrivo, k);
    traccia("sceglie_date", { notti: contaNotti(arrivo, k) });
  };
  const azzera = () => { setArrivo(""); setPartenza(""); setAvviso(""); comunica("", ""); };

  return (
    <section id="calendario" className="bd-cal">
      <Reveal className="bd-cal__inner">
        <div className="bd-section-head">
          <h2 className="bd-h3">{v.title}</h2>
          <p className="bd-body bd-body--narrow">{v.text}</p>
        </div>

        {stato === "caricamento" && <p className="bd-cal__stato">{v.caricamento}</p>}

        {stato === "errore" && (
          <p className="bd-cal__stato bd-cal__stato--errore" role="status">
            {v.errore}{" "}
            <a href="#contact" className="bd-cal__link" onClick={(e) => { e.preventDefault(); go("#contact"); }}>
              {t.nav.contact}
            </a>
          </p>
        )}

        {stato === "pronto" && (
          <>
            {esempio && <p className="bd-cal__esempio" role="status">{v.esempio}</p>}

            <div className="bd-cal__barra">
              <button
                type="button"
                className="bd-cal__freccia"
                onClick={() => setScorri((s) => Math.max(0, s - 1))}
                disabled={scorri === 0}
                aria-label={v.precedente}
              >←</button>
              <span className="bd-cal__legenda">
                <span className="bd-cal__chip bd-cal__chip--libero" /> {v.libero}
                <span className="bd-cal__chip bd-cal__chip--occupato" /> {v.occupato}
              </span>
              <button
                type="button"
                className="bd-cal__freccia"
                onClick={() => setScorri((s) => Math.min(16, s + 1))}
                disabled={scorri >= 16}
                aria-label={v.successivo}
              >→</button>
            </div>

            <div className="bd-cal__mesi">
              {mesi.map(({ anno, mese }) => (
                <div className="bd-cal__mese" key={`${anno}-${mese}`}>
                  <p className="bd-cal__titolo">{v.mesi[mese]} {anno}</p>
                  <div className="bd-cal__intestazione" aria-hidden="true">
                    {v.giorni.map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                  <div className="bd-cal__griglia">
                    {grigliaMese(anno, mese).map((g, i) => {
                      if (g === null) return <span key={`v${i}`} className="bd-cal__vuota" />;
                      const k = chiave(anno, mese, g);
                      const passata = k < ieri;
                      const presa = occupate.has(k);
                      const cls = passata ? "bd-cal__g bd-cal__g--passata"
                        : presa ? "bd-cal__g bd-cal__g--occupata"
                        : "bd-cal__g";
                      const etichetta = `${g}${v.puntoGiorno || ""} ${v.mesi[mese]} ${anno} — ${presa ? v.occupato : v.libero}`;
                      const puoPartire = arrivo && !partenza && k > arrivo && notteLibere(arrivo, k, occupate);
                      const cliccabile = !passata && (!presa || puoPartire);
                      if (!cliccabile) {
                        return (
                          <span key={k} className={cls} title={passata ? undefined : etichetta}>
                            {g}
                          </span>
                        );
                      }
                      const inizio = k === arrivo, fine = k === partenza;
                      const dentro = arrivo && partenza && k > arrivo && k < partenza;
                      const stato = inizio ? ` bd-cal__g--inizio` : fine ? ` bd-cal__g--fine` : dentro ? ` bd-cal__g--dentro` : "";
                      const ruolo = inizio ? `, ${v.arrivoAria}` : fine ? `, ${v.partenzaAria}` : "";
                      return (
                        <button
                          type="button"
                          key={k}
                          className={cls + stato}
                          onClick={() => scegli(k)}
                          aria-pressed={inizio || fine}
                          aria-label={etichetta + ruolo}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="bd-cal__scelta" aria-live="polite">
              {avviso ? <p className="bd-cal__avviso">{avviso}</p> : null}
              {!arrivo && !avviso ? <p className="bd-cal__guida">{v.guidaArrivo}</p> : null}
              {arrivo && !partenza ? <p className="bd-cal__guida">{v.guidaPartenza.replace("{data}", formatta(arrivo))}</p> : null}
              {arrivo && partenza ? (
                <>
                  <p className="bd-cal__riepilogo">
                    {`${v.dal} ${formatta(arrivo)} ${v.al} ${formatta(partenza)}, ${contaNotti(arrivo, partenza)} ${contaNotti(arrivo, partenza) === 1 ? v.notte : v.notti}`}
                  </p>
                  <p className="bd-cal__promo"><span className="bd-chip">{t.promo.cifra}</span> {t.promo.calendario}</p>
                  <div className="bd-cal__azioni">
                    <button type="button" className="bd-btn bd-btn--send" onClick={() => go("#contact")}>{v.richiedi}</button>
                    <button type="button" className="bd-cal__annulla" onClick={azzera}>{v.annulla}</button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
      </Reveal>
    </section>
  );
}

function ContactForm({ t, dateScelte }) {
  const [valori, setValori] = useState(VUOTO);
  const [stato, setStato] = useState("pronto"); // pronto | invio | inviato | errore
  // Copia di ciò che è stato inviato: serve a scrivere il messaggio WhatsApp
  // della schermata di conferma dopo che il modulo si è svuotato.
  const [inviata, setInviata] = useState(null);
  const oggi = useOggi();

  /* Le date scelte toccando il calendario riempiono i campi, che restano
     comunque modificabili a mano. */
  useEffect(() => {
    if (!dateScelte) return;
    setValori((v) => ({ ...v, arrivo: dateScelte.arrivo, partenza: dateScelte.partenza }));
  }, [dateScelte]);

  const aggiorna = (campo) => (e) =>
    setValori((v) => ({ ...v, [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const invia = async (e) => {
    e.preventDefault();
    setStato("invio");
    try {
      const risposta = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: codificaModulo({
          "form-name": NOME_MODULO,
          nome: valori.nome,
          email: valori.email,
          arrivo: valori.arrivo,
          partenza: valori.partenza,
          ospiti: valori.ospiti,
          messaggio: valori.messaggio,
          privacy: valori.privacy ? "accettata" : "non accettata",
        }),
      });
      if (!risposta.ok) throw new Error(risposta.status);
      setStato("inviato");
      setInviata(valori);
      setValori(VUOTO);
      traccia("richiesta_inviata", { ospiti: valori.ospiti });
    } catch (err) {
      // In sviluppo locale non esiste nessun Netlify che raccolga i dati:
      // l'errore qui è atteso e non indica un problema del modulo.
      setStato("errore");
    }
  };

  if (stato === "inviato") {
    /* WhatsApp è il canale che converte di più: dopo il modulo si invita a
       scrivere anche lì, con un messaggio già pronto che contiene nome e
       date appena inseriti. Le date arrivano come AAAA-MM-GG dal campo
       type="date": si girano in GG/MM/AAAA senza usare Date. */
    const p = t.promo;
    const giraData = (d) => d.split("-").reverse().join(p.separatoreData || "/");
    const d = inviata || VUOTO;
    const date = d.arrivo && d.partenza
      ? p.dopoModuloDate.replace("{arrivo}", giraData(d.arrivo)).replace("{partenza}", giraData(d.partenza))
      : "";
    const messaggio = p.dopoModuloMessaggio
      .replace("{nome}", d.nome.trim())
      .replace("{ospiti}", d.ospiti)
      .replace("{date}", date);
    return (
      <section id="contact" className="bd-form">
        <Reveal className="bd-form__inner">
          <div className="bd-form__done" role="status">
            <h2 className="bd-h3">{t.form.doneTitle}</h2>
            <p className="bd-body bd-body--narrow">{t.form.doneText}</p>
            <a
              className="bd-promo__btn bd-promo__btn--wa bd-promo__btn--grande"
              href={linkWhatsApp(messaggio)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => traccia("contatto", { metodo: "whatsapp_dopo_modulo" })}
            >
              <IconaWhatsApp size={20} /> {p.dopoModulo}
            </a>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="contact" className="bd-form">
      <Reveal className="bd-form__inner">
        <div className="bd-section-head">
          <h2 className="bd-h3">{t.form.title}</h2>
          <p className="bd-body bd-body--narrow">{t.form.text}</p>
        </div>

        <div className="bd-form__promo">
          <p><span className="bd-chip">{t.promo.cifra}</span> {t.promo.moduloTesto}</p>
          <PromoAzioni t={t} posizione="modulo" modulo={false} />
        </div>

        <form className="bd-form__grid" name={NOME_MODULO} method="POST" onSubmit={invia} noValidate={false}>
          {/* Netlify usa questo campo per riconoscere il modulo, e il campo
              esca sotto per scartare gli invii automatici degli spambot. */}
          <input type="hidden" name="form-name" value={NOME_MODULO} />
          <p className="bd-form__hp">
            <label>
              {t.form.honeypot} <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <label className="bd-field">
            <span>{t.form.name}</span>
            <input type="text" name="nome" value={valori.nome} onChange={aggiorna("nome")} required autoComplete="name" />
          </label>

          <label className="bd-field">
            <span>{t.form.email}</span>
            <input type="email" name="email" value={valori.email} onChange={aggiorna("email")} required autoComplete="email" />
          </label>

          <label className="bd-field">
            <span>{t.form.arrival}</span>
            <input type="date" name="arrivo" value={valori.arrivo} onChange={aggiorna("arrivo")} min={oggi || undefined} />
          </label>

          <label className="bd-field">
            <span>{t.form.departure}</span>
            <input
              type="date"
              name="partenza"
              value={valori.partenza}
              onChange={aggiorna("partenza")}
              min={valori.arrivo || oggi || undefined}
            />
          </label>

          <label className="bd-field">
            <span>{t.form.guests}</span>
            <select name="ospiti" value={valori.ospiti} onChange={aggiorna("ospiti")} required>
              {Array.from({ length: CONFIG.property.guests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </select>
          </label>

          <label className="bd-field bd-field--full">
            <span>{t.form.message}</span>
            <textarea name="messaggio" rows={4} value={valori.messaggio} onChange={aggiorna("messaggio")} />
          </label>

          <label className="bd-field--full bd-form__consent">
            {/* Il campo ha un name e viene inviato: chiedere un consenso e
                non conservarne traccia lo rende inutile il giorno in cui
                bisogna dimostrare di averlo raccolto. */}
            <input type="checkbox" name="privacy" checked={valori.privacy} onChange={aggiorna("privacy")} required />
            <span>
              {t.form.consent}{" "}
              <a href={t.footer.privacyUrl} target="_blank" rel="noopener noreferrer">{t.form.consentLink}</a>.
            </span>
          </label>

          <div className="bd-field--full bd-form__actions">
            <button type="submit" className="bd-btn bd-btn--send" disabled={stato === "invio"}>
              {stato === "invio" ? t.form.sending : t.form.submit}
            </button>
            {stato === "errore" && (
              <p className="bd-form__error" role="alert">{t.form.error}</p>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
}

/* --------------------------------- BOOKING -------------------------------------- */

/* Gerarchia deliberata: il contatto diretto è il pulsante pieno, le due
   piattaforme sono link secondari sotto. Chi vuole Booking o Airbnb li trova
   comunque, ma chi non ha una preferenza scrive qui — e su quella
   prenotazione non c'è commissione. Invertire questa gerarchia significa
   pagare due volte lo stesso ospite quando c'è pubblicità a pagamento. */
function Booking({ t, go }) {
  return (
    <section id="booking" className="bd-booking">
      <div className="bd-booking__glow" />
      <Reveal className="bd-booking__inner">
        <h2 className="bd-h2 bd-h2--light">{t.booking.title}</h2>
        <p className="bd-booking__offerta">
          <span className="bd-booking__fino">{t.promo.fino}</span>
          <span className="bd-booking__cifra">{t.promo.percento}</span>
          <span className="bd-booking__fino">{t.promo.sconto}</span>
        </p>
        <p className="bd-body bd-body--light">{t.booking.text}</p>
        <div className="bd-booking__ctas">
          <a
            href="#contact"
            className="bd-btn bd-btn--primary"
            onClick={(e) => { e.preventDefault(); go("#contact"); traccia("contatto", { metodo: "diretto_prenota" }); }}
          >
            {t.booking.direct}
          </a>
          <PromoAzioni t={t} go={go} posizione="prenota" modulo={false} />
        </div>
        <p className="bd-booking__nota">{t.promo.nota}</p>
        <p className="bd-booking__alt">{t.booking.alt}</p>
        <div className="bd-booking__ota">
          <a href={CONFIG.links.booking} target="_blank" rel="noopener noreferrer" className="bd-booking__otalink" onClick={() => traccia("click_ota", { piattaforma: "booking" })}>
            {t.booking.booking}
          </a>
          <span className="bd-booking__sep" aria-hidden="true">·</span>
          <a href={CONFIG.links.airbnb} target="_blank" rel="noopener noreferrer" className="bd-booking__otalink" onClick={() => traccia("click_ota", { piattaforma: "airbnb" })}>
            {t.booking.airbnb}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------- FOOTER --------------------------------------- */

function Footer({ t, go }) {
  return (
    <footer className="bd-footer">
      <div className="bd-footer__top">
        <img
          src="/branding/logo-orizzontale.png"
          alt={CONFIG.property.name}
          width="1024"
          height="363"
          className="bd-logo--footer"
        />
        <p className="bd-footer__tagline">{t.footer.tagline}. {t.luogo || CONFIG.property.locationLine}</p>
        <p className="bd-footer__promo">
          <span className="bd-chip">{t.promo.cifra}</span> {t.promo.footer}
          <span className="bd-footer__promolink">
            <a href={linkWhatsApp(t.whatsapp.message)} target="_blank" rel="noopener noreferrer" onClick={() => traccia("contatto", { metodo: "whatsapp_footer" })}><IconaWhatsApp size={15} /> {t.promo.whatsapp}</a>
            <a href={linkEmail(t.promo)} onClick={() => traccia("contatto", { metodo: "email_footer" })}><IconaEmail size={15} /> {t.promo.email}</a>
          </span>
        </p>
      </div>

      <div className="bd-footer__grid">
        <div>
          <p className="bd-footer__title">{t.footer.contactTitle}</p>
          {/* Recapiti cliccabili: su telefono un tocco apre la mail o la
              chiamata, invece di dover copiare a mano. */}
          <p><a className="bd-footer__contatto" href={linkEmail(t.promo)} onClick={() => traccia("contatto", { metodo: "email_footer_recapiti" })}>{CONFIG.property.email}</a></p>
          <p><a className="bd-footer__contatto" href={"tel:+" + CONFIG.property.phone.replace(/\D/g, "")} onClick={() => traccia("contatto", { metodo: "telefono_footer" })}>{CONFIG.property.phone}</a></p>
        </div>
        <div>
          <p className="bd-footer__title">{t.footer.infoTitle}</p>
          <p>{t.footer.cis}: {CONFIG.property.cis}</p>
          <p>{t.footer.cin}: {CONFIG.property.cin}</p>
        </div>
      </div>

      <div className="bd-footer__bottom">
        <span>© {new Date().getFullYear()} {CONFIG.property.name}. {t.footer.rights}</span>
        {/* "Torna su" sta qui e non in una colonna propria: la homepage è
            lunga, e chi arriva in fondo senza questo pulsante deve rifare
            tutta la strada all'indietro scorrendo. */}
        <span className="bd-footer__coda">
          <a href={t.footer.ospitiUrl} className="bd-footer__privacy">{t.footer.ospiti}</a>
          <a href={t.footer.privacyUrl} className="bd-footer__privacy">Privacy</a>
          <button className="bd-footer__totop" onClick={() => go("#home")}>{t.footer.top} ↑</button>
        </span>
      </div>
    </footer>
  );
}

/* ------------------------------- COOKIE BANNER -------------------------------- */
/* Mostra il banner solo se l'utente non ha già scelto. "Accetta" carica
   Google Analytics tramite window.bdAttivaAnalytics (public/js/consenso.js):
   prima di quel momento gtag.js non viene nemmeno scaricato. "Rifiuta" non
   carica nulla. La scelta viene ricordata in questo browser. */

function CookieBanner({ t }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bd-cookie-consent");
    if (!saved) setVisible(true);
    else if (saved === "accepted" && window.bdAttivaAnalytics) {
      window.bdAttivaAnalytics();
    }
  }, []);

  const choose = (value) => {
    localStorage.setItem("bd-cookie-consent", value);
    if (value === "accepted" && window.bdAttivaAnalytics) {
      window.bdAttivaAnalytics();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bd-cookiebanner" role="dialog" aria-label={t.cookieBanner.ariaLabel}>
      <p>
        {t.cookieBanner.text} {" "}
        <a href={t.footer.privacyUrl} target="_blank" rel="noopener noreferrer">{t.cookieBanner.linkLabel}</a>.
      </p>
      <div className="bd-cookiebanner__actions">
        <button className="bd-btn bd-btn--ghost" onClick={() => choose("rejected")}>{t.cookieBanner.reject}</button>
        <button className="bd-btn bd-btn--primary bd-btn--sm" onClick={() => choose("accepted")}>{t.cookieBanner.accept}</button>
      </div>
    </div>
  );
}

/* ------------------------------- WHATSAPP -------------------------------- */

function WhatsAppButton({ t }) {
  /* Sul telefono, finché si è nell'apertura, il pulsante coprirebbe il
     riquadro promo, che porta già a WhatsApp: si fa da parte e ricompare
     appena si scorre, insieme alla barra "Verifica disponibilità". Lo stato
     parte da false, così l'HTML prerenderizzato mostra sempre il pulsante. */
  const [inApertura, setInApertura] = useState(false);
  useEffect(() => {
    const onScroll = () => setInApertura(window.scrollY < window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      className={`bd-whatsapp ${inApertura ? "bd-whatsapp--apertura" : ""}`}
      href={linkWhatsApp(t.whatsapp.message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.aria}
      onClick={() => traccia("contatto", { metodo: "whatsapp" })}
    >
      <IconaWhatsApp size={26} />
      {/* L'etichetta ripete lo sconto sul pulsante che resta sempre a
          vista. È decorativa: l'aria-label dice già tutto. */}
      <span className="bd-whatsapp__badge" aria-hidden="true">{t.promo.cifra}</span>
    </a>
  );
}

/* ------------------------------- STICKY MOBILE CTA -------------------------------- */

function StickyCta({ t, go }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`bd-stickycta ${show ? "is-visible" : ""}`}>
      {/* Porta al modulo, non alla sezione Prenota: su telefono questo è il
          pulsante più cliccato di tutto il sito. */}
      <button onClick={() => go("#contact")}>
        {t.stickyCta} <span className="bd-chip">{t.promo.chip}</span>
      </button>
    </div>
  );
}

/* ------------------------------------ STYLES --------------------------------------- */

const STYLES = `
@import url('/fonts/fonts.css');

:root{
  --ivory:#FAF7F1;
  --ivory-2:#F1EBDF;
  --sea-deep:#102838;
  --sea:#38667C;
  --sand:#CDB388;
  --stone:#69624F;
  --white:#FFFFFF;
  --line: rgba(16,40,56,0.13);
  --line-light: rgba(255,255,255,0.30);
  font-family: 'Inter', -apple-system, sans-serif;
}
*{box-sizing:border-box;}
.bd-root{
  background:var(--ivory);
  color:var(--sea-deep);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.bd-root img{max-width:100%;display:block;}
.bd-root a{color:inherit;text-decoration:none;}
.bd-root button{font-family:inherit;cursor:pointer;background:none;border:none;color:inherit;}

/* Photo slot — fotografia reale o placeholder elegante, stesso ingombro */
/* display:contents fa sparire <picture> dal layout, così l'immagine dentro
   continua a posizionarsi rispetto al riquadro come faceva prima che
   aggiungessimo le varianti WebP. */
.bd-photo__pic{display:contents;}
.bd-photo__img, .bd-photo__placeholder{position:absolute;inset:0;width:100%;height:100%;}
.bd-photo__img{object-fit:cover;display:block;}
.bd-photo__placeholder{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  text-align:center;padding:18px;
  background:linear-gradient(135deg, var(--ivory-2) 0%, #E8DBC1 100%);
  color:var(--sea);
}
.bd-photo__placeholder--dark{
  background:linear-gradient(160deg, #16394C 0%, #2C5871 62%, #7C97A0 100%);
  color:rgba(255,255,255,0.78);
}
.bd-photo__mark{font-family:'Fraunces',serif;font-style:italic;font-weight:400;font-size:22px;letter-spacing:0.02em;opacity:0.62;}
.bd-photo__hair{width:26px;height:1px;background:currentColor;opacity:0.4;}
.bd-photo__text{font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.62;max-width:22ch;line-height:1.5;}
.bd-photo__placeholder--compact .bd-photo__mark{font-size:15px;}
.bd-photo__placeholder--compact .bd-photo__hair{width:16px;}

/* Type */
.bd-h2{
  font-family:'Fraunces',serif;
  font-weight:340;
  font-size:clamp(32px,4.6vw,58px);
  line-height:1.08;
  margin:0 0 22px;
  letter-spacing:-0.015em;
}
.bd-h2--light{color:var(--white);}
.bd-h3{
  font-family:'Fraunces',serif;
  font-weight:400;
  font-size:clamp(23px,3vw,32px);
  margin:0 0 10px;
}
.bd-body{
  font-size:16.5px;
  line-height:1.8;
  color:var(--stone);
  font-weight:300;
  max-width:50ch;
}
.bd-body--light{color:rgba(255,255,255,0.82);}
.bd-body--narrow{max-width:44ch;}
.bd-section-head{max-width:640px;margin:0 auto 64px;text-align:center;}
.bd-section-head .bd-body{margin-left:auto;margin-right:auto;}


/* Buttons — fixed specificity: compound selectors so context never overrides intended color */
.bd-btn{
  display:inline-flex;align-items:center;gap:10px;justify-content:center;
  padding:16px 32px;
  font-size:13px;
  letter-spacing:0.07em;
  text-transform:uppercase;
  font-weight:500;
  border-radius:2px;
  transition:all .4s cubic-bezier(.16,.8,.24,1);
  white-space:nowrap;
}
.bd-btn.bd-btn--primary{background:var(--ivory);color:var(--sea-deep);}
.bd-btn.bd-btn--primary:hover{background:var(--white);transform:translateY(-2px);box-shadow:0 14px 28px rgba(16,40,56,0.18);}
.bd-btn.bd-btn--sm{padding:11px 20px;font-size:12px;}
.bd-btn.bd-btn--ghost{
  padding:16px 0;color:inherit;position:relative;
}
.bd-btn.bd-btn--ghost span{position:relative;}
.bd-btn.bd-btn--ghost{border-bottom:1px solid currentColor;padding-bottom:5px;}

/* Header */
.bd-header{
  position:fixed;top:0;left:0;right:0;z-index:100;
  transition:background .4s ease, border-color .4s ease;
  border-bottom:1px solid transparent;
}
/* Velatura sfumata sotto l'intestazione trasparente: senza, il testo chiaro
   di barra contatti e menu resta illeggibile quando l'hero è luminoso
   (cielo, mare, muri bianchi). Sfuma verso il basso per non creare una
   fascia netta, e sparisce quando l'intestazione diventa opaca. */
.bd-header::before{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg, rgba(16,40,56,0.62) 0%, rgba(16,40,56,0.34) 55%, rgba(16,40,56,0) 100%);
  opacity:1;transition:opacity .4s ease;
}
.bd-header--solid::before{opacity:0;}
.bd-header__inner{position:relative;z-index:1;}
.bd-header--solid{
  background:rgba(250,247,241,0.90);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
}
/* Lo spazio verticale dell'intestazione sta qui e non su .bd-header. Fino a
   settembre 2026 sopra il menu c'era una barra contatti blu (indirizzo,
   telefono, email): tolta per alleggerire l'apertura. I recapiti restano
   nella sezione contatti, nel footer e nel pulsante WhatsApp. */
.bd-header__inner{
  max-width:1280px;margin:0 auto;padding:26px 32px;
  display:flex;align-items:center;justify-content:space-between;gap:24px;
  transition:padding .4s ease;
}
.bd-header--solid .bd-header__inner{padding:12px 32px;}

@media (max-width:760px){
  .bd-header__inner{padding:16px 22px;}
  .bd-header--solid .bd-header__inner{padding:10px 22px;}
}
.bd-logo{
  font-family:'Fraunces',serif;font-size:20px;letter-spacing:0.015em;
  color:var(--sea-deep);
  display:flex;align-items:center;
}
.bd-header:not(.bd-header--solid) .bd-logo{color:var(--white);}
/* Cresce quando la barra diventa piena: li' la striscia blu dei contatti si
   e' chiusa e il marchio resta l'unico segno di identita'. Il margine della
   barra si stringe della stessa misura, cosi' l'altezza complessiva non
   cambia e il contenuto non perde spazio di lettura. */
.bd-logo__img{display:block;height:42px;width:auto;transition:height .4s ease;}
.bd-header--solid .bd-logo__img{height:44px;}
/* Si alterna in base allo stato della barra, mai tutt'e due insieme. */
.bd-header:not(.bd-header--solid) .bd-logo__img--scuro{display:none;}
.bd-header--solid .bd-logo__img--chiaro{display:none;}
.bd-logo__text{display:none;}
.bd-nav--desktop{display:flex;gap:36px;font-size:12.5px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;}
.bd-header:not(.bd-header--solid) .bd-nav--desktop a{color:rgba(255,255,255,0.92);}
.bd-nav--desktop a{position:relative;padding-bottom:3px;}
.bd-nav--desktop a:hover{opacity:0.65;}
.bd-header__right{display:flex;align-items:center;gap:22px;}
.bd-langswitch{display:flex;align-items:center;gap:6px;font-size:11.5px;letter-spacing:0.05em;}
.bd-langswitch a{opacity:0.55;font-weight:500;cursor:pointer;transition:opacity .15s;}
.bd-langswitch a:hover{opacity:0.85;}
.bd-langswitch a.is-active{opacity:1;text-decoration:underline;text-underline-offset:3px;cursor:default;}
.bd-langswitch a:focus-visible{outline:1px solid currentColor;outline-offset:3px;opacity:1;}
.bd-header:not(.bd-header--solid) .bd-langswitch{color:var(--white);}
.bd-nav--desktop-only{display:inline-flex;}
.bd-burger{display:none;width:26px;height:20px;position:relative;}
.bd-burger span, .bd-burger span::before, .bd-burger span::after{
  content:'';position:absolute;left:0;right:0;height:1px;background:currentColor;transition:all .3s ease;
}
.bd-burger span{top:9px;}
.bd-burger span::before{content:'';top:-8px;}
.bd-burger span::after{content:'';top:8px;}
.bd-header:not(.bd-header--solid) .bd-burger{color:var(--white);}
.bd-burger span.is-open{background:transparent;}
.bd-burger span.is-open::before{transform:translateY(8px) rotate(45deg);}
.bd-burger span.is-open::after{transform:translateY(-8px) rotate(-45deg);}

.bd-mobilemenu{
  display:none;
  max-height:0;overflow:hidden;
  background:var(--ivory);
  transition:max-height .4s ease;
}
.bd-mobilemenu.is-open{max-height:420px;border-top:1px solid var(--line);}
.bd-mobilemenu a{
  display:block;padding:17px 32px;font-size:15px;border-bottom:1px solid var(--line);
}
.bd-mobilemenu .bd-btn{margin:18px 32px;width:calc(100% - 64px);}

@media (max-width:860px){
  .bd-nav--desktop{display:none;}
  .bd-nav--desktop-only{display:none;}
  .bd-burger{display:block;}
  .bd-mobilemenu{display:block;}
  .bd-logo{font-size:17px;}
  /* Ritagliato bene il marchio e' largo ~80px: sta accanto al pulsante del
     menu senza stringere nulla, quindi sul telefono si mostra anche qui. */
  .bd-logo__img{height:34px;}
  .bd-header--solid .bd-logo__img{height:36px;}
  .bd-logo__text{display:none;}
}

/* Hero */
.bd-hero{
  position:relative;height:100vh;min-height:660px;display:flex;align-items:flex-end;
  overflow:hidden;background:var(--sea-deep);
}
.bd-hero__imgwrap{position:absolute;inset:0;overflow:hidden;}
.bd-hero__img{
  position:absolute;inset:-6% -0% -6% 0;background-size:cover;background-position:center;
  will-change:transform;
  animation:bd-heroin 2.4s cubic-bezier(.16,.8,.24,1) both;
}
@keyframes bd-heroin{from{transform:scale(1.09);opacity:0.001;}to{transform:scale(1);opacity:1;}}
.bd-hero__img .bd-photo__placeholder, .bd-location__hero .bd-photo__placeholder{justify-content:flex-start;padding-top:14vh;}
.bd-hero__scrim{
  position:absolute;inset:0;
  background:linear-gradient(180deg, rgba(16,40,56,0.22) 0%, rgba(16,40,56,0.02) 34%, rgba(16,40,56,0.16) 62%, rgba(16,40,56,0.66) 100%);
}
.bd-hero__content{position:relative;z-index:2;padding:0 32px 108px;max-width:1280px;margin:0 auto;width:100%;color:var(--white);}
.bd-hero__kicker{
  font-size:15px;letter-spacing:0.01em;color:rgba(255,255,255,0.9);margin:0 0 14px;
  animation:bd-fadeup .9s cubic-bezier(.16,.8,.24,1) .5s both;
}
.bd-hero__title{
  font-family:'Fraunces',serif;font-weight:340;
  font-size:clamp(52px,10.5vw,132px);
  line-height:0.94;margin:4px 0 14px;letter-spacing:-0.02em;
  animation:bd-fadeup 1.05s cubic-bezier(.16,.8,.24,1) .65s both;
}
.bd-hero__subtitle{
  font-family:'Fraunces',serif;font-style:italic;font-weight:400;
  font-size:clamp(19px,2.6vw,28px);margin:0 0 28px;color:rgba(255,255,255,0.94);
  animation:bd-fadeup 1s cubic-bezier(.16,.8,.24,1) .8s both;
}
.bd-hero__info{
  font-size:15px;letter-spacing:0.01em;margin:0 0 40px;color:rgba(255,255,255,0.86);
  animation:bd-fadeup 1s cubic-bezier(.16,.8,.24,1) .92s both;
  padding-top:26px;border-top:1px solid rgba(255,255,255,0.28);max-width:480px;
}
.bd-hero__ctas{
  display:flex;gap:28px;flex-wrap:wrap;align-items:center;
  animation:bd-fadeup 1s cubic-bezier(.16,.8,.24,1) 1.05s both;
}
@keyframes bd-fadeup{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
@media (prefers-reduced-motion: reduce){
  .bd-hero__img, .bd-hero__kicker, .bd-hero__title, .bd-hero__subtitle, .bd-hero__info, .bd-hero__ctas, .bd-hero__promo{animation:none;}
}
.bd-hero__scrolldown{
  position:absolute;left:50%;bottom:34px;transform:translateX(-50%);z-index:2;
  display:flex;flex-direction:column;align-items:center;gap:10px;color:rgba(255,255,255,0.75);
}
.bd-hero__scrolldown-line{width:1px;height:40px;position:relative;overflow:hidden;background:rgba(255,255,255,0.25);}
.bd-hero__scrolldown-line::after{
  content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:var(--white);
  transform:translateY(-100%);animation:bd-scrollline 2.4s ease-in-out infinite;
}
.bd-hero__scrolldown-label{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;}
@keyframes bd-scrollline{0%{transform:translateY(-100%);}50%{transform:translateY(0);}100%{transform:translateY(100%);}}

/* Intro */
.bd-intro{padding:150px 32px;max-width:1280px;margin:0 auto;}
.bd-intro__grid{display:grid;grid-template-columns:0.85fr 1.15fr;gap:100px;align-items:center;}
.bd-intro__img{position:relative;height:520px;overflow:hidden;border-radius:2px;}
@media (max-width:900px){
  .bd-intro{padding:96px 22px;}
  .bd-intro__grid{grid-template-columns:1fr;gap:44px;}
  .bd-intro__img{order:-1;}
  .bd-intro__img{height:320px;}
}

/* Facts strip (ex feature-cards) */
.bd-facts{background:var(--ivory-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:64px 32px;}
.bd-facts__row{
  max-width:1280px;margin:0 auto;
  display:flex;flex-wrap:wrap;
}
.bd-fact{
  flex:1 1 0;min-width:180px;
  padding:0 34px;border-left:1px solid var(--line);
}
.bd-fact:first-child{border-left:none;padding-left:0;}
.bd-fact h3{font-family:'Fraunces',serif;font-weight:450;font-size:19px;margin:0 0 8px;letter-spacing:-0.005em;}
.bd-fact p{font-size:13.5px;color:var(--stone);line-height:1.6;margin:0;font-weight:300;}
@media (max-width:860px){
  .bd-facts{padding:48px 22px;}
  .bd-fact{flex:1 1 45%;border-left:none !important;padding:22px 0;border-top:1px solid var(--line);padding-left:0 !important;}
  .bd-fact:nth-child(odd){padding-right:20px;}
  .bd-fact:nth-child(even){padding-left:20px !important;}
}

/* House */
.bd-house{padding:150px 32px 70px;max-width:1280px;margin:0 auto;}
.bd-house__grid{
  display:grid;grid-template-columns:repeat(12,1fr);gap:30px;
}
.bd-house__frame{position:relative;overflow:hidden;border-radius:2px;width:100%;}
.bd-house__frame img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;transition:transform 1s cubic-bezier(.16,.8,.24,1);}
.bd-house__card:hover .bd-house__frame img{transform:scale(1.045);}
.bd-house__caption{
  margin:16px 2px 0;font-size:12.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--stone);font-weight:500;
}
@media (max-width:900px){
  .bd-house{padding:96px 22px 40px;}
  .bd-house__grid{
    display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;
    margin:0 -22px;padding:0 22px 6px;scroll-padding-inline:22px;
  }
  .bd-house__card{flex:0 0 82%;scroll-snap-align:start;grid-column:auto !important;}
  .bd-house__frame{aspect-ratio:4/5 !important;}
}

/* Gallery */
.bd-gallery{padding:70px 32px 150px;max-width:1280px;margin:0 auto;}
.bd-gallery__grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
}
.bd-gallery__item{overflow:hidden;border-radius:2px;padding:0;position:relative;aspect-ratio:3/4;}
.bd-gallery__item img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(.16,.8,.24,1), filter .5s ease;}
.bd-gallery__item:hover img{transform:scale(1.06);filter:brightness(0.94);}
/* La prima foto occupa 2 colonne e 2 righe: l'altezza la decide la griglia,
   per questo qui l'aspect-ratio si annulla. */
.bd-gallery__item--grande{grid-column:span 2;grid-row:span 2;aspect-ratio:auto;}
@media (max-width:900px){
  .bd-gallery{padding:56px 0 100px;}
  .bd-gallery__grid{
    grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:82%;
    grid-auto-rows:300px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 22px;gap:16px;scroll-padding-inline:22px;
  }
  .bd-gallery__item{scroll-snap-align:start;grid-column:auto !important;grid-row:auto !important;aspect-ratio:auto;}
}

/* Testimonial: una citazione sola, su fascia sabbia per staccarla dal
   flusso. Il link porta un selettore a DUE classi perche .bd-root a
   imposta color:inherit e batterebbe la singola classe. */
.bd-quote{
  background:var(--ivory-2);border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);padding:110px 32px;
}
/* Recensioni: una scheda per ospite, alta quanto il suo testo: aprendo una
   traduzione non si allungano a vuoto anche le altre. */
.bd-rec{max-width:1280px;margin:0 auto;}
.bd-rec__lista{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:start;}
.bd-rec__card{
  margin:0;background:var(--white);border:1px solid var(--line);border-radius:2px;
  padding:34px 30px 28px;display:flex;flex-direction:column;gap:18px;
}
.bd-rec__voto{
  display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0;
  font-family:'Inter',sans-serif;font-size:13px;color:var(--stone);
}
.bd-rec__stelle{color:var(--sand);font-size:15px;letter-spacing:0.12em;}
.bd-rec__punteggio{
  font-weight:600;font-size:13px;color:var(--white);background:var(--sea-deep);
  padding:3px 8px;border-radius:2px;
}
.bd-rec__testo{
  margin:0;font-family:'Fraunces',serif;font-weight:340;font-style:italic;
  font-size:18px;line-height:1.6;color:var(--sea-deep);white-space:pre-line;
}
.bd-rec__testo p{margin:0;}
.bd-rec__testo .bd-rec__titolo{font-style:normal;font-weight:500;margin:0 0 8px;}
.bd-rec__traduzione{font-family:'Inter',sans-serif;font-size:14px;line-height:1.7;color:var(--stone);}
.bd-rec__traduzione summary{cursor:pointer;color:var(--sea);}
.bd-rec__traduzione p{margin:10px 0 0;white-space:pre-line;}
.bd-rec__firma{
  padding-top:6px;display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px;
  font-family:'Inter',sans-serif;font-size:14px;
}
.bd-rec__autore{font-weight:500;color:var(--sea-deep);}
.bd-rec__firma time{color:var(--stone);}
.bd-quote .bd-rec__link{
  margin-left:auto;color:var(--sea);text-decoration:none;
  border-bottom:1px solid rgba(56,102,124,0.35);transition:border-color .15s;
}
.bd-quote .bd-rec__link:hover,
.bd-quote .bd-rec__link:focus-visible{border-bottom-color:var(--sea);}
.bd-rec__nota{max-width:640px;margin:34px auto 0;text-align:center;font-size:13.5px;line-height:1.7;color:var(--stone);}
@media (max-width:900px){
  .bd-quote{padding:76px 22px;}
  .bd-rec__lista{
    display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;
    margin:0 -22px;padding:0 22px 6px;scroll-padding-inline:22px;
  }
  .bd-rec__card{flex:0 0 86%;scroll-snap-align:start;padding:28px 24px 24px;}
  .bd-rec__testo{font-size:17px;}
}

.bd-lightbox{
  position:fixed;inset:0;background:rgba(8,18,25,0.96);z-index:300;
  display:flex;align-items:center;justify-content:center;padding:40px;
  animation:bd-fade .3s ease;
}
@keyframes bd-fade{from{opacity:0;}to{opacity:1;}}
.bd-lightbox__figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:16px;max-width:92vw;}
.bd-lightbox__imgwrap{position:relative;width:min(86vw,860px);height:min(74vh,600px);border-radius:2px;overflow:hidden;}
.bd-lightbox__imgwrap .bd-photo__img{object-fit:contain;background:rgba(255,255,255,0.03);}
.bd-lightbox__figure figcaption{color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;}
.bd-lightbox__close{position:absolute;top:26px;right:30px;color:var(--white);font-size:32px;line-height:1;font-weight:300;}
.bd-lightbox__nav{position:absolute;top:50%;transform:translateY(-50%);color:var(--white);font-size:40px;font-weight:300;padding:10px 20px;opacity:0.8;transition:opacity .3s ease;}
.bd-lightbox__nav:hover{opacity:1;}
.bd-lightbox__nav--prev{left:12px;}
.bd-lightbox__nav--next{right:12px;}

/* Location */
.bd-location{padding-bottom:130px;}
.bd-location__hero{position:relative;height:82vh;min-height:520px;overflow:hidden;}
.bd-location__hero img{width:100%;height:100%;object-fit:cover;}
.bd-location__hero-content{
  position:absolute;inset:0;background:linear-gradient(180deg, rgba(16,40,56,0) 45%, rgba(16,40,56,0.58));
  display:flex;align-items:flex-end;padding:80px 32px;
}
.bd-location__hero-content > div{max-width:620px;margin:0 auto;width:100%;text-align:left;}
/* Mappa: scheda a due colonne, indirizzo e distanze a sinistra, riquadro
   della mappa a destra. L'iframe compare solo dopo il click (vedi MapCard). */
.bd-map{
  max-width:1280px;margin:110px auto 0;padding:0 32px;
  display:grid;grid-template-columns:minmax(280px,1fr) 1.45fr;gap:48px;align-items:center;
}
.bd-map__address{
  font-style:normal;display:flex;flex-direction:column;gap:3px;
  margin:28px 0 0;font-size:15.5px;line-height:1.65;color:var(--stone);font-weight:300;
}
.bd-map__name{font-weight:500;color:var(--sea-deep);}
.bd-map__distances{
  list-style:none;padding:0;margin:30px 0 0;
  display:grid;grid-template-columns:repeat(2,1fr);gap:20px 28px;
}
.bd-map__distances li{display:flex;flex-direction:column;gap:2px;}
.bd-map__dist-value{
  font-family:'Fraunces',serif;font-size:22px;font-weight:400;color:var(--sea-deep);
  font-variant-numeric:tabular-nums;line-height:1.1;
}
.bd-map__dist-label{font-size:12.5px;color:var(--stone);font-weight:300;line-height:1.4;}
.bd-map__open{
  display:inline-block;margin-top:32px;font-size:12px;letter-spacing:0.06em;
  text-transform:uppercase;font-weight:500;color:var(--sea-deep);
  border-bottom:1px solid currentColor;padding-bottom:3px;
}
.bd-map__open:hover{opacity:0.65;}

.bd-map__frame{
  position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:2px;
  background:var(--ivory-2);border:1px solid var(--line);
}
.bd-map__iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;}
.bd-map__placeholder{
  position:absolute;inset:0;width:100%;height:100%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
  padding:32px;text-align:center;color:var(--sea);
  background:
    radial-gradient(circle at 30% 25%, rgba(205,179,136,0.16), transparent 55%),
    radial-gradient(circle at 72% 70%, rgba(56,102,124,0.13), transparent 52%),
    var(--ivory-2);
  transition:background-color .25s;
}
.bd-map__placeholder:hover .bd-map__cta{border-bottom-color:currentColor;}
.bd-map__placeholder:focus-visible{outline:2px solid var(--sea);outline-offset:-4px;}
.bd-map__pin{display:block;color:var(--sea);opacity:0.75;}
.bd-map__cta{
  font-size:13px;letter-spacing:0.07em;text-transform:uppercase;font-weight:500;
  color:var(--sea-deep);border-bottom:1px solid transparent;padding-bottom:3px;
}
.bd-map__privacy{
  font-size:11.5px;line-height:1.5;color:var(--stone);font-weight:300;max-width:34ch;opacity:0.85;
}

@media (max-width:900px){
  .bd-map{grid-template-columns:1fr;gap:32px;margin-top:76px;}
  .bd-map__frame{aspect-ratio:3/2;}
  .bd-map__distances{margin-top:24px;}
}

/* Servizi e dotazioni */
.bd-amen{padding:120px 32px;background:var(--ivory);}
.bd-amen__inner{max-width:1080px;margin:0 auto;}
.bd-amen__subtitle{
  font-family:'Fraunces',serif;font-weight:500;font-size:21px;
  margin:0 0 22px;letter-spacing:-0.005em;color:var(--sea-deep);
}

.bd-amen__beds{margin-top:66px;}
.bd-amen__bedrow{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.bd-bed{
  display:flex;flex-direction:column;gap:5px;
  background:var(--white);border:1px solid var(--line);border-radius:2px;padding:22px 24px;
}
.bd-bed__room{
  font-size:11px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--sand);font-weight:600;
}
.bd-bed__detail{font-size:15.5px;color:var(--sea-deep);line-height:1.45;font-weight:400;}
.bd-bed__places{
  font-family:'Fraunces',serif;font-size:17px;color:var(--stone);
  font-variant-numeric:tabular-nums;margin-top:4px;
}

.bd-amen__grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:44px 40px;
  margin-top:72px;padding-top:56px;border-top:1px solid var(--line);
}
.bd-amen__grouptitle{
  font-size:11.5px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--sea);font-weight:600;margin:0 0 16px;
}
.bd-amen__group ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px;}
.bd-amen__group li{
  font-size:15px;line-height:1.5;color:var(--stone);font-weight:300;
  padding-left:19px;position:relative;
}
/* Trattino invece di pallino: più sobrio, coerente con il resto del sito. */
.bd-amen__group li::before{
  content:"";position:absolute;left:0;top:11px;
  width:9px;height:1px;background:var(--sand);
}

.bd-amen__family{
  margin-top:72px;padding:34px 36px;
  background:var(--ivory-2);border-left:2px solid var(--sand);border-radius:0 2px 2px 0;
}
.bd-amen__family p{
  margin:0;font-size:15.5px;line-height:1.7;color:var(--stone);font-weight:300;max-width:66ch;
}

.bd-amen__rules{margin-top:60px;padding-top:52px;border-top:1px solid var(--line);}
.bd-amen__rules dl{
  margin:0;display:grid;grid-template-columns:repeat(2,1fr);gap:2px 44px;
}
.bd-amen__rules dl > div{
  display:flex;gap:16px;align-items:baseline;
  padding:13px 0;border-bottom:1px solid var(--line);
}
.bd-amen__rules dt{
  flex:none;width:104px;font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--sea-deep);font-weight:600;
}
.bd-amen__rules dd{margin:0;font-size:14.5px;line-height:1.55;color:var(--stone);font-weight:300;}

@media (max-width:900px){
  .bd-amen__grid{grid-template-columns:repeat(2,1fr);gap:36px 32px;}
  .bd-amen__bedrow{grid-template-columns:1fr;}
  .bd-amen__rules dl{grid-template-columns:1fr;gap:0;}
}
@media (max-width:600px){
  .bd-amen{padding:80px 22px;}
  .bd-amen__grid{grid-template-columns:1fr;gap:32px;margin-top:52px;padding-top:44px;}
  .bd-amen__family{padding:26px 24px;margin-top:52px;}
  .bd-amen__rules dt{width:88px;}
}

/* Domande frequenti */
.bd-faq{padding:120px 32px;background:var(--ivory);}
.bd-faq__inner{max-width:820px;margin:0 auto;}
.bd-faq__list{margin-top:56px;border-top:1px solid var(--line);}
.bd-faq__item{border-bottom:1px solid var(--line);}
.bd-faq__item summary{
  display:flex;align-items:flex-start;justify-content:space-between;gap:24px;
  padding:22px 0;cursor:pointer;list-style:none;
  font-size:17px;line-height:1.5;font-weight:500;color:var(--sea-deep);
  transition:color .15s;
}
.bd-faq__item summary::-webkit-details-marker{display:none;}
.bd-faq__item summary:hover{color:var(--sea);}
.bd-faq__item summary:focus-visible{outline:2px solid var(--sea);outline-offset:3px;}

/* Il segno è una croce che ruota diventando un meno: due sole barre, nessuna
   icona da caricare. */
.bd-faq__sign{position:relative;flex:none;width:14px;height:14px;margin-top:5px;}
.bd-faq__sign::before,.bd-faq__sign::after{
  content:"";position:absolute;left:0;top:6px;width:14px;height:1.5px;
  background:var(--sand);transition:transform .25s ease;
}
.bd-faq__sign::after{transform:rotate(90deg);}
.bd-faq__item[open] .bd-faq__sign::after{transform:rotate(0deg);}

.bd-faq__answer{padding:0 0 24px;max-width:66ch;}
/* Selettore a due classi, come per gli altri link del sito: la regola
   generale .bd-root a imposta color:inherit e altrimenti vincerebbe. */
.bd-faq .bd-faq__more{
  display:inline-block;margin-top:14px;font-size:12px;letter-spacing:0.06em;
  text-transform:uppercase;font-weight:500;color:var(--sea);
  border-bottom:1px solid currentColor;padding-bottom:3px;
}
.bd-faq .bd-faq__more:hover{opacity:0.7;}
.bd-faq__answer p{
  margin:0;font-size:15.5px;line-height:1.75;color:var(--stone);font-weight:300;
}

@media (max-width:600px){
  .bd-faq{padding:80px 22px;}
  .bd-faq__list{margin-top:40px;}
  .bd-faq__item summary{font-size:16px;gap:16px;padding:19px 0;}
  .bd-faq__answer p{font-size:15px;}
}

/* Modulo richiesta disponibilità */
.bd-form{background:var(--ivory-2);border-top:1px solid var(--line);padding:110px 32px;}
.bd-form__inner{max-width:760px;margin:0 auto;}
.bd-form__grid{
  display:grid;grid-template-columns:1fr 1fr;gap:22px 24px;margin-top:44px;
}
.bd-field{display:flex;flex-direction:column;gap:8px;}
.bd-field--full{grid-column:1 / -1;}
.bd-field > span{
  font-size:11.5px;letter-spacing:0.12em;text-transform:uppercase;
  color:var(--stone);font-weight:500;
}
.bd-form input[type=text],
.bd-form input[type=email],
.bd-form input[type=date],
.bd-form select,
.bd-form textarea{
  font-family:'Inter',sans-serif;font-size:15px;color:var(--sea-deep);
  background:var(--white);border:1px solid var(--line);border-radius:2px;
  padding:13px 14px;width:100%;
  transition:border-color .15s, box-shadow .15s;
}
.bd-form textarea{resize:vertical;min-height:110px;line-height:1.6;}
.bd-form input:focus,.bd-form select:focus,.bd-form textarea:focus{
  outline:none;border-color:var(--sea);box-shadow:0 0 0 3px rgba(56,102,124,0.12);
}
.bd-form input:invalid:not(:placeholder-shown){border-color:#A4553C;}

/* Campo esca per gli spambot: invisibile a chi naviga, compilato dai robot.
   Va nascosto senza display:none, altrimenti alcuni bot lo riconoscono. */
.bd-form__hp{position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;}

.bd-form__consent{
  display:flex;align-items:flex-start;gap:11px;
  font-size:13.5px;line-height:1.6;color:var(--stone);font-weight:300;cursor:pointer;
}
.bd-form__consent input{margin-top:3px;flex:none;width:16px;height:16px;accent-color:var(--sea);}
.bd-form__consent a{color:var(--sea);border-bottom:1px solid currentColor;}

.bd-form__actions{display:flex;flex-wrap:wrap;align-items:center;gap:18px;margin-top:6px;}
.bd-btn.bd-btn--send{
  background:var(--sea-deep);color:var(--ivory);border:none;
}
.bd-btn.bd-btn--send:hover:not(:disabled){
  background:#0b1d29;transform:translateY(-2px);box-shadow:0 14px 28px rgba(16,40,56,0.2);
}
.bd-btn.bd-btn--send:disabled{opacity:0.55;cursor:default;}
.bd-form__error{font-size:13.5px;color:#A4553C;margin:0;font-weight:400;line-height:1.5;}

.bd-form__done{text-align:center;padding:20px 0;}
.bd-form__done .bd-h3{margin-top:14px;}

@media (max-width:640px){
  .bd-form{padding:76px 22px;}
  .bd-form__grid{grid-template-columns:1fr;gap:18px;margin-top:34px;}
}

.bd-explore{max-width:1280px;margin:110px auto 0;padding:0 32px;}
.bd-explore__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px 22px;}
.bd-explore__img{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:2px;margin-bottom:18px;}
.bd-explore__img img{transition:transform .7s cubic-bezier(.16,.8,.24,1);}
.bd-explore__card:hover .bd-explore__img img{transform:scale(1.06);}
.bd-explore__card h4{font-family:'Fraunces',serif;font-size:17px;font-weight:500;margin:0 0 6px;}
.bd-explore__card p{font-size:13.5px;color:var(--stone);line-height:1.6;margin:0;font-weight:300;}
/* Tutta la scheda e' un link. Selettore a due classi per non perdere contro
   .bd-root a, e contorno visibile quando ci si arriva con il tasto Tab. */
.bd-explore .bd-explore__card{
  display:block;text-decoration:none;color:inherit;border-radius:2px;
}
.bd-explore .bd-explore__card:focus-visible{
  outline:2px solid var(--sea);outline-offset:6px;
}
.bd-explore__link{
  display:inline-block;margin-top:12px;font-size:12px;letter-spacing:0.04em;
  color:var(--sea-deep);border-bottom:1px solid currentColor;padding-bottom:2px;font-weight:500;
}
/* L'etichetta ora e' uno span: l'effetto al passaggio del mouse va preso
   dalla scheda, non da se stessa. */
.bd-explore__card:hover .bd-explore__link{opacity:0.7;}
@media (max-width:900px){
  .bd-explore__grid{grid-template-columns:repeat(2,1fr);}
  .bd-explore{margin-top:76px;}
}

/* Booking */
.bd-booking{background:var(--sea-deep);padding:150px 32px;position:relative;overflow:hidden;}
.bd-booking__glow{
  position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 50% at 50% 0%, rgba(56,102,124,0.55), transparent 70%);
  pointer-events:none;
}
.bd-booking__inner{max-width:640px;margin:0 auto;text-align:center;position:relative;color:var(--white);}
.bd-booking__inner .bd-body{margin-left:auto;margin-right:auto;}
.bd-booking__ctas{display:flex;gap:34px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:40px;}
/* Le due piattaforme restano raggiungibili ma in secondo piano: testo, non
   pulsanti. Il selettore del link e' a due classi perche .bd-root a
   imposta color:inherit e batterebbe la singola classe. */
.bd-booking__alt{
  font-family:'Inter',sans-serif;font-size:13px;letter-spacing:0.06em;
  text-transform:uppercase;color:rgba(255,255,255,0.55);margin:38px 0 0;
}
.bd-booking__ota{
  display:flex;gap:12px;justify-content:center;align-items:center;
  flex-wrap:wrap;margin-top:12px;font-family:'Inter',sans-serif;font-size:15px;
}
.bd-booking .bd-booking__otalink{
  color:rgba(255,255,255,0.82);text-decoration:none;
  border-bottom:1px solid rgba(255,255,255,0.32);transition:border-color .15s,color .15s;
}
.bd-booking .bd-booking__otalink:hover,
.bd-booking .bd-booking__otalink:focus-visible{color:#fff;border-bottom-color:#fff;}
.bd-booking__sep{color:rgba(255,255,255,0.4);}

/* Footer */
.bd-footer{background:var(--ivory-2);border-top:1px solid var(--line);padding:110px 32px 34px;}
.bd-footer__top{max-width:1280px;margin:0 auto;padding-bottom:56px;}
.bd-logo--footer{display:block;height:56px;width:auto;margin:0 0 14px;}
@media (max-width:700px){.bd-logo--footer{height:44px;}}
.bd-footer__tagline{font-family:'Fraunces',serif;font-style:italic;font-size:16px;color:var(--stone);margin:0;}
.bd-footer__grid{
  max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:40px;
  padding:40px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  font-size:14px;color:var(--stone);font-weight:300;
}
.bd-footer__grid p{margin:0 0 6px;}
.bd-footer__title{text-transform:uppercase;letter-spacing:0.12em;font-size:11px;color:var(--sea-deep);font-weight:600;margin-bottom:14px !important;}
/* Calendario disponibilita */
.bd-cal{padding:0 32px 20px;min-height:120px;}
.bd-cal__inner{max-width:860px;margin:0 auto;}
.bd-cal__stato{text-align:center;color:var(--stone);font-size:15px;margin:26px 0 0;}
.bd-cal__stato--errore{color:var(--sea-deep);}
.bd-cal .bd-cal__link{color:var(--sea);border-bottom:1px solid rgba(56,102,124,0.35);text-decoration:none;white-space:nowrap;}
.bd-cal__esempio{
  text-align:center;font-size:12.5px;letter-spacing:0.04em;color:var(--stone);
  background:var(--ivory-2);border:1px dashed var(--line);border-radius:2px;
  padding:10px 14px;margin:22px auto 0;max-width:520px;
}
.bd-cal__barra{
  display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;
  margin:34px 0 18px;
}
.bd-cal__freccia{
  font-size:17px;line-height:1;color:var(--sea-deep);
  border:1px solid var(--line);border-radius:2px;padding:8px 14px;background:var(--white);
  transition:border-color .15s, opacity .15s;
}
.bd-cal__freccia:hover:not(:disabled){border-color:var(--sea);}
.bd-cal__freccia:disabled{opacity:0.35;cursor:default;}
.bd-cal__legenda{
  display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--stone);
  letter-spacing:0.03em;justify-content:center;white-space:nowrap;
}
.bd-cal__chip{width:13px;height:13px;border-radius:2px;display:inline-block;}
.bd-cal__chip--libero{background:var(--white);border:1px solid var(--line);}
.bd-cal__chip--occupato{background:var(--ivory-2);border:1px solid var(--line);position:relative;}
.bd-cal__chip--occupato::after{
  content:"";position:absolute;inset:1px;
  background:linear-gradient(135deg,transparent 44%,var(--stone) 44%,var(--stone) 56%,transparent 56%);
}
.bd-cal__mesi{display:grid;grid-template-columns:1fr 1fr;gap:34px;}
.bd-cal__titolo{
  font-family:'Fraunces',serif;font-size:17px;font-weight:500;color:var(--sea-deep);
  margin:0 0 12px;text-align:center;text-transform:capitalize;
}
.bd-cal__intestazione,.bd-cal__griglia{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;}
.bd-cal__intestazione{
  font-size:11px;letter-spacing:0.08em;color:var(--stone);text-align:center;
  margin-bottom:6px;text-transform:uppercase;
}
.bd-cal__g,.bd-cal__vuota{
  aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  font-size:13.5px;border-radius:2px;
}
.bd-cal__g{background:var(--white);border:1px solid var(--line);color:var(--sea-deep);}
.bd-cal__g--passata{background:transparent;border-color:transparent;color:rgba(105,98,79,0.35);}
/* Occupato: non solo un colore diverso, anche una trama. Chi non distingue
   bene i colori deve comunque vedere la differenza. */
.bd-cal__g--occupata{
  background:var(--ivory-2);color:rgba(105,98,79,0.55);
  background-image:repeating-linear-gradient(135deg,transparent 0 5px,rgba(105,98,79,0.30) 5px 7px);
}
/* Giorni selezionabili: sono pulsanti veri, raggiungibili da tastiera.
   Il selettore ".bd-cal button.bd-cal__g" pesa più di ".bd-root button",
   che altrimenti toglierebbe sfondo e bordo a tutti i pulsanti del sito.
   Le regole degli stati vengono dopo e hanno lo stesso peso: vincono loro. */
.bd-cal button.bd-cal__g{
  font:inherit;font-size:13.5px;padding:0;cursor:pointer;
  background:var(--white);border:1px solid var(--line);color:var(--sea-deep);
  transition:border-color .15s, background-color .15s;
}
.bd-cal button.bd-cal__g--occupata{
  background:var(--ivory-2);color:rgba(105,98,79,0.55);
  background-image:repeating-linear-gradient(135deg,transparent 0 5px,rgba(105,98,79,0.30) 5px 7px);
}
.bd-cal button.bd-cal__g:hover{border-color:var(--sea);}
.bd-cal button.bd-cal__g:focus-visible{outline:2px solid var(--sea);outline-offset:1px;}
.bd-cal button.bd-cal__g--dentro{background:rgba(56,102,124,0.12);border-color:rgba(56,102,124,0.28);}
.bd-cal button.bd-cal__g--inizio,
.bd-cal button.bd-cal__g--fine{background:var(--sea-deep);background-image:none;border-color:var(--sea-deep);color:var(--white);}
.bd-cal__scelta{margin:26px 0 0;text-align:center;min-height:48px;}
.bd-cal__guida{font-size:14.5px;line-height:1.6;color:var(--stone);margin:0;}
.bd-cal__avviso{font-size:14.5px;line-height:1.6;color:var(--sea-deep);margin:0 0 10px;}
.bd-cal__riepilogo{font-family:'Fraunces',serif;font-size:19px;color:var(--sea-deep);margin:0 0 16px;}
.bd-cal__azioni{display:flex;flex-wrap:wrap;gap:12px 22px;align-items:center;justify-content:center;}
.bd-cal .bd-cal__annulla{
  padding:0 0 2px;font-size:14px;color:var(--stone);
  border-bottom:1px solid rgba(105,98,79,0.35);
}
@media (max-width:700px){
  .bd-cal{padding:0 22px 16px;}
  .bd-cal__mesi{grid-template-columns:1fr;gap:28px;}
  .bd-cal__barra{margin:26px 0 14px;gap:8px;}
  .bd-cal__freccia{padding:8px 11px;}
  .bd-cal__legenda{gap:6px;font-size:12px;}
}

.bd-footer__coda{display:flex;align-items:center;gap:20px;}
.bd-footer__totop{font-size:12px;color:var(--stone);text-decoration:underline;text-underline-offset:3px;letter-spacing:0.02em;}
.bd-footer__totop:hover{color:var(--sea-deep);}
.bd-footer__bottom{max-width:1280px;margin:26px auto 0;font-size:12px;color:var(--stone);letter-spacing:0.02em;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
.bd-footer__privacy{text-decoration:underline;text-underline-offset:3px;}
@media (max-width:700px){
  .bd-footer{padding:80px 22px 30px;}
  .bd-footer__grid{grid-template-columns:1fr;gap:28px;}
}
/* Sotto gli 860px compare la sticky CTA mobile (posizionata fixed, bottom:0):
   senza questo spazio extra copre l'ultima riga del footer (copyright/Privacy).
   86px riprende lo stesso ingombro già usato per .bd-whatsapp qui sotto, che
   posiziona il pulsante WhatsApp sopra la stessa barra. */
@media (max-width:860px){
  .bd-footer__bottom{padding-bottom:calc(86px + env(safe-area-inset-bottom));}
}

/* Sticky mobile CTA */
.bd-stickycta{
  position:fixed;left:0;right:0;bottom:-100px;z-index:90;
  padding:14px 18px calc(14px + env(safe-area-inset-bottom));
  background:rgba(250,247,241,0.95);backdrop-filter:blur(8px);
  border-top:1px solid var(--line);
  transition:bottom .4s ease;
  display:none;
}
.bd-stickycta.is-visible{bottom:0;}
.bd-stickycta button{
  width:100%;padding:15px;background:var(--sea-deep);color:var(--white);
  text-transform:uppercase;letter-spacing:0.07em;font-size:13px;font-weight:500;border-radius:2px;
}
@media (max-width:860px){
  .bd-stickycta{display:block;}
}

/* Pulsante WhatsApp */
.bd-whatsapp{
  position:fixed;right:24px;bottom:28px;z-index:95;
  width:54px;height:54px;border-radius:50%;
  background:#25D366;color:#fff;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 20px rgba(16,40,56,0.28);
  transition:transform .3s ease, box-shadow .3s ease;
}
.bd-whatsapp:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(16,40,56,0.34);}
@media (max-width:860px){
  .bd-whatsapp{right:16px;bottom:calc(86px + env(safe-area-inset-bottom));width:50px;height:50px;}
}
@media (max-width:760px){
  .bd-whatsapp{transition:transform .3s ease, box-shadow .3s ease, opacity .3s ease;}
  .bd-whatsapp.bd-whatsapp--apertura{opacity:0;pointer-events:none;transform:scale(0.8);}
}

/* ---------------- Promozione prenotazione diretta (settembre 2026) ----------------
   Voluta insistente da Francesco: striscia in cima, riquadro nell'apertura,
   due fasce a metà pagina, sezione Prenota, modulo, calendario, footer,
   barra mobile e pulsante WhatsApp. Colore guida: la sabbia del marchio,
   con testo blu scuro (contrasto 7,5:1). Il verde di WhatsApp porta testo
   blu scuro, non bianco: il bianco su quel verde non si legge (2:1). */
.bd-chip{
  display:inline-block;padding:3px 7px;border-radius:2px;
  background:var(--sand);color:var(--sea-deep);
  font-weight:700;font-size:0.92em;letter-spacing:0.01em;line-height:1.2;
  text-transform:none;white-space:nowrap;vertical-align:1px;
}
.bd-btn .bd-chip{margin-left:2px;}
/* Le ancore dei menu non devono finire sotto l'intestazione, ora più alta. */
.bd-root section[id]{scroll-margin-top:34px;}

/* Striscia in cima (dentro l'intestazione fissa) */
.bd-promobar{
  position:relative;z-index:2;
  display:flex;align-items:center;justify-content:center;gap:8px 22px;
  padding:8px 22px;background:var(--sand);color:var(--sea-deep);
  font-size:13px;line-height:1.35;text-align:center;
}
.bd-promobar__testo{margin:0;display:flex;align-items:center;gap:10px;font-weight:500;}
.bd-promobar .bd-chip{background:var(--sea-deep);color:var(--ivory);}
.bd-promobar__link{display:flex;align-items:center;gap:16px;flex:none;}
.bd-root .bd-promobar__link a{
  display:inline-flex;align-items:center;gap:5px;font-weight:700;
  text-decoration:underline;text-underline-offset:3px;color:var(--sea-deep);
}
.bd-root .bd-promobar__link a:hover{opacity:0.75;}
.bd-promobar__media,.bd-promobar__breve{display:none;}
@media (max-width:1180px){
  .bd-promobar__lunga{display:none;}
  .bd-promobar__media{display:inline;}
}
@media (max-width:640px){
  .bd-promobar{padding:7px 14px;gap:12px;font-size:12.5px;}
  .bd-promobar__media{display:none;}
  .bd-promobar__breve{display:inline;}
  .bd-root .bd-promobar__link .bd-promobar__email{display:none;}
}

/* Riquadro nell'apertura */
.bd-root .bd-hero__promo{
  display:inline-flex;align-items:center;gap:16px;margin-top:30px;max-width:540px;
  padding:12px 20px 12px 12px;border-radius:2px;
  background:rgba(16,40,56,0.62);border:1px solid rgba(205,179,136,0.7);color:var(--white);
  backdrop-filter:blur(6px);
  animation:bd-fadeup 1s cubic-bezier(.16,.8,.24,1) 1.15s both;
  transition:background .3s ease;
}
.bd-root .bd-hero__promo:hover{background:rgba(16,40,56,0.78);}
.bd-hero__promo-cifra{
  flex:none;font-family:'Fraunces',serif;font-weight:500;font-size:34px;line-height:1;
  padding:10px 12px;border-radius:2px;background:var(--sand);color:var(--sea-deep);letter-spacing:-0.01em;
}
.bd-hero__promo-testo{font-size:14.5px;line-height:1.45;}
.bd-hero__promo-cta{
  display:flex;align-items:center;gap:6px;margin-top:6px;font-weight:600;color:var(--sand);
  text-decoration:underline;text-underline-offset:3px;
}
@media (max-width:760px){
  /* Sul telefono il riquadro promo prende il posto dell'invito a scorrere,
     che finirebbe sopra al riquadro. */
  .bd-hero__scrolldown{display:none;}
  .bd-hero__content{padding-bottom:40px;}
  .bd-hero__subtitle{margin-bottom:20px;}
  .bd-hero__info{padding-top:18px;}
  .bd-hero__info{margin-bottom:28px;}
  .bd-hero__ctas{gap:18px 28px;}
  .bd-root .bd-hero__promo{margin-top:22px;gap:12px;padding:10px 14px 10px 10px;}
  .bd-hero__promo-cifra{font-size:26px;padding:8px 9px;}
  .bd-hero__promo-testo{font-size:13.5px;}
}

/* Pulsanti dei tre canali */
.bd-promo__azioni{display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
.bd-root .bd-promo__btn{
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  padding:14px 22px;border-radius:2px;border:1px solid transparent;
  font-size:13px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;white-space:nowrap;
  transition:transform .3s ease, box-shadow .3s ease, background .3s ease;
}
.bd-root .bd-promo__btn:hover{transform:translateY(-2px);box-shadow:0 12px 24px rgba(16,40,56,0.2);}
.bd-root .bd-promo__btn--wa{background:#25D366;color:var(--sea-deep);}
.bd-root .bd-promo__btn--email{background:var(--sea-deep);color:var(--ivory);}
.bd-root .bd-promo__btn--modulo{background:transparent;color:var(--sea-deep);border-color:var(--sea-deep);}
.bd-root .bd-promo__btn--grande{margin-top:26px;padding:17px 30px;font-size:14px;}
@media (max-width:640px){
  .bd-promo__azioni{width:100%;}
  .bd-root .bd-promo__btn{flex:1 1 auto;}
}

/* Fasce a metà pagina */
.bd-promofascia{background:var(--sand);color:var(--sea-deep);padding:40px 32px;}
.bd-promofascia__inner{
  max-width:1280px;margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;gap:24px 48px;flex-wrap:wrap;
}
.bd-promofascia__testo{
  margin:0;display:flex;align-items:center;gap:20px;max-width:660px;
  font-family:'Fraunces',serif;font-weight:400;font-size:clamp(19px,2.1vw,25px);line-height:1.3;
}
.bd-promofascia__cifra{flex:none;font-size:clamp(44px,5.4vw,66px);font-weight:500;line-height:1;letter-spacing:-0.02em;}
@media (max-width:640px){
  .bd-promofascia{padding:32px 22px;}
  .bd-promofascia__testo{gap:14px;}
}

/* Sezione Prenota */
.bd-booking__offerta{margin:8px 0 26px;display:flex;flex-direction:column;align-items:center;gap:8px;}
.bd-booking__fino{font-family:'Fraunces',serif;font-style:italic;font-size:22px;color:rgba(255,255,255,0.86);}
.bd-booking__cifra{
  font-family:'Fraunces',serif;font-weight:400;font-size:clamp(88px,15vw,160px);
  line-height:0.9;letter-spacing:-0.03em;color:var(--sand);
}
.bd-booking__ctas .bd-promo__azioni{justify-content:center;}
.bd-booking .bd-promo__btn--email{background:transparent;color:var(--white);border-color:rgba(255,255,255,0.65);}
.bd-booking__nota{margin:22px auto 0;font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.72);max-width:46ch;}

/* Modulo */
.bd-form__promo{
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px 24px;
  margin:-18px 0 0;padding:20px 22px;background:var(--white);
  border:1px solid rgba(205,179,136,0.8);border-left:4px solid var(--sand);border-radius:2px;
}
.bd-form__promo p{margin:0;font-size:15px;line-height:1.55;color:var(--sea-deep);max-width:34ch;}

/* Calendario */
.bd-cal__promo{margin:-6px 0 16px;font-size:14.5px;line-height:1.55;color:var(--sea-deep);}

/* Footer */
.bd-footer__promo{margin:16px 0 0;font-size:14px;line-height:1.7;color:var(--sea-deep);}
.bd-footer__promolink{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:6px;}
.bd-root .bd-footer__promolink a{display:inline-flex;align-items:center;gap:6px;font-weight:600;text-decoration:underline;text-underline-offset:3px;}
.bd-root .bd-footer__contatto{text-decoration:underline;text-decoration-color:rgba(105,98,79,0.35);text-underline-offset:3px;}
.bd-root .bd-footer__contatto:hover{color:var(--sea-deep);}

/* Fra tablet e computer piccolo lo spazio dell'intestazione è poco: il menu
   resta su una riga e l'etichetta del pulsante cede il posto (lo sconto è
   comunque scritto nella striscia subito sopra). */
.bd-nav--desktop a{white-space:nowrap;}
@media (max-width:1100px){
  .bd-nav--desktop{gap:22px;}
  .bd-header__right .bd-chip{display:none;}
}

/* Barra mobile e pulsante WhatsApp */
.bd-stickycta .bd-chip{margin-left:6px;}
.bd-whatsapp__badge{
  position:absolute;top:-7px;right:-14px;
  padding:3px 6px;border-radius:10px;background:var(--sand);color:var(--sea-deep);
  font-size:11px;font-weight:700;line-height:1;white-space:nowrap;
  box-shadow:0 2px 6px rgba(16,40,56,0.25);
}

/* Cookie banner */
.bd-cookiebanner{
  position:fixed;left:20px;right:20px;bottom:20px;z-index:200;
  max-width:640px;margin:0 auto;
  background:var(--ivory);border:1px solid var(--line);border-radius:2px;
  box-shadow:0 20px 50px rgba(16,40,56,0.22);
  padding:22px 24px;
  display:flex;flex-direction:column;gap:16px;
}
.bd-cookiebanner p{margin:0;font-size:13.5px;line-height:1.6;color:var(--stone);font-weight:300;}
.bd-cookiebanner a{text-decoration:underline;color:var(--sea-deep);}
.bd-cookiebanner__actions{display:flex;gap:14px;justify-content:flex-end;flex-wrap:wrap;}
.bd-cookiebanner .bd-btn--ghost{padding:10px 0;border-bottom:1px solid var(--sea-deep);}
.bd-cookiebanner .bd-btn--ghost::after{content:none;}
@media (max-width:860px){
  .bd-cookiebanner{bottom:calc(150px + env(safe-area-inset-bottom));}
}
`;

/* ------------------------------------ APP ------------------------------------------ */

/* La lingua arriva dall'attributo lang della pagina (vedi src/main.jsx):
   "it" per index.html, "en" per en/index.html. Non è più uno stato che
   cambia in pagina — cambiare lingua significa cambiare indirizzo, quindi
   titolo, meta e dati strutturati li possiede ognuna delle due pagine HTML,
   coerentemente con la convenzione del progetto (SEO solo nell'HTML). */
export default function BellavistaDomus({ lang = "it" }) {
  const t = translations[lang];
  useScrollDepth();
  const [dateScelte, setDateScelte] = useState(null);

  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bd-root">
      {/* Gli stili vanno inseriti come HTML grezzo: come testo normale React
          nel prerendering trasforma apostrofi e "&" in codici (&#x27;, &amp;)
          che dentro <style> il browser non riconverte. Il CSS preparato per
          Google risultava rotto e React, trovando una differenza, rifaceva
          tutta la pagina da capo al caricamento. */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Header lang={lang} t={t} go={go} />
      <Hero t={t} go={go} />
      <Intro t={t} />
      <Features t={t} />
      {/* Promozione della prenotazione diretta: prima fascia appena finiti
          i punti forti, seconda dopo le recensioni (vedi "promo" nelle
          traduzioni per le regole sulla cifra). */}
      <PromoFascia t={t} go={go} testo={t.promo.fasciaAlto} posizione="fascia_alto" />
      <House t={t} />
      <Gallery t={t} />
      {/* Subito dopo le fotografie: si è appena finito di guardare la casa,
          ed è il momento in cui la parola di un ospite pesa di più. */}
      <Testimonial t={t} />
      <PromoFascia t={t} go={go} testo={t.promo.fasciaRecensioni} posizione="fascia_recensioni" />
      {/* Dopo le fotografie e prima della posizione: si vede la casa, si
          legge cosa contiene, poi si scopre dov'è. */}
      <Amenities t={t} />
      <Location t={t} />
      <Booking t={t} go={go} />
      {/* Le FAQ stanno subito prima del modulo: si tolgono gli ultimi dubbi,
          e chi ne ha ancora trova il modulo già lì sotto. */}
      <Faq t={t} />
      {/* Il calendario sta appena prima del modulo: l'ospite controlla le sue
          date e, se sono libere, ha già sotto gli occhi dove scrivere. */}
      <Calendario t={t} go={go} onScegli={setDateScelte} />
      {/* Il modulo porta l'id "contact": la voce Contatti del menu ci arriva
          direttamente, e il footer con i recapiti resta subito sotto. */}
      <ContactForm t={t} dateScelte={dateScelte} />
      <Footer t={t} go={go} />
      <StickyCta t={t} go={go} />
      <WhatsAppButton t={t} />
      <CookieBanner t={t} />
    </div>
  );
}
