-- Gatherly legacy hub D1 schema: structure only, no production records or credentials.
-- This is NOT the data store for the current gatherly-compare app (that uses KV).

CREATE TABLE boards (id TEXT PRIMARY KEY,owner_id TEXT NOT NULL,name TEXT NOT NULL,emoji TEXT NOT NULL DEFAULT '✨',created_at TEXT NOT NULL);

CREATE TABLE comments (id TEXT PRIMARY KEY,item_id TEXT NOT NULL,user_id TEXT NOT NULL,body TEXT NOT NULL,created_at TEXT NOT NULL);

CREATE TABLE invites (id TEXT PRIMARY KEY,board_id TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,created_by TEXT NOT NULL,uses INTEGER NOT NULL DEFAULT 0,max_uses INTEGER NOT NULL DEFAULT 20);

CREATE TABLE items (id TEXT PRIMARY KEY,board_id TEXT NOT NULL,created_by TEXT NOT NULL,title TEXT NOT NULL,url TEXT NOT NULL,source TEXT NOT NULL DEFAULT '',category TEXT NOT NULL DEFAULT 'Product',price REAL,currency TEXT NOT NULL DEFAULT 'USD',notes TEXT NOT NULL DEFAULT '',image_url TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'Saved',rating REAL NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);

CREATE TABLE login_failures (email TEXT PRIMARY KEY,count INTEGER NOT NULL DEFAULT 0,last_at TEXT NOT NULL);

CREATE TABLE members (board_id TEXT NOT NULL,user_id TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'editor',PRIMARY KEY(board_id,user_id));

CREATE TABLE sessions (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL);

CREATE TABLE users (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,salt TEXT NOT NULL,password_hash TEXT NOT NULL,created_at TEXT NOT NULL);

CREATE TABLE votes (item_id TEXT NOT NULL,user_id TEXT NOT NULL,value INTEGER NOT NULL,PRIMARY KEY(item_id,user_id));

CREATE INDEX comments_item ON comments(item_id);

CREATE INDEX items_board ON items(board_id,created_at);

CREATE INDEX session_expiry ON sessions(expires_at);
