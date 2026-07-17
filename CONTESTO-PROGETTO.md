# CONTESTO PROGETTO — Sito Dott.ssa Giulia Ortu (psicologa, Roma)

> **Scopo di questo file**: dare a chiunque riprenda il lavoro (persona o AI) tutto il contesto
> per continuare senza perdere informazioni. **Leggerlo per intero prima di toccare il codice.**
> Va tenuto aggiornato: ogni decisione rilevante presa in una sessione si annota qui.

---

## 1. Stato attuale (aggiornato al 16 luglio 2026)

- **Codice completo e verificato**: `npm run build` e `npm run lint` passano **senza variabili
  d'ambiente** (requisito voluto: la CI e la build non devono dipendere dalle chiavi).
- La **home single page** (restyling caldo incluso), la pagina privacy, le API, la dashboard
  e la documentazione sono scritte e verificate. A fine sessione il progetto viene consegnato
  come `sito-psicologa.zip` (senza `node_modules`/`.next`).
- **Non ancora fatto** (in ordine): ① creazione dei servizi esterni e compilazione di
  `.env.local` (Supabase, Google, Resend) seguendo `README.md`; ② test end-to-end con
  credenziali reali (prenotazione → evento sul calendario → email → dashboard); ③ deploy su
  Vercel (region `fra1`) + dominio; ④ inserimento foto reali; ⑤ revisione legale della pagina
  `/privacy` (è una bozza con punti `[DA COMPLETARE]`).

## 2. Cos'è il progetto

Sito vetrina con **prenotazione online reale** per la Dott.ssa Giulia Ortu, psicologa a Roma
(studio in Via Lorenzo Vidaschi 7 + sedute online). Nato dalla trasformazione di un mockup
HTML approvato dal cliente, poi **evoluto in due passaggi decisi con Federico il 16/07/2026**:
① struttura **single page** (sezioni con ancore al posto delle pagine separate);
② **restyling "caldo"** ispirato a un riferimento grafico fornito in sessione (palette
crema/marrone/arancione con tocchi salvia, titoli serif, logo stilizzato, illustrazione hero).
**Il codice è la fonte di verità del design** (design system in §5); il mockup originale non è
più il riferimento. Il nuovo look è in attesa di conferma da parte di Giulia.

**Struttura**: single page (sezioni `#chi-sono`, `#servizi` e la **sezione finale scura
unificata** `#prenota`/`#contatti`: bottoni WhatsApp + chiamata, calendario di prenotazione in
card bianca, modulo di contatto a destra), pagina `/privacy`, Area riservata (login +
dashboard clienti con storico sedute e note private). I vecchi URL delle pagine reindirizzano
(308) alle rispettive sezioni. Nessuna mappa (recapiti nel footer).

## 3. Stack e versioni

| Cosa | Tecnologia | Note |
|---|---|---|
| Frontend + API | Next.js **15** (App Router) + React 19 + TypeScript strict | `src/`, alias `@/*` |
| Stili | Tailwind CSS **4** (config in CSS via `@theme`) | niente `tailwind.config` |
| DB + Auth | Supabase (`@supabase/supabase-js` ^2, `@supabase/ssr` ^0.6.1) | region **UE** obbligatoria |
| Calendario | `googleapis` ^144 (service account JWT) | freebusy + events |
| Email | `resend` ^4 | HTML inline nei colori brand |
| Validazione | `zod` ^3.24 | schemi in `lib/validation.ts` |
| Fusi orari | `date-fns` 4 + `date-fns-tz` 3 (`fromZonedTime`) | tutto in `Europe/Rome` |
| Hosting | Vercel Hobby, region **fra1** | costo ~0 € |
| CI | GitHub Actions (`.github/workflows/ci.yml`): `npm ci` + lint + build | senza env |

## 4. Regole non negoziabili (decise col cliente)

1. **Fedeltà assoluta al design system documentato in §5** (che dal 16/07/2026 sostituisce il
   mockup originale): mai inventare colori, dimensioni o testi nuovi. I valori esatti
   (es. `text-[15.5px]`, `py-[18px]`) sono voluti, non refusi da "normalizzare".
2. **Niente pagamenti**: i badge/stati di pagamento del mockup sono stati **rimossi
   deliberatamente**. Non reintrodurre nulla di legato a pagamenti/fatture.
