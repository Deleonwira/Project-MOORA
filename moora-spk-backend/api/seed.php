<?php
// ============================================
// MOORA SPK — Seed Default Alternatives
// POST /api/seed.php
// Inserts 10 default machine alternatives for the logged-in user.
// Skips if user already has alternatives.
// ============================================

require_once __DIR__ . '/../config/database.php';

$userId = requireAuth();
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

// Check if user already has alternatives
$stmt = $db->prepare('SELECT COUNT(*) as cnt FROM alternatives WHERE user_id = ?');
$stmt->execute([$userId]);
$count = (int)$stmt->fetch()['cnt'];

if ($count > 0) {
    jsonResponse([
        'success' => false,
        'message' => 'Data alternatif sudah ada. Hapus data terlebih dahulu jika ingin seed ulang.',
        'existing_count' => $count
    ]);
}

// 10 default alternatives
$defaults = [
    ['Meber SR 700 (Italia)',           [95000000,  3.0, 292400, 950,  3.0, 8, 1, 8, 7, 20]],
    ['Meber SR 900 (Italia)',           [185000000, 5.6, 378000, 1000, 5.6, 9, 1, 8, 7, 25]],
    ['Centauro CO 700 (Italia)',        [120000000, 3.0, 312800, 1000, 3.0, 9, 1, 8, 7, 20]],
    ['Centauro CO 900 (Italia)',        [280000000, 5.5, 484000, 1000, 5.5, 9, 1, 8, 7, 20]],
    ['SCM Formula S 440P (Italia)',     [130000000, 3.6, 187000, 1050, 3.6, 9, 2, 8, 8, 20]],
    ['SCM Formula S 640P (Italia)',     [230000000, 3.6, 372000, 1050, 3.6, 9, 2, 8, 8, 20]],
    ['Agazzani Rapid 700 (Italia)',     [110000000, 3.0, 306000, 900,  3.0, 8, 1, 8, 7, 18]],
    ['Laguna Tools LT18 HD (Eropa/AS)', [185000000, 3.7, 220731, 1200, 3.7, 9, 1, 7, 6, 15]],
    ['Meber SR 900 Super (Italia)',     [320000000, 7.5, 462000, 1000, 7.5, 9, 1, 8, 7, 25]],
    ['Centauro CO 800 (Italia)',        [200000000, 4.0, 374400, 1000, 4.0, 9, 1, 8, 7, 20]],
];

$stmt = $db->prepare('INSERT INTO alternatives (user_id, name, criteria_values) VALUES (?, ?, ?)');
$inserted = 0;

$db->beginTransaction();
try {
    foreach ($defaults as [$name, $values]) {
        $stmt->execute([$userId, $name, json_encode($values)]);
        $inserted++;
    }
    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    jsonResponse([
        'success' => false,
        'message' => 'Gagal menyimpan data: ' . $e->getMessage()
    ], 500);
}

// Return the inserted alternatives
$stmt = $db->prepare('SELECT id, name, criteria_values, created_at, updated_at FROM alternatives WHERE user_id = ? ORDER BY created_at ASC');
$stmt->execute([$userId]);
$rows = $stmt->fetchAll();

$alternatives = [];
foreach ($rows as $row) {
    $alternatives[] = [
        'id'     => 'alt_' . $row['id'],
        'db_id'  => (int)$row['id'],
        'name'   => $row['name'],
        'values' => json_decode($row['criteria_values'], true),
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
    ];
}

jsonResponse([
    'success' => true,
    'message' => "$inserted alternatif berhasil ditambahkan ke database.",
    'alternatives' => $alternatives
], 201);
