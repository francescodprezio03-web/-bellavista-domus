/* Guide aperte dalla pagina ospiti (ospiti*.html).
   La pagina ospiti collega le guide con "#da-ospiti" in fondo all'indirizzo.
   Se c'è, i pulsanti "Torna al sito" della guida riportano alla sezione
   delle guide nella pagina ospiti, nella stessa lingua, invece che alla
   home. I link verso le altre guide si portano dietro lo stesso segnale,
   così il ritorno funziona anche passando da una guida all'altra.
   Si usa il "#" e non un parametro "?": Google lo ignora, quindi non nascono
   indirizzi doppi delle guide. Senza JavaScript il pulsante porta alla home,
   come prima. File separato perché la Content-Security-Policy
   (netlify.toml) non permette script scritti dentro l'HTML. */
(function () {
  if (location.hash !== '#da-ospiti') return;

  var RITORNO = {
    it: ['/ospiti.html#guide', '← Torna alla pagina ospiti'],
    en: ['/ospiti-en.html#guide', '← Back to the guest page'],
    fr: ['/ospiti-fr.html#guide', '← Retour à la page voyageurs'],
    de: ['/ospiti-de.html#guide', '← Zurück zur Gästeseite']
  };
  var r = RITORNO[document.documentElement.lang] || RITORNO.it;

  var indietro = document.querySelectorAll('a.back');
  for (var i = 0; i < indietro.length; i++) {
    indietro[i].setAttribute('href', r[0]);
    indietro[i].textContent = r[1];
  }

  // Solo le altre guide: pagine .html nella radice, escluse ospiti e privacy.
  var link = document.querySelectorAll('a[href^="/"]');
  for (var j = 0; j < link.length; j++) {
    var h = link[j].getAttribute('href');
    if (/^\/[a-z0-9-]+\.html$/.test(h) && !/^\/(ospiti|privacy)/.test(h)) {
      link[j].setAttribute('href', h + '#da-ospiti');
    }
  }
})();