3. **Codice in italiano**: nomi di funzioni, variabili, componenti, commenti e token colore
   sono in italiano (es. `creaClientServer`, `bg-crema`, `formattaDataOra`). Mantenere lo stile.
4. **Semplicità > over-engineering**: manutenzione facile anche per non sviluppatori; nessuna
   nuova dipendenza senza forte motivo.
5. **GDPR**: dati sanitari → tutto in UE, minimizzazione (il modulo contatti NON salva su DB),
   font self-hosted (mai Google Fonts CDN), consenso privacy tracciato (`privacy_consenso_il`).
6. **La build deve sempre passare senza env**: le variabili d'ambiente si leggono **solo
   dentro le funzioni**, mai a livello di modulo.
7. Rispondere/documentare **in italiano**.

## 5. Design system (restyling "caldo" del 16/07/2026 — non modificare senza il cliente)

- **Font self-hosted** in `src/fonts/`, caricati via `next/font/local` in `src/app/layout.tsx`:
  - **Figtree variabile** (pesi 300–900): testo corrente (`--font-sans`).
  - **Fraunces variabile** (normal + italic, con assi SOFT/WONK): **titoli (h1/h2/h3), logo e
    `.evidenzia`** (`--font-titoli`); la base CSS applica `"SOFT" 60, "WONK" 0`.
  - `figtree-latin-ext.woff2` tenuto come riserva, non caricato.
- **Breakpoint responsive UNICO a 960px**: in Tailwind è ridefinito `--breakpoint-lg: 961px`.
  Si usa **solo il prefisso `lg:`** per il responsive.
- **Palette** (token in `@theme` in `src/app/globals.css`). ⚠️ **Nota storica sui nomi**: i
  token `bosco` e `felce` risalgono alla prima versione verde del sito; oggi contengono dei
  marroni (si è cambiato solo il valore per non toccare 15 file):

| Token | Hex | Uso |
|---|---|---|
| `fondo` | #F6F2EC | sfondo pagina (crema caldo) |
| `arancione` / `arancione-scuro` | #6F7D60 / #A64F2E | **primario**: bottoni, link, `.evidenzia`, focus |
| `bosco` | #2C251E | **marrone caffè**: testo principale, superfici scure (sezione contatti, footer, login) |
| `felce` | #6B5F53 | **marrone talpa**: testo secondario |
| `salvia` / `salvia-scura` | #8C9A7B / #6F7D60 | tocchi verdi: occhielli, icone, bottone WhatsApp, logo |
| `salvia-spenta` | #8B9483 | testo attenuato, etichette |
| `crema` | #EFE8DC | sezioni alternate, riquadri, selezioni |
| `sabbia` | #D9C7B8 | marroncino chiaro: bordo citazione, arco illustrazione, dettagli |
| `bordo` / `bordo-input` / `bordo-header` | #E8E0D2 / #DED3C2 / #E6DECF | bordi card / campi / header |
| `riga-menu` | #EAE2D4 | divisori menu mobile |
| `footer-chiaro` / `footer-spento` / `footer-riga` | #B5A996 / #8C8170 / #40372C | footer e sezione contatti scura |

- **Classi componente** (CSS puro in `globals.css`, dimensioni aggiunte con utility Tailwind):
  `.contenitore` (max 1160px, padding 24px) · `.occhiello` (salvia) · `.evidenzia` (parola del
  titolo in corsivo arancione) · `.btn-primario` (arancione) · `.btn-salvia` (pieno salvia,
  canale WhatsApp) · `.btn-contorno` · `.btn-contorno-salvia` · `.carta` (bianca, bordo, ombra
  `0 2px 24px rgba(44,37,30,.06)`) · `.campo` · `.etichetta` · `.segnaposto-foto` (righe
  diagonali beige, in attesa delle foto reali).
- Bottoni **pill** (radius 999px); card radius 16–28px; H1 hero 52px/-1px. **Titoli a peso
  500** (regola base in `@layer base`, niente utility `font-bold/extrabold` sugli h1–h3:
  scelta "sottile ed elegante" del 16/07). ⚠️ Le regole base di `globals.css` DEVONO stare
  in `@layer base`: fuori dal layer vincerebbero su `.btn-*` (bug dei bottoni già successo).
