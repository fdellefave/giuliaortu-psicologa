# Sito Dott.ssa Giulia Ortu — Psicologa a Roma

Sito vetrina **single page** con **prenotazione online delle sedute**. Design "caldo"
(crema/marrone/arancione con tocchi salvia) del restyling di luglio 2026 — vedi
`CONTESTO-PROGETTO.md` per il design system completo.

## Cosa fa

- **Single page pubblica**: sezioni Home, Chi sono, Servizi, Prenota (WhatsApp, telefono o
  calendario online) e Contatti raggiungibili dal menu con scorrimento morbido; unica altra
  pagina pubblica è `/privacy`. I vecchi URL (`/chi-sono`, `/servizi`, `/prenotazione`,
  `/contatti`) reindirizzano alle rispettive sezioni.
- **Prenotazione con disponibilità reale**: gli orari mostrati sono letti dal **Google Calendar** della psicologa (API freebusy). Ogni prenotazione confermata:
  1. salva cliente e appuntamento su **Supabase** (Postgres),
  2. crea l'evento sul **Google Calendar**,
  3. invia due email via **Resend**: conferma al cliente e notifica alla psicologa.
- **Modulo contatti**: inoltra il messaggio via email (non viene salvato nel database — minimizzazione dei dati).
- **Area riservata** (`/area-riservata`): login con Supabase Auth riservato alla psicologa. Dashboard con elenco clienti, prossimo appuntamento, storico sedute con **note private** modificabili e possibilità di **annullare** un appuntamento (elimina anche l'evento dal calendario, così l'orario torna libero).

## Stack

| Componente | Servizio | Costo |
|---|---|---|
| Frontend + API | Next.js 15 (App Router) + Tailwind CSS 4 | — |
| Hosting | Vercel (piano Hobby, region Frankfurt `fra1`) | 0 € |
| Database + Auth | Supabase (region UE, es. Frankfurt) | 0 € (piano Free) |
| Calendario | Google Calendar API (service account) | 0 € |
| Email | Resend | 0 € fino a 3.000 email/mese |

Font **self-hosted** (`src/fonts/`): Figtree per il testo, Fraunces per i titoli — nessuna chiamata a Google Fonts dai browser dei visitatori.

## Struttura del progetto

```
src/
├── app/
│   ├── (sito)/              # pagine pubbliche (con header e footer)
│   │   ├── page.tsx         # Home "single page": tutte le sezioni con ancore
│   │   ├── privacy/         # unica altra pagina pubblica
│   ├── area-riservata/      # login + dashboard (senza header pubblico)
│   │   ├── page.tsx  LoginForm.tsx
│   │   └── clienti/         # elenco, dettaglio [id], azioni server
│   ├── api/
│   │   ├── disponibilita/   # GET: orari liberi dal Google Calendar
│   │   ├── prenotazioni/    # POST: crea la prenotazione (DB + Calendar + email)
│   │   └── contatti/        # POST: inoltra il messaggio via email
│   ├── layout.tsx  globals.css  sitemap.ts  robots.ts  icon.svg
├── components/              # Header, Footer, BookingFlow, ContactForm, Foto, IllustrazioneHero
├── lib/
│   ├── config.ts            # ⭐ dati dello studio, orari, servizi: SI MODIFICA QUI
│   ├── slots.ts             # generazione giorni/orari prenotabili
│   ├── google-calendar.ts   # freebusy, crea/elimina eventi
│   ├── email.ts             # template e invio email (Resend)
│   ├── validation.ts  formatta.ts  rate-limit.ts  tipi.ts
│   └── supabase/            # client browser / server / admin
├── middleware.ts            # protezione dell'area riservata
supabase/schema.sql          # schema del database (da eseguire una volta)
```

## Avvio in locale

```bash
npm install
cp .env.example .env.local   # poi compila i valori (vedi sotto)
npm run dev                  # http://localhost:3000
```

La build (`npm run build`) **non richiede** variabili d'ambiente: le chiavi servono solo a runtime.

---

## 1. Configurare Supabase (database + login)

