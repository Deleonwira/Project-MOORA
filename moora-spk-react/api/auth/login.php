<?php
// ============================================
// MOORA SPK — Login API
// POST /api/auth/login.php
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$input = getJsonInput();

$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(['success' => false, 'message' => 'Email dan password harus diisi.'], 400);
}

$db = getDB();

$stmt = $db->prepare('SELECT id, nama, email, password FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(['success' => false, 'message' => 'Email atau password salah.'], 401);
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_nama'] = $user['nama'];
$_SESSION['user_email'] = $user['email'];

jsonResponse([
    'success' => true,
    'message' => 'Login berhasil!',
    'user' => [
        'id'    => $user['id'],
        'nama'  => $user['nama'],
        'email' => $user['email']
    ]
]);
