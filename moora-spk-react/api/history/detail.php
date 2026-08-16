<?php
// ============================================
// MOORA SPK — Calculation History Detail
// GET /api/history/detail.php?id=X
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$userId = requireAuth();
$db = getDB();

$calcId = (int)($_GET['id'] ?? 0);
if ($calcId <= 0) {
    jsonResponse(['success' => false, 'message' => 'ID perhitungan tidak valid.'], 400);
}

// Get calculation
$stmt = $db->prepare('SELECT * FROM calculations WHERE id = ? AND user_id = ?');
$stmt->execute([$calcId, $userId]);
$calc = $stmt->fetch();

if (!$calc) {
    jsonResponse(['success' => false, 'message' => 'Perhitungan tidak ditemukan.'], 404);
}

// Get results
$stmt = $db->prepare('SELECT * FROM calculation_results WHERE calculation_id = ? ORDER BY rank_position ASC');
$stmt->execute([$calcId]);
$results = $stmt->fetchAll();

$formattedResults = [];
foreach ($results as $r) {
    $formattedResults[] = [
        'alt_name'      => $r['alt_name'],
        'yi_value'      => (float)$r['yi_value'],
        'benefit_sum'   => (float)$r['benefit_sum'],
        'cost_sum'      => (float)$r['cost_sum'],
        'rank_position' => (int)$r['rank_position']
    ];
}

jsonResponse([
    'success' => true,
    'calculation' => [
        'id'                    => (int)$calc['id'],
        'title'                 => $calc['title'],
        'created_at'            => $calc['created_at'],
        'alternatives_snapshot' => json_decode($calc['alternatives_snapshot'], true),
        'ranking_result'        => json_decode($calc['ranking_result'], true),
        'results'               => $formattedResults
    ]
]);
