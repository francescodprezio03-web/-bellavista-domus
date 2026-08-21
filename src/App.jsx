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
      { key: "balcony", url: "/images/casa-balcone.jpg", span: 4, aspect: "1/1" },
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
    nav: { home: "Home", house: "La Casa", gallery: "Galleria", location: "Posizione", contact: "Contatti", book: "Prenota ora" },
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
    location: {
      eyebrow: "Dove siamo",
      title: "Il mare è appena fuori",
      text: "A pochi passi dal Mare Adriatico, Bellavista Domus offre un soggiorno costiero autentico a Torre a Mare, restando vicina a Bari e al meglio della Puglia.",
      exploreEyebrow: "Nei dintorni",
      exploreTitle: "Scopri la Puglia",
      places: [
        { key: "torreamare", name: "Torre a Mare", desc: "Il borgo marinaro dove si trova Bellavista Domus." },
        { key: "bari", name: "Bari", desc: "Il capoluogo pugliese, tra centro storico e lungomare." },
        { key: "polignano", name: "Polignano a Mare", desc: "Celebre per le sue scogliere a picco sul mare." },
        { key: "monopoli", name: "Monopoli", desc: "Porto storico e centro antico affacciato sull'Adriatico." },
        { key: "alberobello", name: "Alberobello", desc: "Patrimonio UNESCO, famosa per i trulli." },
      ],
    },
    booking: {
      eyebrow: "Prenota",
      title: "Pronto a svegliarti con il mare davanti?",
      text: "Scegli la piattaforma che preferisci: la disponibilità è sempre aggiornata.",
      booking: "Prenota su Booking.com",
      airbnb: "Prenota su Airbnb",
    },
    footer: {
      tagline: "Casa vacanze sul mare",
      contactTitle: "Contatti",
      infoTitle: "Informazioni",
      cir: "CIR",
      cin: "CIN",
      rights: "Tutti i diritti riservati.",
      top: "Torna su",
    },
    stickyCta: "Verifica disponibilità",
    photoPlaceholder: "Fotografia in arrivo",
  },
  en: {
    nav: { home: "Home", house: "The House", gallery: "Gallery", location: "Location", contact: "Contact", book: "Book now" },
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
    location: {
      eyebrow: "Where we are",
      title: "The sea is just outside",
      text: "Just a few steps from the Adriatic Sea, Bellavista Domus offers an authentic coastal stay in Torre a Mare, while remaining close to Bari and the best of Puglia.",
      exploreEyebrow: "Nearby",
      exploreTitle: "Explore Puglia",
      places: [
        { key: "torreamare", name: "Torre a Mare", desc: "The seaside village where Bellavista Domus is located." },
        { key: "bari", name: "Bari", desc: "The capital of Puglia, historic centre and seafront." },
        { key: "polignano", name: "Polignano a Mare", desc: "Famous for its cliffs overlooking the sea." },
        { key: "monopoli", name: "Monopoli", desc: "Historic port and old town facing the Adriatic." },
        { key: "alberobello", name: "Alberobello", desc: "UNESCO World Heritage site, famous for its trulli." },
      ],
    },
    booking: {
      eyebrow: "Book",
      title: "Ready to wake up by the sea?",
      text: "Choose the platform you prefer: availability is always up to date.",
      booking: "Book on Booking.com",
      airbnb: "Book on Airbnb",
    },
    footer: {
      tagline: "Seafront holiday home",
      contactTitle: "Contact",
      infoTitle: "Information",
      cir: "CIR",
      cin: "CIN",
      rights: "All rights reserved.",
      top: "Back to top",
    },
    stickyCta: "Check availability",
    photoPlaceholder: "Photo coming soon",
  },
};

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

