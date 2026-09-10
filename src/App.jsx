import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================================
   BELLAVISTA DOMUS — sito vetrina per casa vacanze
   ----------------------------------------------------------------------------
   COME MODIFICARE QUESTO FILE (guida rapida)
   1) CONFIG.links        -> link di prenotazione Booking.com / Airbnb
   2) CONFIG.property      -> dati della struttura (nome, luogo, CIR/CIN, capienza)
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
    locationLine: "Torre a Mare · Bari · Puglia",
    guests: 7,
    bedrooms: 3,
    bathrooms: 2,
    cir: "072006C200127710",
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
    // 9 slot: mantieni questo numero per non alterare la composizione della griglia
    gallery: [
      "/images/galleria-01.jpg",
      "/images/galleria-02.jpg",
      "/images/galleria-03.jpg",
      "/images/galleria-04.jpg",
      "/images/galleria-05.jpg",
      "/images/galleria-06.jpg",
      "/images/galleria-07.jpg",
      "/images/galleria-08.jpg",
      "/images/galleria-09.jpg",
    ],
    location: "/images/posizione-mare.jpg",
    explore: {
      torreamare: "/images/puglia-torre-a-mare.jpg",
      bari: "/images/puglia-bari.jpg",
      polignano: "/images/puglia-polignano.jpg",
      monopoli: "/images/puglia-monopoli.jpg",
      alberobello: "/images/puglia-alberobello.jpg",
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
      info: `Fino a ${CONFIG.property.guests} ospiti · ${CONFIG.property.bedrooms} camere da letto · ${CONFIG.property.bathrooms} bagni`,
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
      text: "Scegli la piattaforma che preferisci: la disponibilità è sempre aggiornata.",
      booking: "Prenota su Booking.com",
      airbnb: "Prenota su Airbnb",
    },
    form: {
      eyebrow: "Richiesta",
      title: "Verifica le date del tuo soggiorno",
      text: "Scrivici le date e quanti siete: ti rispondiamo con disponibilità e prezzo, di solito entro poche ore.",
      name: "Nome e cognome",
      email: "Email",
      arrival: "Arrivo",
      departure: "Partenza",
      guests: "Ospiti",
      message: "Messaggio (facoltativo)",
      consent: "Ho letto e accetto l'",
      consentLink: "informativa sulla privacy",
      submit: "Invia richiesta",
      sending: "Invio in corso…",
      error: "Non è stato possibile inviare la richiesta. Riprova, oppure scrivici direttamente a " + CONFIG.property.email + ".",
      doneTitle: "Richiesta ricevuta",
      doneText: "Grazie, ti rispondiamo al più presto con disponibilità e prezzo. Se hai fretta, puoi scriverci anche su WhatsApp.",
      honeypot: "Non compilare questo campo",
    },
    footer: {
      tagline: "Casa vacanze sul mare",
      contactTitle: "Contatti",
      infoTitle: "Informazioni",
      cir: "CIR",
      cin: "CIN",
      rights: "Tutti i diritti riservati.",
      top: "Torna su",
      privacyUrl: "/privacy.html",
    },
    stickyCta: "Verifica disponibilità",
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
      info: `Up to ${CONFIG.property.guests} guests · ${CONFIG.property.bedrooms} bedrooms · ${CONFIG.property.bathrooms} bathrooms`,
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
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Answers to the most common questions",
      text: "If you cannot find what you are looking for, write to us: we usually reply within a few hours.",
      items: [
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
      text: "Choose the platform you prefer: availability is always up to date.",
      booking: "Book on Booking.com",
      airbnb: "Book on Airbnb",
    },
    form: {
      eyebrow: "Enquiry",
      title: "Check the dates of your stay",
      text: "Tell us your dates and how many you are: we reply with availability and price, usually within a few hours.",
      name: "Full name",
      email: "Email",
      arrival: "Arrival",
      departure: "Departure",
      guests: "Guests",
      message: "Message (optional)",
      consent: "I have read and accept the",
      consentLink: "privacy policy",
      submit: "Send enquiry",
      sending: "Sending…",
      error: "We could not send your enquiry. Please try again, or write to us directly at " + CONFIG.property.email + ".",
      doneTitle: "Enquiry received",
      doneText: "Thank you. We will get back to you shortly with availability and price. If you are in a hurry, you can also reach us on WhatsApp.",
      honeypot: "Do not fill in this field",
    },
    footer: {
      tagline: "Seafront holiday home",
      contactTitle: "Contact",
      infoTitle: "Information",
      cir: "CIR",
      cin: "CIN",
      rights: "All rights reserved.",
      top: "Back to top",
      privacyUrl: "/privacy-en.html",
    },
    stickyCta: "Check availability",
    photoPlaceholder: "Photo coming soon",
    cookieBanner: {
      ariaLabel: "Cookie consent",
      text: "We only use Google Analytics if you consent, to understand how the site is used. No profiling cookies.",
      linkLabel: "Learn more",
      reject: "Decline",
      accept: "Accept",
    },
  },
};

