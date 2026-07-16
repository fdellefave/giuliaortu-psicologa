-- ============================================================
--  SCHEMA DATABASE — Sito Dott.ssa Giulia Ortu
--  Da eseguire una sola volta in: Supabase → SQL Editor → New query
-- ============================================================

-- Estensione necessaria per il vincolo che impedisce due
-- appuntamenti sovrapposti (doppia prenotazione).
create extension if not exists btree_gist;

-- ------------------------------------------------------------
-- CLIENTI
-- Un record per persona, identificata dall'email.
-- ------------------------------------------------------------
create table public.clienti (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  cognome    text not null,
  email      text not null unique,
  telefono   text,
  creato_il  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- APPUNTAMENTI
-- Ogni prenotazione confermata dal sito. Le note della seduta
-- (nota_seduta) vengono scritte dalla psicologa dalla dashboard.
-- ------------------------------------------------------------
create table public.appuntamenti (
  id                  uuid primary key default gen_random_uuid(),
  cliente_id          uuid not null references public.clienti (id) on delete cascade,
  inizio              timestamptz not null,
  fine                timestamptz not null,
  modalita            text not null check (modalita in ('studio', 'online')),
  motivo              text not null,
  note_cliente        text,          -- note lasciate dal cliente al momento della prenotazione
  nota_seduta         text,          -- appunti privati della psicologa dopo la seduta
  stato               text not null default 'confermato'
                      check (stato in ('confermato', 'annullato')),
  google_event_id     text,          -- id dell'evento creato su Google Calendar
  privacy_consenso_il timestamptz not null default now(),  -- quando è stato dato il consenso privacy
  creato_il           timestamptz not null default now(),

  constraint fine_dopo_inizio check (fine > inizio),

  -- Impedisce a livello di database due appuntamenti confermati
  -- che si sovrappongono nel tempo (protezione contro prenotazioni simultanee).
  constraint appuntamenti_no_sovrapposizioni
    exclude using gist ( tstzrange(inizio, fine) with && )
    where (stato = 'confermato')
);

create index appuntamenti_cliente_idx on public.appuntamenti (cliente_id, inizio desc);
create index appuntamenti_inizio_idx  on public.appuntamenti (inizio);

-- ------------------------------------------------------------
-- SICUREZZA (Row Level Security)
-- I dati sono sanitari: l'accesso diretto è consentito SOLO
-- all'utente autenticato (la psicologa). Il pubblico non ha
-- alcun accesso: le prenotazioni dal sito passano dal server,
-- che usa la chiave service_role.
-- ------------------------------------------------------------
alter table public.clienti      enable row level security;
alter table public.appuntamenti enable row level security;

create policy "clienti: accesso completo per utenti autenticati"
  on public.clienti
  for all
  to authenticated
  using (true)
  with check (true);

create policy "appuntamenti: accesso completo per utenti autenticati"
  on public.appuntamenti
  for all
  to authenticated
  using (true)
  with check (true);

-- Nessuna policy per il ruolo `anon`: senza policy, l'accesso è negato.
