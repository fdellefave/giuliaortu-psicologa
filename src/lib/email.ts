import { Resend } from "resend";
import { STUDIO } from "@/lib/config";
import { etichettaModalita, formattaDataEstesa, formattaOra } from "@/lib/formatta";

/**
 * Invio email tramite Resend (https://resend.com).
 * - Conferma al cliente + notifica alla psicologa a ogni prenotazione.
 * - Inoltro dei messaggi del modulo Contatti.
 */

function clientResend(): Resend {
  const chiave = process.env.RESEND_API_KEY;
  if (!chiave) throw new Error("Variabile RESEND_API_KEY mancante");
  return new Resend(chiave);
}

function mittente(): string {
  return process.env.EMAIL_FROM ?? `Prenotazioni <onboarding@resend.dev>`;
}

function emailPsicologa(): string {
  return process.env.EMAIL_PSICOLOGA ?? STUDIO.email;
}

/** Involucro HTML condiviso, nei colori del sito. */
function layoutEmail(titolo: string, corpo: string): string {
  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;padding:0;background:#F6F2EC;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2EC;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E8E0D2;border-radius:16px;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <div style="font-size:12px;font-weight:bold;letter-spacing:1.5px;color:#8C9A7B;text-transform:uppercase;margin-bottom:12px;">${STUDIO.nome} · ${STUDIO.professione}</div>
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#2C251E;">${titolo}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;font-size:15px;line-height:1.7;color:#6B5F53;">
                ${corpo}
              </td>
            </tr>
          </table>
          <div style="max-width:560px;padding:20px 8px;font-size:12px;line-height:1.6;color:#8B9483;text-align:center;">
            ${STUDIO.nome} · ${STUDIO.indirizzo}<br>
            ${STUDIO.telefono} · ${STUDIO.email}
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function riquadroRiepilogo(righe: Array<[string, string]>): string {
  const contenuto = righe
    .map(
      ([etichetta, valore]) =>
        `<div style="margin-bottom:8px;"><span style="font-size:12px;font-weight:bold;letter-spacing:.5px;color:#8B9483;text-transform:uppercase;">${etichetta}</span><br><span style="font-size:15px;color:#2C251E;font-weight:600;">${valore}</span></div>`
    )
    .join("");
  return `<div style="background:#EFE8DC;border-radius:12px;padding:18px 20px;margin:8px 0 20px;">${contenuto}</div>`;
}

/** Evita che testo inserito dagli utenti venga interpretato come HTML. */
function pulisci(testo: string): string {
  return testo
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type DatiEmailPrenotazione = {
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  inizio: Date;
  modalita: "studio" | "online";
  motivo: string;
  noteCliente?: string;
};

/** Email di conferma al cliente. */
export async function inviaConfermaCliente(dati: DatiEmailPrenotazione): Promise<void> {
  const quando = `${formattaDataEstesa(dati.inizio)} alle ${formattaOra(dati.inizio)}`;
  const dove =
    dati.modalita === "studio"
      ? STUDIO.indirizzo
      : "Online — riceverai il collegamento video prima della seduta";

  const corpo = `
    <p style="margin:0 0 16px;">Ciao ${pulisci(dati.nome)},</p>
    <p style="margin:0 0 16px;">la tua seduta è confermata. Ecco il riepilogo:</p>
    ${riquadroRiepilogo([
      ["Quando", quando],
      ["Modalità", etichettaModalita(dati.modalita)],
      ["Dove", dove],
      ["Motivo", pulisci(dati.motivo)],
    ])}
    <p style="margin:0 0 16px;">Se hai bisogno di spostare o annullare l'appuntamento, rispondi a questa email oppure chiamami al ${STUDIO.telefono}.</p>
    <p style="margin:0;">A presto,<br><strong style="color:#2C251E;">${STUDIO.nome}</strong></p>
  `;

  await clientResend().emails.send({
    from: mittente(),
    to: dati.email,
    replyTo: emailPsicologa(),
    subject: `Seduta confermata — ${formattaDataEstesa(dati.inizio)} alle ${formattaOra(dati.inizio)}`,
    html: layoutEmail(`La tua seduta è confermata, ${pulisci(dati.nome)}.`, corpo),
  });
}

/** Notifica alla psicologa di una nuova prenotazione. */
export async function inviaNotificaPsicologa(dati: DatiEmailPrenotazione): Promise<void> {
  const quando = `${formattaDataEstesa(dati.inizio)} alle ${formattaOra(dati.inizio)}`;

  const corpo = `
    <p style="margin:0 0 16px;">Nuova prenotazione dal sito:</p>
    ${riquadroRiepilogo([
      ["Cliente", `${pulisci(dati.nome)} ${pulisci(dati.cognome)}`],
      ["Quando", quando],
      ["Modalità", etichettaModalita(dati.modalita)],
      ["Motivo", pulisci(dati.motivo)],
      ["Email", pulisci(dati.email)],
      ...(dati.telefono ? ([["Telefono", pulisci(dati.telefono)]] as Array<[string, string]>) : []),
    ])}
    ${
      dati.noteCliente
        ? `<p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:.5px;color:#8B9483;text-transform:uppercase;">Note del cliente</p><p style="margin:0 0 16px;">${pulisci(dati.noteCliente)}</p>`
        : ""
    }
    <p style="margin:0;">L'evento è già stato aggiunto al tuo Google Calendar. Trovi i dettagli anche nell'area riservata del sito.</p>
  `;

  await clientResend().emails.send({
    from: mittente(),
    to: emailPsicologa(),
    replyTo: dati.email,
    subject: `Nuova prenotazione — ${pulisci(dati.nome)} ${pulisci(dati.cognome)}, ${formattaDataEstesa(dati.inizio)} ${formattaOra(dati.inizio)}`,
    html: layoutEmail("Nuova prenotazione dal sito", corpo),
  });
}

type DatiMessaggioContatto = {
  nome: string;
  email: string;
  messaggio: string;
};

/** Inoltra alla psicologa un messaggio del modulo Contatti. */
export async function inviaMessaggioContatto(dati: DatiMessaggioContatto): Promise<void> {
  const corpo = `
    ${riquadroRiepilogo([
      ["Da", pulisci(dati.nome)],
      ["Email", pulisci(dati.email)],
    ])}
    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:.5px;color:#8B9483;text-transform:uppercase;">Messaggio</p>
    <p style="margin:0;white-space:pre-line;">${pulisci(dati.messaggio)}</p>
  `;

  await clientResend().emails.send({
    from: mittente(),
    to: emailPsicologa(),
    replyTo: dati.email,
    subject: `Nuovo messaggio dal sito — ${pulisci(dati.nome)}`,
    html: layoutEmail("Nuovo messaggio dal sito", corpo),
  });
}
