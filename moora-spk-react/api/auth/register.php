<?php
// ============================================
// MOORA SPK — Register API
// POST /api/auth/register.php
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$input = getJsonInput();

// Validasi input
$nama     = trim($input['nama'] ?? '');
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($nama)) {
    jsonResponse(['success' => false, 'message' => 'Nama tidak boleh kosong.'], 400);
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Format email tidak valid.'], 400);
}

if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password minimal 6 karakter.'], 400);
}

$db = getDB();

// Cek email sudah terdaftar
$stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Email sudah terdaftar.'], 409);
}

// Hash password & insert
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);
$stmt = $db->prepare('INSERT INTO users (nama, email, password) VALUES (?, ?, ?)');
$stmt->execute([$nama, $email, $hashedPassword]);

jsonResponse([
    'success' => true,
    'message' => 'Registrasi berhasil! Silakan login.'
], 201);
