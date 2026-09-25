/* Scrive l'anno corrente nel footer delle guide e della privacy.
   Sta in un file separato, non dentro la pagina, perché la
   Content-Security-Policy (netlify.toml) non permette script scritti
   direttamente nell'HTML. */
var anno = document.getElementById('year');
if (anno) anno.textContent = new Date().getFullYear();
