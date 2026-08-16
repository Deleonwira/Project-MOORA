<?php
// ============================================
// MOORA SPK — Logout API
// POST /api/auth/logout.php
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

// Destroy session
session_unset();
session_destroy();

jsonResponse([
    'success' => true,
    'message' => 'Logout berhasil.'
]);