1. Crea un progetto su [supabase.com](https://supabase.com) scegliendo una **region UE** (es. *Frankfurt*): i dati delle prenotazioni sono dati sanitari e devono restare in Europa.
2. Apri **SQL Editor → New query**, incolla il contenuto di `supabase/schema.sql` ed esegui.
3. Crea l'utente della psicologa: **Authentication → Users → Add user** (email + password robusta, spunta *Auto confirm*). È l'unico account che serve.
4. Disattiva le registrazioni pubbliche: **Authentication → Sign In / Up → disabilita "Allow new users to sign up"**.
5. Copia da **Project Settings → API** i valori per `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (⚠️ segreta: solo lato server)

> Sicurezza: le tabelle hanno la Row Level Security attiva. Il pubblico non ha alcun accesso diretto; le prenotazioni passano dal server con la chiave `service_role`, la dashboard richiede il login.

## 2. Configurare Google Calendar

1. Vai su [console.cloud.google.com](https://console.cloud.google.com), crea un progetto (es. *sito-prenotazioni*).
2. **API e servizi → Libreria** → cerca **Google Calendar API** → *Abilita*.
3. **API e servizi → Credenziali → Crea credenziali → Account di servizio**. Nome a piacere (es. *prenotazioni*). Non servono ruoli.
4. Apri l'account di servizio → scheda **Chiavi → Aggiungi chiave → JSON**. Dal file scaricato prendi:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (incollala tra virgolette, con i `\n` così come sono nel JSON)
5. Nel **Google Calendar della psicologa**: Impostazioni del calendario → **Condividi con persone specifiche** → aggiungi l'email dell'account di servizio con permesso **"Apportare modifiche agli eventi"**.
6. `GOOGLE_CALENDAR_ID`: per il calendario principale è l'indirizzo Gmail; per un calendario dedicato lo trovi in *Impostazioni → Integra il calendario → ID calendario*.

> Suggerimento: un calendario dedicato "Sedute" tiene separati gli impegni privati; in quel caso la disponibilità del sito considera solo quel calendario.

## 3. Configurare Resend (email)

1. Registrati su [resend.com](https://resend.com) e crea una **API Key** → `RESEND_API_KEY`.
2. Verifica il dominio (es. `giuliaortupsicologa.it`) in **Domains** seguendo le istruzioni DNS, poi imposta `EMAIL_FROM`, es. `"Dott.ssa Giulia Ortu <prenotazioni@giuliaortupsicologa.it>"`.
3. `EMAIL_PSICOLOGA`: la casella che riceve notifiche e messaggi di contatto.

> Per i primissimi test, senza dominio verificato, puoi usare `EMAIL_FROM="Prenotazioni <onboarding@resend.dev>"`: Resend consegnerà solo all'indirizzo del tuo account.

## 4. Pubblicare su Vercel

1. Carica il progetto su GitHub (il file `.github/workflows/ci.yml` esegue lint + build a ogni push).
2. Su [vercel.com](https://vercel.com): **Add New → Project** → importa il repository.
3. In **Settings → Functions** imposta la region **Frankfurt (fra1)** (vicina agli utenti e ai dati).
4. In **Settings → Environment Variables** inserisci tutte le variabili di `.env.example` (incluso `NEXT_PUBLIC_SITE_URL` con l'URL definitivo).
5. Deploy. Collega poi il dominio in **Settings → Domains**.

## Nota GDPR (importante)

Il sito tratta **dati relativi alla salute**. Checklist minima:

- [x] Database e hosting in **UE** (Supabase Frankfurt, Vercel fra1).
- [x] Accesso ai dati protetto: RLS + login singolo della psicologa; chiave `service_role` mai esposta al browser.
- [x] Consenso esplicito in prenotazione, con data/ora salvata (`privacy_consenso_il`).
- [x] Minimizzazione: il modulo contatti non salva nulla nel database.
- [x] Font self-hosted (nessun IP inviato a Google Fonts).
- [ ] **Far revisionare** la pagina `/privacy` (è una bozza con punti `[DA COMPLETARE]`) a un consulente privacy.
- [ ] Sottoscrivere/conservare i **DPA** dei fornitori: [Supabase](https://supabase.com/legal/dpa), [Vercel](https://vercel.com/legal/dpa), [Resend](https://resend.com/legal/dpa), [Google Cloud](https://cloud.google.com/terms/data-processing-addendum).

## Manutenzione ordinaria

- **Testi, contatti, orari, servizi** → `src/lib/config.ts` (un solo file).
- **Orari proposti / giorni di chiusura** → `PRENOTAZIONI` in `config.ts` (es. aggiungere `6` a `giorniChiusura` per chiudere il sabato).
- **Foto reali** → copia i file in `public/images/` e passa `src="/images/nome.jpg"` al componente `<Foto>` nelle pagine (vedi `GUIDA-GESTIONE.md`).
- **Colori** → blocco `@theme` in `src/app/globals.css`.

Per l'uso quotidiano da parte della psicologa (non tecnica) vedi **GUIDA-GESTIONE.md**.
# giuliaortu-psicologa