- **Identità**: logo header = rametto di salvia SVG + `STUDIO.nomeBreve` in Fraunces corsivo;
  favicon goccia/foglia su fondo arancione (`src/app/icon.svg`); hero con **illustrazione
  stilizzata** (`components/IllustrazioneHero.tsx`: arco sabbia, sole terracotta, pianta di
  salvia) al posto della foto, finché non arriveranno le foto reali (che restano previste
  nella sezione Chi sono).
- **Stati di selezione UI**: card/chip selezionati = `border-salvia bg-crema`; orario
  selezionato = `bg-salvia text-white`; orario non disponibile = attenuato, barrato,
  disabilitato.
- Le **email** (`lib/email.ts`) usano hex inline allineati alla palette (aggiornarli a mano se
  la palette cambia).

## 6. Architettura e flussi chiave

**Disponibilità = SOLO Google Calendar (unica fonte di verità).** Il sito legge i periodi
occupati con l'API *freebusy*: qualsiasi evento sul calendario rende l'orario non prenotabile.
→ Per bloccare orari/ferie la psicologa **crea eventi sul proprio calendario**, senza toccare
il sito. Slot proposti: 09–12 e 15–18 (8 slot da 60′), da domani, 12 giorni, domeniche escluse
(tutto configurabile in `PRENOTAZIONI` dentro `src/lib/config.ts`).

**Flusso `POST /api/prenotazioni`** (ordine importante, non alterare):
1. honeypot `sito` compilato → finto successo (201) senza fare nulla;
2. rate limit best-effort (5/10 min per IP, in memoria);
3. validazione zod → 400 con primo errore leggibile;
4. giorno/orario ∈ consentiti; slot nel futuro;
5. **ri-verifica freebusy** sul calendario → se occupato 409 `{errore:'orario_occupato'}`;
6. upsert `clienti` per email (client **admin/service_role**);
7. insert `appuntamenti` — il vincolo DB `EXCLUDE USING gist (tstzrange…)` blocca le
   sovrapposizioni concorrenti: errore Postgres **23P01 → 409 orario_occupato**;
8. `creaEvento` su Google Calendar — **se fallisce: delete della riga appena inserita → 502**
   (mai un appuntamento su DB senza evento in calendario);
9. update `google_event_id`;
10. email (conferma cliente + notifica psicologa) **best-effort**: se falliscono si logga, non
    si blocca la prenotazione;
11. 201 `{ok:true}`.

Il frontend (`BookingFlow`), su 409, torna allo step 1, mostra il messaggio e **ricarica la
disponibilità**.

**Annullamento** (azione dashboard): elimina l'evento da Google Calendar (404/410 ignorati) →
`stato='annullato'` → l'orario torna automaticamente prenotabile. Il record resta come storico.

**Auth & sicurezza**: Supabase Auth email/password; **un solo account** (psicologa) creato a
mano, registrazioni disabilitate. Middleware protegge `/area-riservata/clienti*`. RLS attiva:
**nessuna policy per `anon`** (accesso pubblico negato), policy piena per `authenticated`; le
prenotazioni pubbliche passano dal server con `service_role` (mai esposta al browser).

**Timezone**: gli slot si convertono in UTC con `fromZonedTime(…, 'Europe/Rome')`
(`lib/slots.ts`); la formattazione italiana usa `Intl.DateTimeFormat('it-IT')`
(`lib/formatta.ts`: `formattaData` "18 Lug 2026", `formattaDataOra` "… · 10:00",
`formattaDataEstesa` per le email).

**Contatti**: `POST /api/contatti` inoltra via Resend con `replyTo` del mittente; **nessun
salvataggio su DB** (minimizzazione GDPR).

## 7. Mappa del progetto

```
src/app/(sito)/          pagine pubbliche (layout con Header+Footer)
  page.tsx               HOME SINGLE PAGE (force-dynamic): #chi-sono, #servizi e sezione
                         scura unificata #prenota/#contatti (canali rapidi + wizard + modulo)
  privacy/               unica altra pagina pubblica
src/app/area-riservata/  login (sfondo scuro, card bianca) — FUORI dal gruppo (sito)
  clienti/               elenco · [id]/ dettaglio · actions.ts (salvaNota,
                         annullaAppuntamento, esci) · BarraDashboard.tsx
src/app/api/             disponibilita/ (GET)  prenotazioni/ (POST)  contatti/ (POST)
src/components/          Header (logo), Footer, BookingFlow, ContactForm, Foto,
                         IllustrazioneHero (SVG hero)
src/lib/                 config.ts ⭐  slots.ts  formatta.ts  validation.ts  rate-limit.ts
                         tipi.ts  google-calendar.ts  email.ts  supabase/{client,server,admin}
src/middleware.ts        sessione Supabase + protezione dashboard
next.config.ts           redirect 308 dei vecchi URL alle ancore della single page
supabase/schema.sql      da eseguire UNA volta nel SQL Editor di Supabase
README.md                setup tecnico completo   GUIDA-GESTIONE.md  guida per Giulia
.env.example             tutte le variabili documentate
```

