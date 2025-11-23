-- Initialize DB Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  role TEXT,
  api_key_hash TEXT
);

CREATE TABLE runs (
  id BIGINT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  prompt_text TEXT,
  model_name TEXT,
  model_version TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE responses (
  id BIGINT PRIMARY KEY,
  run_id BIGINT REFERENCES runs(id),
  response_text TEXT,
  tokens INTEGER,
  latency INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE decisions (
  id BIGINT PRIMARY KEY,
  response_id BIGINT REFERENCES responses(id),
  severity FLOAT,
  reason TEXT,
  rules_matched TEXT,
  classifier_score FLOAT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE incidents (
  id BIGINT PRIMARY KEY,
  decision_id BIGINT REFERENCES decisions(id),
  status TEXT DEFAULT 'open',
  assigned_to TEXT,
  notes TEXT
);


-- Seed Admin
INSERT INTO users (id, name, role, api_key_hash)
VALUES (1, 'Admin', 'admin', 'demo') ON CONFLICT DO NOTHING;