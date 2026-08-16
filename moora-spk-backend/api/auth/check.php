<?php
// ============================================
// MOORA SPK — Auth Check API
// GET /api/auth/check.php
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

if (isset($_SESSION['user_id'])) {
    jsonResponse([
        'loggedIn' => true,
        'user' => [
            'id'    => $_SESSION['user_id'],
            'nama'  => $_SESSION['user_nama'],
            'email' => $_SESSION['user_email']
        ]
    ]);
} else {
    jsonResponse([
        'loggedIn' => false,
        'user'     => null
    ]);
}
