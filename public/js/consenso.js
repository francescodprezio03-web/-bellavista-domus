/* Google Analytics con Consent Mode v2 — si carica SOLO dopo il consenso.
   Finché il visitatore non preme "Accetta" nel banner cookie il sito non
   contatta Google in nessun modo: gtag.js non viene nemmeno scaricato.
   ad_storage, ad_user_data e ad_personalization restano sempre negati:
   il sito non fa pubblicità né remarketing.

   bdAttivaAnalytics() è l'unico punto che accende Google Analytics. La
   chiamano: questo file, se la scelta "accepted" è già salvata nel browser
   (chi torna sul sito), e CookieBanner in src/App.jsx quando si preme
   "Accetta". Si può chiamare più volte: agisce solo la prima.
   L'ordine conta: prima il consenso, poi config, così anche la prima
   pagina vista viene registrata con il consenso già dato.

   Sta in un file separato perché la Content-Security-Policy (netlify.toml)
   non permette script scritti dentro le pagine. Va caricato in modo
   sincrono (senza async/defer), prima del codice del sito. */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});

window.bdAttivaAnalytics = function () {
  if (window.bdAnalyticsAttivo) return;
  window.bdAnalyticsAttivo = true;
  gtag('consent', 'update', { 'analytics_storage': 'granted' });
  gtag('js', new Date());
  gtag('config', 'G-4LF1J1R5PT');
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-4LF1J1R5PT';
  document.head.appendChild(s);
};

try {
  if (localStorage.getItem('bd-cookie-consent') === 'accepted') window.bdAttivaAnalytics();
} catch (e) {
  /* localStorage non disponibile (alcune navigazioni private): si resta
     senza Analytics, che è il comportamento prudente. */
}
