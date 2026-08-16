<?php
// ============================================
// MOORA SPK — Save Calculation History
// POST /api/history/save.php
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$userId = requireAuth();
$db = getDB();
$input = getJsonInput();

$title               = trim($input['title'] ?? 'Perhitungan MOORA');
$alternativesSnapshot = $input['alternatives'] ?? [];
$rankingResult       = $input['ranking'] ?? [];
$yiResults           = $input['yi'] ?? [];

if (empty($alternativesSnapshot) || empty($rankingResult)) {
    jsonResponse(['success' => false, 'message' => 'Data perhitungan tidak lengkap.'], 400);
}

try {
    $db->beginTransaction();

    // Insert calculation record
    $stmt = $db->prepare('INSERT INTO calculations (user_id, title, alternatives_snapshot, ranking_result) VALUES (?, ?, ?, ?)');
    $stmt->execute([
        $userId,
        $title,
        json_encode($alternativesSnapshot),
        json_encode($rankingResult)
    ]);
    $calcId = $db->lastInsertId();

    // Insert individual results
    $stmt = $db->prepare('INSERT INTO calculation_results (calculation_id, alt_name, yi_value, benefit_sum, cost_sum, rank_position) VALUES (?, ?, ?, ?, ?, ?)');
    foreach ($rankingResult as $item) {
        $benefitSum = 0;
        $costSum = 0;
        // Find matching yi data
        if (!empty($yiResults)) {
            foreach ($alternativesSnapshot as $idx => $alt) {
                if (($alt['name'] ?? '') === ($item['name'] ?? '')) {
                    $benefitSum = $yiResults[$idx]['benefitSum'] ?? 0;
                    $costSum = $yiResults[$idx]['costSum'] ?? 0;
                    break;
                }
            }
        }
        $stmt->execute([
            $calcId,
            $item['name'] ?? '',
            $item['yi'] ?? 0,
            $benefitSum,
            $costSum,
            $item['rank'] ?? 0
        ]);
    }

    $db->commit();

    jsonResponse([
        'success' => true,
        'message' => 'Perhitungan berhasil disimpan ke history.',
        'id'      => (int)$calcId
    ], 201);

} catch (Exception $e) {
    $db->rollBack();
    jsonResponse(['success' => false, 'message' => 'Gagal menyimpan: ' . $e->getMessage()], 500);
}