function PhotoSlot({ src, alt = "", label = "", dark = false, compact = false, position = "center", placeholderText = "Fotografia in arrivo" }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (!showPlaceholder) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="bd-photo__img"
        style={{ objectPosition: position }}
        onError={() => setFailed(true)}
      />
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

/* ---------------------------------- HEADER ----------------------------------- */

function Header({ lang, setLang, t, go }) {
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
    { href: "#contact", label: t.nav.contact },
  ];

  const handleGo = (href) => {
    setMenuOpen(false);
    go(href);
  };

  return (
    <header className={`bd-header ${scrolled ? "bd-header--solid" : ""}`}>
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
          <div className="bd-langswitch" role="group" aria-label="Language">
            <button className={lang === "it" ? "is-active" : ""} onClick={() => setLang("it")}>IT</button>
            <span>/</span>
            <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
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
          <PhotoSlot src={CONFIG.images.hero} alt={CONFIG.property.name} dark position="center 68%" placeholderText={t.photoPlaceholder} />
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
          <PhotoSlot src={CONFIG.images.intro} alt={CONFIG.property.name} position="center 78%" placeholderText={t.photoPlaceholder} />
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
              <PhotoSlot src={item.url} alt={t.house.items[item.key]} placeholderText={t.photoPlaceholder} />
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
            onClick={() => setLightbox(i)}
            aria-label={`${t.gallery.title} ${i + 1}`}
          >
            <PhotoSlot src={src} alt={`${CONFIG.property.name} ${i + 1}`} compact placeholderText={t.photoPlaceholder} />
          </Reveal>
        ))}
      </div>

      {lightbox !== null && (
        <div className="bd-lightbox" onClick={close}>
          <button className="bd-lightbox__close" onClick={close} aria-label="Close">×</button>
          <button className="bd-lightbox__nav bd-lightbox__nav--prev" onClick={prev} aria-label="Previous">‹</button>
          <figure className="bd-lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <div className="bd-lightbox__imgwrap">
              <PhotoSlot src={images[lightbox]} alt="" placeholderText={t.photoPlaceholder} />
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
        <PhotoSlot src={CONFIG.images.location} alt={t.location.title} dark position="center 40%" placeholderText={t.photoPlaceholder} />
        <div className="bd-location__hero-content">
          <Reveal>
            <p className="bd-eyebrow bd-eyebrow--light">{t.location.eyebrow}</p>
            <div className="bd-hairline bd-hairline--light" />
            <h2 className="bd-h2 bd-h2--light">{t.location.title}</h2>
            <p className="bd-body bd-body--light bd-body--narrow">{t.location.text}</p>
          </Reveal>
        </div>
      </div>

      <div className="bd-explore">
        <Reveal className="bd-section-head">
          <p className="bd-eyebrow">{t.location.exploreEyebrow}</p>
          <div className="bd-hairline" />
          <h3 className="bd-h3">{t.location.exploreTitle}</h3>
        </Reveal>
        <div className="bd-explore__grid">
          {t.location.places.map((p, i) => (
            <Reveal key={p.key} delay={i * 70} className="bd-explore__card">
              <div className="bd-explore__img">
                <PhotoSlot src={CONFIG.images.explore[p.key]} alt={p.name} compact placeholderText={t.photoPlaceholder} />
              </div>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
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
          <a href={CONFIG.links.booking} target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn--primary">
            {t.booking.booking}
          </a>
          <a href={CONFIG.links.airbnb} target="_blank" rel="noopener noreferrer" className="bd-btn bd-btn--ghost">
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
    <footer id="contact" className="bd-footer">
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
        <a href="/privacy.html" className="bd-footer__privacy">Privacy</a>
      </div>
    </footer>
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
.bd-eyebrow::before{content:'';width:14px;height:1px;background:currentColor;opacity:0.55;}
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
.bd-reveal{opacity:0;transform:translateY(30px);transition:opacity 1s cubic-bezier(.16,.8,.24,1), transform 1s cubic-bezier(.16,.8,.24,1);}
.bd-reveal--visible{opacity:1;transform:translateY(0);}
@media (prefers-reduced-motion: reduce){
  .bd-reveal{opacity:1;transform:none;transition:none;}
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
  transition:background .4s ease, border-color .4s ease, padding .4s ease;
  padding:26px 0;
  border-bottom:1px solid transparent;
}
.bd-header--solid{
  background:rgba(250,247,241,0.90);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
  padding:16px 0;
}
.bd-header__inner{
  max-width:1280px;margin:0 auto;padding:0 32px;
  display:flex;align-items:center;justify-content:space-between;gap:24px;
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
.bd-langswitch button{opacity:0.55;font-weight:500;}
.bd-langswitch button.is-active{opacity:1;text-decoration:underline;text-underline-offset:3px;}
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
.bd-explore{max-width:1280px;margin:110px auto 0;padding:0 32px;}
.bd-explore__grid{display:grid;grid-template-columns:repeat(5,1fr);gap:24px;}
.bd-explore__img{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:2px;margin-bottom:18px;}
.bd-explore__img img{transition:transform .7s cubic-bezier(.16,.8,.24,1);}
.bd-explore__card:hover .bd-explore__img img{transform:scale(1.06);}
.bd-explore__card h4{font-family:'Fraunces',serif;font-size:17px;font-weight:500;margin:0 0 6px;}
.bd-explore__card p{font-size:13.5px;color:var(--stone);line-height:1.6;margin:0;font-weight:300;}
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
`;

/* ------------------------------------ APP ------------------------------------------ */

export default function BellavistaDomus() {
  const [lang, setLang] = useState("it");
  const t = translations[lang];

  useEffect(() => {
    document.title = CONFIG.seo[lang].title;
  }, [lang]);

  const go = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bd-root">
      <style>{STYLES}</style>
      <Header lang={lang} setLang={setLang} t={t} go={go} />
      <Hero t={t} go={go} />
      <Intro t={t} />
      <Features t={t} />
      <House t={t} />
      <Gallery t={t} />
      <Location t={t} />
      <Booking t={t} />
      <Footer t={t} go={go} />
      <StickyCta t={t} go={go} />
    </div>
  );
}
