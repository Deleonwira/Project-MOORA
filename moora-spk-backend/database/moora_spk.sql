-- ============================================
-- MOORA SPK — Database Schema
-- MySQL Database: moora_spk
-- ============================================

CREATE DATABASE IF NOT EXISTS moora_spk
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE moora_spk;

-- ============================================
-- Tabel Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel Alternatives (data alternatif per user)
-- ============================================
CREATE TABLE IF NOT EXISTS alternatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    criteria_values JSON NOT NULL COMMENT 'Array of 10 numeric values [C1..C10]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel Calculations (history perhitungan)
-- ============================================
CREATE TABLE IF NOT EXISTS calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL DEFAULT 'Perhitungan MOORA',
    alternatives_snapshot JSON NOT NULL COMMENT 'Snapshot of alternatives at calculation time',
    ranking_result JSON NOT NULL COMMENT 'Full ranking result from MOORA engine',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabel Calculation Results (detail per alternatif per perhitungan)
-- ============================================
CREATE TABLE IF NOT EXISTS calculation_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calculation_id INT NOT NULL,
    alt_name VARCHAR(150) NOT NULL,
    yi_value DECIMAL(20, 10) NOT NULL,
    benefit_sum DECIMAL(20, 10) NOT NULL DEFAULT 0,
    cost_sum DECIMAL(20, 10) NOT NULL DEFAULT 0,
    rank_position INT NOT NULL,
    FOREIGN KEY (calculation_id) REFERENCES calculations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Indexes untuk performa
-- ============================================
CREATE INDEX idx_alternatives_user ON alternatives(user_id);
CREATE INDEX idx_calculations_user ON calculations(user_id);
CREATE INDEX idx_calculations_created ON calculations(created_at DESC);
CREATE INDEX idx_calc_results_calc ON calculation_results(calculation_id);