**Dove si modifica cosa**: testi/contatti/orari/servizi → `src/lib/config.ts` (un solo file);
colori → `@theme` in `globals.css`; foto reali → file in `public/images/` + prop `src` sul
componente `<Foto>`.

**Variabili d'ambiente** (solo runtime): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
`GOOGLE_PRIVATE_KEY` (con `\n` letterali), `GOOGLE_CALENDAR_ID`, `RESEND_API_KEY`,
`EMAIL_FROM`, `EMAIL_PSICOLOGA`.

## 8. Insidie tecniche note (leggere prima di modificare)

- **Next 15**: `cookies()` e `params` sono **async** (`await cookies()`,
  `params: Promise<{id:string}>`). Già gestito ovunque.
- **Env mai a module scope** (pena: build rossa senza env). Tutti i client (Supabase, Google,
  Resend) sono a **inizializzazione lazy** dentro funzioni.
- **`@supabase/ssr` 0.6**: il parametro di `setAll` va **tipizzato esplicitamente**
  (`{name, value, options: CookieOptions}[]`), altrimenti errore TS "implicit any" (già
  corretto in `server.ts` e `middleware.ts` — non regredire).
- La home single page (`(sito)/page.tsx`) ha `export const dynamic = "force-dynamic"`: i
  giorni prenotabili partono "da domani" e non devono congelarsi al build (nella tabella di
  build `/` è ƒ, non ○ — controllare dopo ogni modifica).
- Rate limit **in memoria** = best-effort su serverless (documentato, scelta consapevole).
- Tailwind 4: le utility vincono sulle classi `@layer components` → le classi `.btn-*` non
  fissano padding/font-size, che si aggiungono per-uso (`px-[30px] py-[15px] text-[15.5px]`).
