/* =====  Delt konfigurasjon for alle sider / Shared settings for all pages  =====
   Endre her, så oppdateres index.html, en.html, book.html og book-en.html. */
window.SITE = {
  date_nb: "Lørdag 28. november 2026",
  date_en: "Saturday 28 November 2026",
  time:    "",                                  // f.eks. "18:30". La stå tom for å skjule tidslinjen.
  venue:   "C. Manises, 18, Plaza de Sol, 03580 Alfaz del Pi, Alicante",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=C.+Manises+18+03580+Alfaz+del+Pi+Alicante",
  price:   "60",
  email:   "info@nordichub.es",                 // hit kommer bestillinger hvis du ikke bruker skjematjeneste.

  // Adressen til bestillings-backend (Google Apps Script web app, slutter på /exec). Tom = bestillingen åpner e-postprogrammet i stedet.
  formEndpoint: "https://script.google.com/macros/s/AKfycbwFjmxOAAsybI0K1K-Cllky5wFe0ZHpmXfb2xNxN98K8FtQurYpT6ikaNzEnBBw9-6C2w/exec",                             // f.eks. "https://script.google.com/macros/s/XXXX/exec"

  // Betalingslenke: ferdig (Stripe Payment Link eller SumUp). Tom = du sender lenken selv.
  paymentLink: ""                               // f.eks. "https://pay.sumup.com/b2c/XXXXXX"
};
