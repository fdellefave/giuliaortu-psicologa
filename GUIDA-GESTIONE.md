# Guida per Giulia — come si usa il sito, giorno per giorno

Questa guida è per te: niente termini tecnici, solo quello che ti serve.

## Come funzionano le prenotazioni

1. Una persona sceglie sul sito giorno, orario e modalità (studio oppure online) e lascia i suoi dati.
2. Il sito controlla **il tuo Google Calendar**: mostra come liberi solo gli orari in cui non hai già impegni.
3. Alla conferma:
   - l'appuntamento **compare sul tuo Google Calendar** (titolo: "Seduta in studio · Nome Cognome"), con email e telefono del cliente nella descrizione;
   - il cliente riceve un'**email di conferma**;
   - tu ricevi un'**email di notifica**.

Non devi fare nulla: se l'evento è sul calendario, la prenotazione è andata a buon fine.

## Bloccare giorni o orari (ferie, impegni, pause)

Non serve toccare il sito: **crea un evento sul tuo Google Calendar** che copra quell'orario (anche dal telefono). Da quel momento il sito non proporrà più quegli orari.

- Ferie di una settimana → evento "Ferie" che dura tutta la settimana.
- Mercoledì pomeriggio libero ogni settimana → evento ricorrente ogni mercoledì 15:00–19:00.

## Sedute online

Il cliente sa dall'email che riceverà il collegamento video prima della seduta: **mandaglielo tu** (Meet, Zoom, ecc.) rispondendo alla sua email o al telefono. Trovi i suoi contatti nell'evento del calendario e nella dashboard.

## La dashboard (area riservata)

Vai su **tuosito.it/area-riservata** (link "Area riservata" anche in fondo al sito) ed entra con la tua email e password.

- **Clienti**: l'elenco di chi ha prenotato almeno una volta, con la prossima seduta di ciascuno.
- **Scheda cliente**: contatti, prossimo appuntamento e **storico delle sedute**.
- **Note delle sedute**: nella scheda, accanto a ogni seduta passata, tocca *"Aggiungi nota"* (o *"Modifica"*) per scrivere i tuoi appunti. Li vedi **solo tu**.
- **Annullare un appuntamento**: nella scheda del cliente, sotto "Prossimo appuntamento", tocca *"Annulla appuntamento"*. L'evento sparisce dal calendario e l'orario torna prenotabile. **Avvisa tu il cliente** (rispondendo alla email di notifica fai prima: la risposta va direttamente a lui/lei).

## I messaggi della sezione Contatti

Ti arrivano **via email**: rispondi direttamente dalla tua casella, la risposta va al mittente.

## Cambiare la password

Chiedi a chi gestisce il sito di farlo da Supabase (Authentication → Users → … → *Reset password*), oppure fallo tu se hai accesso. Usa una password lunga e non riutilizzata altrove: dietro il login ci sono dati delicati dei tuoi clienti.

## Piccole modifiche ai contenuti

Testi, telefono, indirizzo, orari proposti, servizi: è tutto in **un solo file** (`src/lib/config.ts`). Chi ti segue il sito ci mette pochi minuti; le istruzioni tecniche sono nel file `README.md`.

## Se qualcosa non va

- *Un orario risulta occupato ma per te è libero* → controlla sul Google Calendar: qualsiasi evento in quell'orario (anche privato) lo rende non prenotabile.
- *Non arrivano le email* → controlla lo spam; se il problema resta, chi gestisce il sito verificherà il servizio email (Resend).
- *Non riesci a entrare nella dashboard* → verifica email e password; in caso, fai reimpostare la password da Supabase.
