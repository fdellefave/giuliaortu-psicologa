/**
 * Limitatore di richieste "best effort", in memoria.
 *
 * Su Vercel ogni istanza serverless ha la propria memoria, quindi questo
 * limite non è una garanzia assoluta — ma, insieme al campo honeypot dei
 * moduli, è sufficiente a scoraggiare invii automatici su un sito di
 * queste dimensioni senza aggiungere servizi esterni.
 */

const registro = new Map<string, number[]>();

/**
 * Ritorna `true` se la richiesta può procedere, `false` se il chiamante
 * ha superato `massimo` richieste nella finestra indicata.
 */
export function consentiRichiesta(
  chiave: string,
  massimo: number,
  finestraMs: number
): boolean {
  const ora = Date.now();
  const precedenti = (registro.get(chiave) ?? []).filter((t) => ora - t < finestraMs);
  if (precedenti.length >= massimo) {
    registro.set(chiave, precedenti);
    return false;
  }
  precedenti.push(ora);
  registro.set(chiave, precedenti);

  // Pulizia occasionale per non far crescere la mappa all'infinito.
  if (registro.size > 1000) {
    for (const [k, v] of registro) {
      if (v.every((t) => ora - t >= finestraMs)) registro.delete(k);
    }
  }
  return true;
}

/** Ricava un identificativo del chiamante dagli header della richiesta. */
export function chiaveClient(req: Request): string {
  const inoltrato = req.headers.get("x-forwarded-for");
  return inoltrato?.split(",")[0]?.trim() || "sconosciuto";
}
