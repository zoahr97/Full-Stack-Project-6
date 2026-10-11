-- ============================================================
-- schema.sql – יצירת כל הטבלאות של TripDiary
-- ============================================================

CREATE DATABASE IF NOT EXISTS tripdiary;
USE tripdiary;

-- -----------------------------------------------------------
-- users – פרופיל ציבורי (ללא סיסמה!)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  phone      VARCHAR(30),
  website    VARCHAR(100),
  is_blocked BOOLEAN      DEFAULT FALSE,   -- לחסימת משתמש על ידי אדמין
  is_admin   BOOLEAN      DEFAULT FALSE,   -- חשבון מנהל
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- credentials – טבלה נפרדת לסיסמאות, לא נחשפת לקליינט לעולם
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS credentials (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  user_id       INT          NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- trips – הטיולים של כל משתמש (במקום todos)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  title       VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date  DATE,
  end_date    DATE,
  status      ENUM('planned','ongoing','completed') DEFAULT 'planned',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- journal – רשומות יומן מסעות (במקום posts)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS journal (
  id       INT           AUTO_INCREMENT PRIMARY KEY,
  user_id  INT           NOT NULL,
  title    VARCHAR(255)  NOT NULL,
  body     TEXT          NOT NULL,
  location VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- memories – הערות על רשומת יומן (במקום comments)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS memories (
  id        INT           AUTO_INCREMENT PRIMARY KEY,
  entry_id  INT           NOT NULL,
  name      VARCHAR(100)  NOT NULL,
  email     VARCHAR(100)  NOT NULL,
  body      TEXT          NOT NULL,
  FOREIGN KEY (entry_id) REFERENCES journal(id) ON DELETE CASCADE
);
