<?php
// ============================================
// MOORA SPK — Delete Calculation History
// DELETE /api/history/delete.php?id=X
// ============================================

require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$userId = requireAuth();
$db = getDB();

$calcId = (int)($_GET['id'] ?? 0);

// Also support JSON body
if ($calcId <= 0) {
    $input = getJsonInput();
    $calcId = (int)($input['id'] ?? 0);
}

if ($calcId <= 0) {
    jsonResponse(['success' => false, 'message' => 'ID perhitungan tidak valid.'], 400);
}

// Delete (cascade will handle calculation_results)
$stmt = $db->prepare('DELETE FROM calculations WHERE id = ? AND user_id = ?');
$stmt->execute([$calcId, $userId]);

if ($stmt->rowCount() === 0) {
    jsonResponse(['success' => false, 'message' => 'Perhitungan tidak ditemukan.'], 404);
}

jsonResponse([
    'success' => true,
    'message' => 'History perhitungan berhasil dihapus.'
]);
