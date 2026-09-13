/* Disponibilità della casa, letta dai calendari che Airbnb e Booking
   pubblicano già in formato iCal.

   Perché una funzione lato server e non una chiamata dal browser: i due
   portali non autorizzano la lettura diretta da un altro sito (CORS), e
   soprattutto quegli indirizzi mostrano le date occupate a chiunque li
   conosca — nel codice della pagina sarebbero pubblici. Qui restano
   variabili d'ambiente, impostate su Netlify e mai salvate nel repository.

   Da impostare su Netlify (Site configuration → Environment variables):
     ICAL_AIRBNB   indirizzo di esportazione del calendario Airbnb
     ICAL_BOOKING  lo stesso dall'Extranet di Booking.com
   Ne basta uno: se manca l'altro, viene semplicemente ignorato.

   LIMITE NOTO: i due portali rigenerano il file ogni 1-4 ore, quindi una
   prenotazione appena ricevuta può comparire qui con qualche ora di ritardo.
   La pagina lo dichiara: il calendario è indicativo, la conferma arriva
   sempre da noi. */

const ORIZZONTE_MESI = 18;

/* Le righe lunghe negli iCal vengono spezzate e continuate con uno spazio
   o una tabulazione a inizio riga: vanno ricongiunte prima di leggerle. */
function ricongiungi(testo) {
  return testo.replace(/\r?\n[ \t]/g, "");
}

/* Estrae gli intervalli occupati. In iCal la data di fine è ESCLUSIVA:
   un soggiorno 17→24 occupa le notti dal 17 al 23. */
function intervalli(ics) {
  const fuori = [];
  let dentro = false, inizio = null, fine = null;
  for (const riga of ricongiungi(ics).split(/\r?\n/)) {
    if (riga.startsWith("BEGIN:VEVENT")) { dentro = true; inizio = fine = null; continue; }
    if (riga.startsWith("END:VEVENT")) {
      if (inizio && fine) fuori.push([inizio, fine]);
      dentro = false;
      continue;
    }
    if (!dentro) continue;
    const m = /^(DTSTART|DTEND)[^:]*:(\d{4})(\d{2})(\d{2})/.exec(riga);
    if (m) {
      const giorno = `${m[2]}-${m[3]}-${m[4]}`;
      if (m[1] === "DTSTART") inizio = giorno; else fine = giorno;
    }
  }
  return fuori;
}

function giorniTra(inizio, fineEsclusa) {
  const giorni = [];
  const d = new Date(inizio + "T00:00:00Z");
  const stop = new Date(fineEsclusa + "T00:00:00Z");
  // Guardia contro eventi malformati o intervalli assurdi
  let contatore = 0;
  while (d < stop && contatore < 800) {
    giorni.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
    contatore++;
  }
  return giorni;
}

function risposta(codice, corpo, minutiCache) {
  return new Response(JSON.stringify(corpo), {
    status: codice,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": minutiCache
        ? `public, max-age=${minutiCache * 60}, stale-while-revalidate=3600`
        : "no-store",
    },
  });
}

export default async () => {
  const sorgenti = [process.env.ICAL_AIRBNB, process.env.ICAL_BOOKING].filter(Boolean);
  if (sorgenti.length === 0) {
    return risposta(503, { errore: "non configurato" });
  }

  let testi;
  try {
    testi = await Promise.all(
      sorgenti.map(async (url) => {
        const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) throw new Error(`${r.status}`);
        return r.text();
      })
    );
  } catch (e) {
    /* Meglio dichiarare che non si sa, che indovinare: la pagina in questo
       caso non mostra nessuna data e invita a scrivere. */
    return risposta(502, { errore: "sorgente non raggiungibile" });
  }

  const oggi = new Date();
  const da = oggi.toISOString().slice(0, 10);
  const limite = new Date(oggi);
  limite.setUTCMonth(limite.getUTCMonth() + ORIZZONTE_MESI);
  const a = limite.toISOString().slice(0, 10);

  const occupate = new Set();
  for (const ics of testi) {
    for (const [inizio, fine] of intervalli(ics)) {
      for (const g of giorniTra(inizio, fine)) {
        if (g >= da && g <= a) occupate.add(g);
      }
    }
  }

  return risposta(200, {
    aggiornato: new Date().toISOString(),
    da,
    a,
    occupate: [...occupate].sort(),
  }, 30);
};

export const config = { path: "/api/disponibilita" };