- Font: si caricano con `next/font/local` **solo** `figtree-latin.woff2` e i due
  `fraunces-latin-full-*.woff2` (coprono l'italiano); aggiungere latin-ext richiederebbe
  `@font-face` manuali con `unicode-range`.
- Nel sandbox di sviluppo: `pip` richiede `--break-system-packages`; per la build Next non
  serve rete verso Google Fonts (motivo in più per il self-hosting).

## 9. Backlog / possibili evoluzioni (non richieste, da proporre solo se utile)

email di promemoria pre-seduta · allegato `.ics` nella conferma · pagina 404 brandizzata ·
immagine OpenGraph · analytics privacy-friendly (Plausible/Umami) · test automatici (Playwright)
· sostituzione embed Maps con immagine statica + link.

## 10. Registro decisioni delle sessioni

- **15/07/2026** — Progetto creato dal mockup approvato; build+lint verdi; badge pagamento
  rimossi; aggiunte funzionali minime e giustificate: editor note sedute, annulla appuntamento,
  pagina privacy (bozza), mappa reale, icone SVG contatti, sitemap/robots, favicon.
- **16/07/2026** — Primo avvio verificato (Node 22, npm ci pulito, 55 file sorgente): `lint` e
  `build` verdi **senza env**; server di produzione avviato: le 6 pagine pubbliche + robots/
  sitemap rispondono 200, 404 ok; senza credenziali `/api/disponibilita` degrada con errori
  gestiti (400 senza data, 502 con data) e `/area-riservata` dà 500 per env Supabase mancante
  (atteso: si risolve col punto ① dello stato attuale). **Nessuna modifica al codice.** Punti
  in sospeso invariati: ① servizi esterni + `.env.local`, ② test end-to-end, ③ deploy Vercel,
  ④ foto reali, ⑤ revisione legale privacy.
- **16/07/2026 (bis)** — Due evoluzioni richieste da Federico. **(a) Single page**: le pagine
  Chi sono / Servizi / Prenotazione / Contatti sono diventate sezioni della home con ancore e
  scorrimento morbido (`scroll-padding-top` 88px per l'header sticky); anteprime della vecchia
  home sostituite dai contenuti completi; vecchi URL → redirect 308 in `next.config.ts`;
  sitemap ridotta a `/` e `/privacy`; sezione Prenota con **3 canali**: WhatsApp (`wa.me`),
  chiamata (`tel:`) e calendario online (wizard esistente); nuovi campi `STUDIO
  .telefonoInternazionale` e `STUDIO.nomeBreve` in config. **(b) Restyling "caldo"** su
  riferimento grafico fornito in sessione: palette crema/marrone/arancione con tocchi salvia e
  sabbia (§5), titoli in **Fraunces** self-hosted (asse SOFT, nessuna nuova dipendenza: file
  woff2 copiati come per Figtree), parole `.evidenzia` nei titoli, logo header stilizzato
  (rametto salvia + nome in corsivo), favicon arancione, **illustrazione hero SVG**
  (`IllustrazioneHero.tsx`), sezione Contatti scura, bottone WhatsApp salvia, email allineate
  alla palette. I NOMI dei token `bosco`/`felce` sono rimasti (valgono ora marrone caffè/
  talpa — nota in §5). Il mockup originale **non è più il riferimento**; nuovo look **da far
  riapprovare a Giulia**. Verifica: lint/build senza env ok, `/` dinamica, redirect e ancore
  testati a runtime. Microtesti nuovi (card dei 3 canali) minimi, da rivedere col cliente.
- **16/07/2026 (ter)** — Su richiesta di Federico (tre blocchi finali troppo ripetitivi),
  sezioni **Prenota e Contatti unificate** in un'unica sezione scura: header unico, **due
  bottoni sottili** WhatsApp (`.btn-salvia`) e chiamata (`.btn-primario`) affiancati, sotto il
  **wizard del calendario in card bianca** (titoletto "Prenota dal calendario"); a destra card
  bianca col **modulo di contatto** (titolo riusato "Un messaggio può cambiare qualcosa.") e
  nota sul segreto professionale. **Mappa Google rimossa** (superflua: recapiti nel footer) e
  riferimenti a Maps eliminati da informativa privacy, README e insidie. Ancore: `#prenota`
  sulla sezione, `#contatti` sulla colonna del modulo (redirect invariati). I messaggi di
  errore del wizard citano ora "il modulo di contatto". Lint+build senza env ok, runtime
  verificato (ancore, wa.me, tel:, niente iframe).
- **16/07/2026 (quater)** — Sezioni **"Ti riconosci in questo?" e "Servizi offerti" fuse**
  (richiesta di Federico): erano speculari, ogni bisogno ha il servizio che gli risponde.
  In `config.ts` ogni voce di `SERVIZI` ora contiene il proprio `bisogno` appaiato
  (array `BISOGNI` eliminato); la sezione `#servizi` mostra 4 card "bisogno → percorso":
  gancio emotivo in alto, poi divisore, occhiello "IL PERCORSO" (unico microtesto nuovo),
  nome servizio, descrizione, tag e Prenota. Header combinato: occhiello e titolo dai
  Bisogni, sottotitolo dai Servizi. Abbinamenti: ansia→Terapia individuale, stare bene→
  Sostegno, adolescenza→Percorso adolescenti, famiglia→Percorso familiare. Alternanza
  sfondi: crema (chi sono) → fondo (servizi) → scuro (prenota/contatti). Lint+build ok,
  runtime verificato.
- **16/07/2026 (quinquies)** — Prima foto reale: in hero `<IllustrazioneHero />` sostituita da
  `<Foto src="/images/homepage.jfif" …>` (file fornito da Federico in `public/images/`).
  Il componente `IllustrazioneHero` resta in `components/` come alternativa. Resta il
  segnaposto nella sezione Chi sono (punto ④). Ottimizzatore immagini verificato (200 su
  `_next/image` col .jfif).
- **16/07/2026 (sexies)** — Quattro rifiniture da feedback visivo di Federico. **(a) Bug testo
  bottoni invisibile**: la regola globale `a { color }` era fuori dai layer CSS e batteva le
  classi `.btn-*` di `@layer components` (i link-bottone mostravano testo arancione su fondo
  arancione); regole base spostate in `@layer base` → testo dei bottoni **sempre bianco**,
  hover che scurisce solo lo sfondo. **(b) Simmetria prenota/contatti**: bottoni WhatsApp e
  chiamata su riga a tutta larghezza sopra la griglia; due card di **pari altezza**
  (`items-stretch`), nota "segreto professionale" dentro la card del modulo (`mt-auto`),
  textarea del modulo più alta (rows 8). **(c) Hero**: colonna immagine `lg:flex-[1.2]` e
  `ratio` esatto del file (1024×559) → foto intera senza ritagli, più grande (annullato il
  tentativo manuale `objectFit="contain"`, prop inesistente che rompeva il type-check).
  **(d) Titoli più sottili**: Fraunces a peso 500 via regola base; rimosse le utility
  `font-extrabold/bold` da h1–h3 di home, wizard, form e privacy (l'area riservata interna
  resta com'è). Lint+build senza env ok, runtime verificato.
- **16/07/2026 (septies)** — Logo header: al posto del rametto SVG + nome in Fraunces ora c'è
  il **logo grafico fornito da Federico** (volto/albero con scritte calligrafiche),
  `<Image src="/images/logo.png">` alto 56px (`h-14 w-auto`), `mix-blend-multiply` per far
  sparire il fondo chiaro dell'immagine sul crema dell'header, `priority` per il caricamento.
  ⚠️ Il file `public/images/logo.png` va salvato da Federico (l'immagine era in chat, non
  trasferibile come file): finché manca, l'header mostra l'icona di immagine rotta.
  `STUDIO.nomeBreve` resta in config (non più usato nell'header). **Aggiornamento**: il file
  fornito aveva la scacchiera di trasparenza disegnata nei pixel; ripulito via Pillow
  (luminanza→alpha, tratto unificato #2C251E, ritaglio margini, 800×323, 101 KB) →
  `public/images/logo-sito.png` usato nell'header a h-16 (64px), header `py-[14px]`,
  `scroll-padding-top` 96px. Originale conservato in `logo-originale.png`. Poi ingranditi su
  richiesta: logo `h-20` (80px, header `py-[10px]`, scroll-padding 108px) e immagine hero a
  `lg:flex-[1.5]`. Aggiunto anche il ritratto reale nella sezione Chi sono
  (`public/images/chi-sono.jpg`, file salvato da Federico): punto ④ dello stato attuale
  completato per le foto principali.
- **16/07/2026 (octies)** — Rifiniture mobile dopo audit responsive: h1 hero 40px→52px da
  `lg:`, h2 Chi sono 32→40, h2 Servizi 30→38; campi nome/cognome ed email/telefono del wizard
  in colonna singola su mobile (`grid-cols-1 lg:grid-cols-2`); logo header 56px su mobile
  (`h-14 lg:h-20`) con `scroll-padding-top` 84px via media query ≤960px. Il resto era già
  responsive (breakpoint unico, sezioni impilate, menu hamburger, overflow-x hidden, giorni
  scorrevoli). Lint+build senza env ok. Aggiunta successiva: l'immagine della hero è
  nascosta su mobile (`hidden lg:block`), la hero resta solo testo.
- **16/07/2026 (nonies)** — Social e icone: nuovi campi `STUDIO.social` (Instagram, LinkedIn,
  URL puliti dai parametri di tracciamento) con icone nel footer; nuovo `components/Icone.tsx`
  (calendario, telefono, WhatsApp, Instagram, LinkedIn — tutte `currentColor`); icona
  calendario su tutti i bottoni "Prenota", WhatsApp e telefono sui rispettivi canali rapidi
  (`gap-2` sui bottoni). Immagine hero portata a `lg:flex-[2]`. Federico ha virato al
  verde salvia-scuro il sole/dettagli dell'illustrazione e la favicon (#C4623B→#6F7D60 in
  quei file): scelta sua, mantenuta. Lint+build ok.
- **16/07/2026 (decies)** — Hero con tre canali diretti al posto di Prenota+Scrivimi:
  **WhatsApp** (salvia, apre la chat con **messaggio precompilato** — testo in
  `STUDIO.messaggioWhatsApp`, usato anche dal bottone della sezione prenota; scritto
  "primo colloquio conoscitivo", NON "prova gratuita": il sito non promette gratuità,
  confermare con Federico/Giulia), **Chiamami** (contorno, dialer `tel:`) e **Prenota una
  seduta** (arancione, scorre a `#prenota`). Lint+build ok, runtime verificato.
- *(aggiungere qui le decisioni delle prossime sessioni)*
