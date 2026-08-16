<?php
// ============================================
// MOORA SPK — List Calculation History
// GET /api/history/list.php
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$userId = requireAuth();
$db = getDB();

$stmt = $db->prepare('
    SELECT 
        c.id,
        c.title,
        c.created_at,
        c.ranking_result,
        (SELECT COUNT(*) FROM calculation_results WHERE calculation_id = c.id) as total_alternatives,
        (SELECT alt_name FROM calculation_results WHERE calculation_id = c.id AND rank_position = 1 LIMIT 1) as winner
    FROM calculations c
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
');
$stmt->execute([$userId]);
$rows = $stmt->fetchAll();

$history = [];
foreach ($rows as $row) {
    $history[] = [
        'id'                 => (int)$row['id'],
        'title'              => $row['title'],
        'created_at'         => $row['created_at'],
        'total_alternatives' => (int)$row['total_alternatives'],
        'winner'             => $row['winner']
    ];
}

jsonResponse([
    'success' => true,
    'history' => $history
]);