/* -------------------------------- TRACCIAMENTO -------------------------------- */

/* Invia un evento a Google Analytics. Non fa nulla se gtag non è caricato
   (per esempio in sviluppo locale, o se un blocco pubblicità lo ferma):
   il sito deve funzionare identico in ogni caso.

   Il Consent Mode resta rispettato: finché l'utente non accetta il banner,
   gtag riceve gli eventi ma non scrive cookie né identifica nessuno. Non
   serve quindi condizionare le chiamate al consenso.

   Questi eventi sono ciò che distingue "quante persone sono passate" da
   "quante hanno fatto qualcosa": senza, non è possibile valutare né una
   campagna pubblicitaria né se conviene un motore di prenotazione. */
function traccia(evento, parametri) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
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

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`bd-reveal ${visible ? "bd-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
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
  "puglia-alberobello": { w: 900, h: 1125, v: [480, 900] },
  "puglia-bari": { w: 900, h: 1600, v: [480, 900] },
  "puglia-monopoli": { w: 900, h: 1600, v: [480, 900] },
  "puglia-polignano": { w: 900, h: 1200, v: [480, 900] },
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
        <p className="bd-eyebrow">{t.location.mapEyebrow}</p>
        <div className="bd-hairline" />
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
          {t.location.mapOpen} →
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
const HOME_LINGUE = { it: "/", en: "/en/" };

/* Icone della barra contatti: piccole, disegnate a mano, ereditano il colore
   dal testo. Meglio di una libreria di icone per tre sole forme. */
const IconaPin = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 22s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
    <circle cx="12" cy="10.5" r="2.4" />
  </svg>
);
const IconaTelefono = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M21 16.4v2.7a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 3.3 5.1 1.8 1.8 0 0 1 5.1 3h2.7a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14 14 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.5 1.8z" />
  </svg>
);
const IconaEmail = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="m3 6 9 6.5L21 6" />
  </svg>
);

/* Barra contatti sopra il menu: indirizzo, telefono ed email sempre
   raggiungibili senza scorrere fino al footer. Su telefono il tocco apre
   direttamente la chiamata o il client di posta. Scompare quando si scorre,
   per lasciare tutto lo spazio al menu compatto. */
function TopBar({ t }) {
  const p = CONFIG.property;
  const { via, comune } = datiIndirizzo();
  const indirizzo = via ? `${via}, ${comune}` : comune;

  return (
    <div className="bd-topbar">
      <div className="bd-topbar__inner">
        <a
          className="bd-topbar__item bd-topbar__addr"
          href={CONFIG.maps.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={t.topbar.address}
        >
          <IconaPin />
          <span>{indirizzo}</span>
        </a>
        <a className="bd-topbar__item" href={`tel:${p.phone.replace(/\s/g, "")}`} title={t.topbar.phone} onClick={() => traccia("contatto", { metodo: "telefono" })}>
          <IconaTelefono />
          <span>{p.phone}</span>
        </a>
        <a className="bd-topbar__item" href={`mailto:${p.email}`} title={t.topbar.email} onClick={() => traccia("contatto", { metodo: "email" })}>
          <IconaEmail />
          <span>{p.email}</span>
        </a>
      </div>
    </div>
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
      <TopBar t={t} />
      <div className="bd-header__inner">
        <a href="#home" className="bd-logo" onClick={(e) => { e.preventDefault(); handleGo("#home"); }}>
          {CONFIG.property.name}
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
            {["it", "en"].map((codice, i) => (
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
            href="#booking"
            className="bd-btn bd-btn--primary bd-btn--sm bd-nav--desktop-only"
            onClick={(e) => { e.preventDefault(); handleGo("#booking"); }}
          >
            {t.nav.book}
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
        <a href="#booking" className="bd-btn bd-btn--primary" onClick={(e) => { e.preventDefault(); handleGo("#booking"); }}>
          {t.nav.book}
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
          <PhotoSlot src={CONFIG.images.hero} alt={CONFIG.property.name} dark position="center 68%" placeholderText={t.photoPlaceholder} priority sizes="100vw" />
        </div>
      </div>
      <div className="bd-hero__scrim" />
      <div className="bd-hero__content">
        <p className="bd-eyebrow bd-eyebrow--light bd-hero__kicker">{CONFIG.property.locationLine}</p>
        <h1 className="bd-hero__title">{t.hero.title}</h1>
        <p className="bd-hero__subtitle">{t.hero.subtitle}</p>
        <p className="bd-hero__info">{t.hero.info}</p>
        <div className="bd-hero__ctas">
          <a href="#booking" className="bd-btn bd-btn--primary" onClick={(e) => { e.preventDefault(); go("#booking"); }}>
            {t.hero.ctaPrimary}
          </a>
          <a href="#house" className="bd-btn bd-btn--ghost" onClick={(e) => { e.preventDefault(); go("#house"); }}>
            {t.hero.ctaSecondary}
          </a>
        </div>
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
          <p className="bd-eyebrow">{t.intro.eyebrow}</p>
          <div className="bd-hairline" />
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
        <p className="bd-eyebrow">{t.house.eyebrow}</p>
        <div className="bd-hairline" />
        <h2 className="bd-h2">{t.house.title}</h2>
        <p className="bd-body bd-body--narrow">{t.house.text}</p>
      </Reveal>

      <div className="bd-house__grid">
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
        <p className="bd-eyebrow">{t.gallery.eyebrow}</p>
        <div className="bd-hairline" />
        <h2 className="bd-h2">{t.gallery.title}</h2>
      </Reveal>

      <div className="bd-gallery__grid">
        {images.map((src, i) => (
          <Reveal
            key={src + i}
            delay={(i % 6) * 45}
            as="button"
            className={`bd-gallery__item bd-gallery__item--${i % 5}`}
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

/* --------------------------------- LOCATION -------------------------------------- */

function Location({ t }) {
  return (
    <section id="location" className="bd-location">
      <div className="bd-location__hero">
        <PhotoSlot src={CONFIG.images.location} alt={t.location.title} dark position="center 40%" placeholderText={t.photoPlaceholder} sizes="100vw" />
        <div className="bd-location__hero-content">
          <Reveal>
            <p className="bd-eyebrow bd-eyebrow--light">{t.location.eyebrow}</p>
            <div className="bd-hairline bd-hairline--light" />
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
          <p className="bd-eyebrow">{t.location.exploreEyebrow}</p>
          <div className="bd-hairline" />
          <h3 className="bd-h3">{t.location.exploreTitle}</h3>
        </Reveal>
        <div className="bd-explore__grid">
          {t.location.places.map((p, i) => (
            <Reveal key={p.key} delay={i * 70} className="bd-explore__card">
              <div className="bd-explore__img">
                <PhotoSlot src={CONFIG.images.explore[p.key]} alt={p.name} compact placeholderText={t.photoPlaceholder} sizes="(max-width: 900px) 50vw, 20vw" />
              </div>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
              {p.link && (
                <a href={p.link} className="bd-explore__link">
                  {p.linkLabel} →
                </a>
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
          <p className="bd-eyebrow">{a.eyebrow}</p>
          <div className="bd-hairline" />
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
          <p className="bd-eyebrow">{f.eyebrow}</p>
          <div className="bd-hairline" />
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
                    {item.linkLabel} →
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
   nascosto in index.html e in en/index.html: Netlify legge l'HTML pubblicato
   per sapere che il modulo esiste e quali campi ha, e il sito qui è costruito
   da React nel browser, dove Netlify non arriva a guardare. */
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

function ContactForm({ t }) {
  const [valori, setValori] = useState(VUOTO);
  const [stato, setStato] = useState("pronto"); // pronto | invio | inviato | errore
  const oggi = useOggi();

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
        }),
      });
      if (!risposta.ok) throw new Error(risposta.status);
      setStato("inviato");
      setValori(VUOTO);
      traccia("richiesta_inviata", { ospiti: valori.ospiti });
    } catch (err) {
      // In sviluppo locale non esiste nessun Netlify che raccolga i dati:
      // l'errore qui è atteso e non indica un problema del modulo.
      setStato("errore");
    }
  };

  if (stato === "inviato") {
    return (
      <section id="contact" className="bd-form">
        <Reveal className="bd-form__inner">
          <div className="bd-form__done" role="status">
            <p className="bd-eyebrow">{t.form.eyebrow}</p>
            <h2 className="bd-h3">{t.form.doneTitle}</h2>
            <p className="bd-body bd-body--narrow">{t.form.doneText}</p>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="contact" className="bd-form">
      <Reveal className="bd-form__inner">
        <div className="bd-section-head">
          <p className="bd-eyebrow">{t.form.eyebrow}</p>
          <div className="bd-hairline" />
          <h2 className="bd-h3">{t.form.title}</h2>
          <p className="bd-body bd-body--narrow">{t.form.text}</p>
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
            <input type="date" name="arrivo" value={valori.arrivo} onChange={aggiorna("arrivo")} min={oggi || undefined} required />
          </label>

          <label className="bd-field">
            <span>{t.form.departure}</span>
            <input
              type="date"
              name="partenza"
              value={valori.partenza}
              onChange={aggiorna("partenza")}
              min={valori.arrivo || oggi || undefined}
              required
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
            <input type="checkbox" checked={valori.privacy} onChange={aggiorna("privacy")} required />
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

function Booking({ t }) {
  return (
    <section id="booking" className="bd-booking">
      <div className="bd-booking__glow" />
      <Reveal className="bd-booking__inner">
        <p className="bd-eyebrow bd-eyebrow--light">{t.booking.eyebrow}</p>
        <div className="bd-hairline bd-hairline--light" />
        <h2 className="bd-h2 bd-h2--light">{t.booking.title}</h2>
        <p className="bd-body bd-body--light">{t.booking.text}</p>
        <div className="bd-booking__ctas">
          <a href={CONFIG.links.booking} target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn--primary" onClick={() => traccia("click_ota", { piattaforma: "booking" })}>
            {t.booking.booking}
          </a>
          <a href={CONFIG.links.airbnb} target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn--ghost" onClick={() => traccia("click_ota", { piattaforma: "airbnb" })}>
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
        <p className="bd-logo bd-logo--footer">{CONFIG.property.name}</p>
        <p className="bd-footer__tagline">{t.footer.tagline} · {CONFIG.property.locationLine}</p>
      </div>

      <div className="bd-footer__grid">
        <div>
          <p className="bd-footer__title">{t.footer.contactTitle}</p>
          <p>{CONFIG.property.email}</p>
          <p>{CONFIG.property.phone}</p>
        </div>
        <div>
          <p className="bd-footer__title">{t.footer.infoTitle}</p>
          <p>{t.footer.cir}: {CONFIG.property.cir}</p>
          <p>{t.footer.cin}: {CONFIG.property.cin}</p>
        </div>
        <div>
          <p className="bd-footer__title">&nbsp;</p>
          <button className="bd-footer__totop" onClick={() => go("#home")}>{t.footer.top} ↑</button>
        </div>
      </div>

      <div className="bd-footer__bottom">
        <span>© {new Date().getFullYear()} {CONFIG.property.name}. {t.footer.rights}</span>
        <a href={t.footer.privacyUrl} className="bd-footer__privacy">Privacy</a>
      </div>
    </footer>
  );
}

/* ------------------------------- COOKIE BANNER -------------------------------- */
/* Mostra il banner solo se l'utente non ha già scelto. "Accetta" abilita la
   raccolta dati di Google Analytics (Consent Mode); "Rifiuta" la lascia
   disattivata. La scelta viene ricordata in questo browser. */

function CookieBanner({ t }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bd-cookie-consent");
    if (!saved) setVisible(true);
    else if (saved === "accepted" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  }, []);

  const choose = (value) => {
    localStorage.setItem("bd-cookie-consent", value);
    if (value === "accepted" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
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

function WhatsAppButton() {
  const digits = CONFIG.property.phone.replace(/\D/g, ""); // solo numeri, per il link wa.me
  const message = encodeURIComponent(
    "Ciao! Vorrei avere informazioni sulla disponibilità di Bellavista Domus."
  );
  return (
    <a
      className="bd-whatsapp"
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrivici su WhatsApp"
      onClick={() => traccia("contatto", { metodo: "whatsapp" })}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.1c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .9 2.14.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.65-.14.27.1 1.69.8 1.98.94.29.15.48.22.55.34.07.13.07.72-.17 1.4Z"/>
      </svg>
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
      <button onClick={() => go("#booking")}>{t.stickyCta}</button>
    </div>
  );
}

/* ------------------------------------ STYLES --------------------------------------- */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600&display=swap');

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
.bd-eyebrow{
  font-family:'Inter',sans-serif;
  font-size:11.5px;
  letter-spacing:0.24em;
  text-transform:uppercase;
  color:var(--stone);
  margin:0 0 16px;
  font-weight:500;
  display:flex;align-items:center;gap:10px;
}
/* trattino decorativo rimosso su richiesta */
.bd-eyebrow--light{color:rgba(255,255,255,0.86);}
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
.bd-hairline{
  width:0;height:1px;background:var(--sea-deep);opacity:0.45;margin:0 0 26px;
  transform-origin:left;transition:width 1s cubic-bezier(.16,.8,.24,1) .15s;
}
.bd-reveal--visible .bd-hairline{width:44px;}
.bd-hairline--light{background:var(--white);opacity:0.6;}
.bd-section-head{max-width:640px;margin:0 auto 64px;text-align:center;}
.bd-section-head .bd-eyebrow{justify-content:center;}
.bd-section-head .bd-hairline{margin-left:auto;margin-right:auto;}
.bd-section-head .bd-body{margin-left:auto;margin-right:auto;}

/* Reveal */
/* Le animazioni d'ingresso partono nascoste, ma SOLO se JavaScript è attivo:
   la classe bd-js la mette src/main.jsx appena parte. Senza questa
   condizione, l'HTML prerenderizzato mostrerebbe una pagina completa di
   testo ma tutta a opacità zero per chi non esegue JavaScript — cioè
   proprio i motori di risposta AI per cui il prerendering esiste. */
.bd-js .bd-reveal{opacity:0;transform:translateY(30px);transition:opacity 1s cubic-bezier(.16,.8,.24,1), transform 1s cubic-bezier(.16,.8,.24,1);}
/* Il prefisso .bd-js va ripetuto anche qui, e non è pedanteria: senza, questa
   regola pesa una classe contro le due della riga sopra, quindi perde — e
   tutto il sito resta invisibile con JavaScript attivo. Le tre regole di
   .bd-reveal devono avere la stessa specificità o essere in ordine crescente. */
.bd-js .bd-reveal--visible{opacity:1;transform:translateY(0);}
@media (prefers-reduced-motion: reduce){
  /* Anche qui serve il prefisso .bd-js, per lo stesso motivo di specificità:
     chi ha chiesto al sistema di ridurre le animazioni deve vedere la pagina
     ferma e visibile, non ferma e trasparente. */
  .bd-js .bd-reveal, .bd-js .bd-reveal--visible{opacity:1;transform:none;transition:none;}
  .bd-hairline{width:44px !important;transition:none;}
}

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
.bd-btn.bd-btn--ghost::after{
  content:'→';margin-left:2px;transition:transform .35s ease;display:inline-block;
}
.bd-btn.bd-btn--ghost span{position:relative;}
.bd-btn.bd-btn--ghost{border-bottom:1px solid currentColor;padding-bottom:5px;}
.bd-btn.bd-btn--ghost:hover::after{transform:translateX(5px);}

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
.bd-header__inner, .bd-topbar{position:relative;z-index:1;}
.bd-header--solid{
  background:rgba(250,247,241,0.90);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
}
/* Lo spazio verticale dell'intestazione sta qui e non su .bd-header, perché
   la barra contatti dev'essere una striscia a tutta larghezza attaccata al
   bordo dello schermo, non un blocco che galleggia dentro un'imbottitura. */
.bd-header__inner{
  max-width:1280px;margin:0 auto;padding:26px 32px;
  display:flex;align-items:center;justify-content:space-between;gap:24px;
  transition:padding .4s ease;
}
.bd-header--solid .bd-header__inner{padding:16px 32px;}

/* Barra contatti: striscia piena blu Adriatico in cima alla pagina.
   Il fondo pieno è una scelta deliberata — il testo dei recapiti è piccolo
   e sopra una fotografia non regge, per quanto lo si veli. Collassa quando
   si scorre, lasciando solo il menu compatto. */
.bd-topbar{
  overflow:hidden;max-height:46px;opacity:1;
  background:var(--sea-deep);
  transition:max-height .4s ease, opacity .3s ease;
}
.bd-header--solid .bd-topbar{max-height:0;opacity:0;}
.bd-topbar__inner{
  max-width:1280px;margin:0 auto;padding:13px 32px;
  display:flex;flex-wrap:wrap;align-items:center;gap:6px 28px;
  font-size:12.5px;letter-spacing:0.02em;
}
/* Il selettore è doppio (.bd-topbar .bd-topbar__item) di proposito: più in
   alto nel foglio la regola ".bd-root a" imposta color:inherit su ogni link
   del sito, e pesa più di una singola classe. Senza il doppio selettore
   vince lei, i recapiti ereditano il blu del testo del sito e diventano
   illeggibili sopra questa striscia, anch'essa blu.
   Nota: niente backtick nei commenti qui dentro — tutto questo CSS vive in
   una stringa JavaScript delimitata da backtick, e uno di troppo la spezza. */
.bd-topbar .bd-topbar__item{
  display:inline-flex;align-items:center;gap:7px;
  color:rgba(255,255,255,0.94);font-weight:400;
  transition:color .15s;
}
.bd-topbar .bd-topbar__item:hover{color:var(--sand);}
.bd-topbar .bd-topbar__item:focus-visible{outline:1px solid var(--sand);outline-offset:3px;}
.bd-topbar .bd-topbar__item svg{flex:none;color:var(--sand);}

@media (max-width:760px){
  /* Su schermo stretto l'indirizzo esteso non entra: restano telefono ed
     email, che sono le due azioni che si compiono davvero da telefono. */
  .bd-topbar__addr{display:none;}
  .bd-topbar__inner{padding:11px 22px;gap:4px 20px;font-size:12px;}
  .bd-topbar{max-height:42px;}
  .bd-header__inner{padding:18px 22px;}
  .bd-header--solid .bd-header__inner{padding:14px 22px;}
}
.bd-logo{
  font-family:'Fraunces',serif;font-size:20px;letter-spacing:0.015em;
  color:var(--sea-deep);
}
.bd-header:not(.bd-header--solid) .bd-logo{color:var(--white);}
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
.bd-hero__kicker{animation:bd-fadeup .9s cubic-bezier(.16,.8,.24,1) .5s both;}
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
  font-size:13px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 40px;color:rgba(255,255,255,0.78);
  animation:bd-fadeup 1s cubic-bezier(.16,.8,.24,1) .92s both;
  padding-top:26px;border-top:1px solid rgba(255,255,255,0.28);max-width:480px;
}
.bd-hero__ctas{
  display:flex;gap:28px;flex-wrap:wrap;align-items:center;
  animation:bd-fadeup 1s cubic-bezier(.16,.8,.24,1) 1.05s both;
}
@keyframes bd-fadeup{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
@media (prefers-reduced-motion: reduce){
  .bd-hero__img, .bd-hero__kicker, .bd-hero__title, .bd-hero__subtitle, .bd-hero__info, .bd-hero__ctas{animation:none;}
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
  .bd-house__grid{grid-template-columns:1fr;gap:40px;}
  .bd-house__card{grid-column:span 1 !important;}
  .bd-house__frame{aspect-ratio:4/3 !important;}
}

/* Gallery */
.bd-gallery{padding:70px 32px 150px;max-width:1280px;margin:0 auto;}
.bd-gallery__grid{
  display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:130px;gap:20px;
}
.bd-gallery__item{overflow:hidden;border-radius:2px;padding:0;position:relative;}
.bd-gallery__item img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(.16,.8,.24,1), filter .5s ease;}
.bd-gallery__item:hover img{transform:scale(1.06);filter:brightness(0.94);}
.bd-gallery__item--0{grid-column:span 3;grid-row:span 3;}
.bd-gallery__item--1{grid-column:span 3;grid-row:span 2;}
.bd-gallery__item--2{grid-column:span 3;grid-row:span 2;}
.bd-gallery__item--3{grid-column:span 2;grid-row:span 2;}
.bd-gallery__item--4{grid-column:span 2;grid-row:span 2;}
@media (max-width:900px){
  .bd-gallery{padding:56px 0 100px;}
  .bd-gallery__grid{
    grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:82%;
    grid-auto-rows:300px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 22px;gap:16px;
  }
  .bd-gallery__item{scroll-snap-align:start;grid-column:auto !important;grid-row:auto !important;}
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
  position:absolute;inset:0;background:linear-gradient(180deg, rgba(16,40,56,0.06), rgba(16,40,56,0.68));
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
.bd-explore__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:24px;}
.bd-explore__img{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:2px;margin-bottom:18px;}
.bd-explore__img img{transition:transform .7s cubic-bezier(.16,.8,.24,1);}
.bd-explore__card:hover .bd-explore__img img{transform:scale(1.06);}
.bd-explore__card h4{font-family:'Fraunces',serif;font-size:17px;font-weight:500;margin:0 0 6px;}
.bd-explore__card p{font-size:13.5px;color:var(--stone);line-height:1.6;margin:0;font-weight:300;}
.bd-explore__link{
  display:inline-block;margin-top:12px;font-size:12px;letter-spacing:0.04em;
  color:var(--sea-deep);border-bottom:1px solid currentColor;padding-bottom:2px;font-weight:500;
}
.bd-explore__link:hover{opacity:0.7;}
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
.bd-booking__inner .bd-eyebrow{justify-content:center;}
.bd-booking__inner .bd-hairline{margin-left:auto;margin-right:auto;}
.bd-booking__inner .bd-body{margin-left:auto;margin-right:auto;}
.bd-booking__ctas{display:flex;gap:34px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:40px;}

/* Footer */
.bd-footer{background:var(--ivory-2);border-top:1px solid var(--line);padding:110px 32px 34px;}
.bd-footer__top{max-width:1280px;margin:0 auto;padding-bottom:56px;}
.bd-logo--footer{font-family:'Fraunces',serif;font-size:30px;color:var(--sea-deep);margin:0 0 10px;letter-spacing:-0.01em;}
.bd-footer__tagline{font-family:'Fraunces',serif;font-style:italic;font-size:16px;color:var(--stone);margin:0;}
.bd-footer__grid{
  max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px;
  padding:40px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  font-size:14px;color:var(--stone);font-weight:300;
}
.bd-footer__grid p{margin:0 0 6px;}
.bd-footer__title{text-transform:uppercase;letter-spacing:0.12em;font-size:11px;color:var(--sea-deep);font-weight:600;margin-bottom:14px !important;}
.bd-footer__totop{font-size:13px;color:var(--sea-deep);text-decoration:underline;text-underline-offset:3px;}
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

  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bd-root">
      <style>{STYLES}</style>
      <Header lang={lang} t={t} go={go} />
      <Hero t={t} go={go} />
      <Intro t={t} />
      <Features t={t} />
      <House t={t} />
      <Gallery t={t} />
      {/* Dopo le fotografie e prima della posizione: si vede la casa, si
          legge cosa contiene, poi si scopre dov'è. */}
      <Amenities t={t} />
      <Location t={t} />
      <Booking t={t} />
      {/* Le FAQ stanno subito prima del modulo: si tolgono gli ultimi dubbi,
          e chi ne ha ancora trova il modulo già lì sotto. */}
      <Faq t={t} />
      {/* Il modulo porta l'id "contact": la voce Contatti del menu ci arriva
          direttamente, e il footer con i recapiti resta subito sotto. */}
      <ContactForm t={t} />
      <Footer t={t} go={go} />
      <StickyCta t={t} go={go} />
      <WhatsAppButton />
      <CookieBanner t={t} />
    </div>
  );
}
