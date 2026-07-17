/**
 * =====================================================================
 *  CONFIGURAZIONE DELLO STUDIO
 *  Tutti i dati "di contenuto" del sito vivono qui: nome, contatti,
 *  orari prenotabili, servizi. Per aggiornarli basta modificare
 *  questo file — nessun'altra parte del codice va toccata.
 * =====================================================================
 */

export const STUDIO = {
  nome: "Dott.ssa Giulia Ortu",
  /** Versione senza titolo, usata nel logo stilizzato dell'header. */
  nomeBreve: "Giulia Ortu",
  professione: "Psicologa",
  citta: "Roma",
  indirizzo: "Via Vallebona, 51, Roma",
  telefono: "350 537 1588",
  /** Stesso numero in formato internazionale senza spazi:
      usato per il tasto di chiamata (tel:) e per il link WhatsApp. */
  telefonoInternazionale: "+393518629246",
  email: "giuliaortu.psicologa@gmail.com",
  albo: "Iscritta all'Albo degli Psicologi del Lazio n. 33345",
  /** Profili social, mostrati nel footer. */
  social: {
    instagram: "https://www.instagram.com/giuliaortu.psicologa/",
    linkedin: "https://www.linkedin.com/in/giulia-ortu-387420137/",
  },
  /** Messaggio precompilato quando si apre WhatsApp dal sito. */
  messaggioWhatsApp:
    "Ciao Giulia! Sono interessato/a a fare un primo colloquio conoscitivo. Quando hai disponibilità?",
} as const;

export const PRENOTAZIONI = {
  /** Fuso orario dello studio: tutti gli orari sono espressi in ora italiana. */
  fusoOrario: "Europe/Rome",

  /** Orari di inizio seduta proposti sul sito (ora italiana). */
  orari: ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"],

  /** Durata dello slot bloccato in calendario, in minuti. */
  durataMinuti: 60,

  /** Quanti giorni prenotabili mostrare (a partire da domani). */
  giorniVisibili: 12,

  /** Giorni della settimana NON prenotabili (0 = domenica ... 6 = sabato). */
  giorniChiusura: [0],

  /** Motivi selezionabili nel modulo di prenotazione. */
  motivi: [
    "Primo colloquio",
    "Proseguimento percorso",
    "Percorso familiare",
    "Percorso per adolescenti",
  ],
} as const;

/**
 * Percorsi offerti, mostrati nella sezione Servizi della home.
 * Ogni voce abbina il BISOGNO in cui riconoscersi ("Ti riconosci in
 * questo?") al SERVIZIO che vi risponde: le card della sezione
 * raccontano prima il bisogno, poi il percorso proposto.
 */
export const SERVIZI = [
  {
    bisogno: {
      titolo: "L'ansia ti blocca",
      descrizione:
        "Il cuore che corre, i pensieri che non si fermano. Si può imparare ad affrontarla.",
    },
    titolo: "Terapia individuale per adulti",
    descrizione:
      "Percorsi di sostegno o psicoterapia per chi attraversa ansia, difficoltà dell'umore o momenti di cambiamento.",
    tag: "Studio o online · 50 min",
  },
  {
    bisogno: {
      titolo: "Non riesci a stare bene",
      descrizione:
        "Quella stanchezza di fondo, i giorni che si assomigliano. Non devi abituarti a stare così.",
    },
    titolo: "Sostegno psicologico",
    descrizione:
      "Uno spazio per fare chiarezza su un momento specifico, anche senza intraprendere un percorso lungo.",
    tag: "Studio o online · 50 min",
  },
  {
    bisogno: {
      titolo: "L'adolescenza è complicata",
      descrizione:
        "Nuove domande, per lei o lui e per voi. Un aiuto professionale può fare la differenza.",
    },
    titolo: "Percorso per adolescenti",
    descrizione:
      "Un ascolto pensato per ragazze e ragazzi, con un lavoro parallelo, se utile, con i genitori.",
    tag: "Studio o online · 45 min",
  },
  {
    bisogno: {
      titolo: "In famiglia c'è tensione",
      descrizione:
        "Incomprensioni che si ripetono. Un percorso familiare aiuta a ritrovare un linguaggio comune.",
    },
    titolo: "Percorso familiare",
    descrizione:
      "Per affrontare insieme le difficoltà di relazione e ritrovare un dialogo più sereno.",
    tag: "Studio · 60 min",
  },
] as const;

/** URL pubblico del sito (per sitemap, robots e link nelle email). */
export function urlSito(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
