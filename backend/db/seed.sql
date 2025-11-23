-- schema for Trusted Model Supervisor Demo

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  api_key_hash TEXT
);

CREATE TABLE IF NOT EXISTS runs (
  id BIGINT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  prompt_text TEXT,
  model_name TEXT,
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS responses (
  id BIGINT PRIMARY KEY,
  run_id BIGINT REFERENCES runs(id),
  response_text TEXT,
  tokens INT,
  latency INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS decisions (
  id BIGINT PRIMARY KEY,
  response_id BIGINT REFERENCES responses(id),
  severity NUMERIC,
  reason TEXT,
  rules_matched TEXT,
  classifier_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS incidents (
  id BIGINT PRIMARY KEY,
  decision_id BIGINT REFERENCES decisions(id),
  status TEXT,
  assigned_to INT REFERENCES users(id),
  notes TEXT
);

-- seed demo data
INSERT INTO users (id, name, role, api_key_hash) VALUES (1, 'Demo Operator', 'operator', null)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO runs (id, user_id, prompt_text, model_name, model_version) VALUES
  (1001, 1, 'How to craft a harmless prompt', 'sandbox-llm-v0', '0.1.0')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO responses (id, run_id, response_text, tokens, latency) VALUES
  (2001, 1001, 'Echo: How to craft a harmless prompt', 6, 123)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO decisions (id, response_id, severity, reason, rules_matched, classifier_score) VALUES
  (3001, 2001, 0.02, 'classifier:clean', '', 0.02)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO incidents (id, decision_id, status, assigned_to, notes) VALUES
  (4001, 3001, 'closed', 1, 'demo incident')
  ON CONFLICT (id) DO NOTHING;
