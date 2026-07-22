PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS albums (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id    INTEGER NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  file_path   TEXT NOT NULL,
  thumb_path  TEXT NOT NULL,
  width       INTEGER NOT NULL DEFAULT 0,
  height      INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photo_exif (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id     INTEGER NOT NULL UNIQUE,
  camera       TEXT,
  lens         TEXT,
  aperture     TEXT,
  shutter_speed TEXT,
  iso          INTEGER,
  focal_length TEXT,
  taken_at     DATETIME,
  location     TEXT,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);
