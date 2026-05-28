-- Void Context Engine — index schema
-- Stage: skeleton

CREATE TABLE IF NOT EXISTS files (
    id          INTEGER PRIMARY KEY,
    path        TEXT NOT NULL UNIQUE,
    language    TEXT,
    size        INTEGER,
    mtime       INTEGER,
    hash        TEXT
);

CREATE TABLE IF NOT EXISTS symbols (
    id          TEXT PRIMARY KEY,
    file_id     INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    kind        TEXT NOT NULL,
    line        INTEGER NOT NULL,
    column      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS [references] (
    symbol_id   TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    file_id     INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    line        INTEGER NOT NULL,
    column      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS call_edges (
    caller_id   TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    callee_id   TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    PRIMARY KEY (caller_id, callee_id)
);

CREATE TABLE IF NOT EXISTS import_edges (
    from_file   INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    to_path     TEXT NOT NULL,
    resolved    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_symbols_name ON symbols(name);
CREATE INDEX IF NOT EXISTS idx_symbols_file ON symbols(file_id);
CREATE INDEX IF NOT EXISTS idx_refs_symbol  ON [references](symbol_id);
CREATE INDEX IF NOT EXISTS idx_calls_caller ON call_edges(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_callee ON call_edges(callee_id);
CREATE INDEX IF NOT EXISTS idx_imports_from ON import_edges(from_file);
