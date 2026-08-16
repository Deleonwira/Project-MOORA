<?php
// ============================================
// MOORA SPK — Alternatives API
// GET/POST/PUT/DELETE /api/alternatives.php
// ============================================

require_once __DIR__ . '/../config/database.php';

$userId = requireAuth();
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all alternatives for current user
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
                'updated_at' => $row['updated_at']
            ];
        }

        jsonResponse(['success' => true, 'alternatives' => $alternatives]);
        break;

    case 'POST':
        // Add new alternative
        $input = getJsonInput();
        $name   = trim($input['name'] ?? '');
        $values = $input['values'] ?? [];

        if (empty($name)) {
            jsonResponse(['success' => false, 'message' => 'Nama alternatif tidak boleh kosong.'], 400);
        }
        if (!is_array($values) || count($values) !== 10) {
            jsonResponse(['success' => false, 'message' => 'Harus ada tepat 10 nilai kriteria.'], 400);
        }

        $stmt = $db->prepare('INSERT INTO alternatives (user_id, name, criteria_values) VALUES (?, ?, ?)');
        $stmt->execute([$userId, $name, json_encode($values)]);
        $newId = $db->lastInsertId();

        jsonResponse([
            'success' => true,
            'message' => 'Alternatif berhasil ditambahkan.',
            'id'      => 'alt_' . $newId,
            'db_id'   => (int)$newId
        ], 201);
        break;

    case 'PUT':
        // Update alternative
        $input = getJsonInput();
        $dbId   = (int)($input['db_id'] ?? 0);
        $name   = trim($input['name'] ?? '');
        $values = $input['values'] ?? [];

        if ($dbId <= 0) {
            jsonResponse(['success' => false, 'message' => 'ID alternatif tidak valid.'], 400);
        }
        if (empty($name)) {
            jsonResponse(['success' => false, 'message' => 'Nama alternatif tidak boleh kosong.'], 400);
        }
        if (!is_array($values) || count($values) !== 10) {
            jsonResponse(['success' => false, 'message' => 'Harus ada tepat 10 nilai kriteria.'], 400);
        }

        // Verify ownership
        $stmt = $db->prepare('SELECT id FROM alternatives WHERE id = ? AND user_id = ?');
        $stmt->execute([$dbId, $userId]);
        if (!$stmt->fetch()) {
            jsonResponse(['success' => false, 'message' => 'Alternatif tidak ditemukan.'], 404);
        }

        $stmt = $db->prepare('UPDATE alternatives SET name = ?, criteria_values = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([$name, json_encode($values), $dbId, $userId]);

        jsonResponse(['success' => true, 'message' => 'Alternatif berhasil diperbarui.']);
        break;

    case 'DELETE':
        // Delete alternative
        $input = getJsonInput();
        $dbId = (int)($input['db_id'] ?? 0);

        // Also support query string
        if ($dbId <= 0 && isset($_GET['db_id'])) {
            $dbId = (int)$_GET['db_id'];
        }

        if ($dbId <= 0) {
            jsonResponse(['success' => false, 'message' => 'ID alternatif tidak valid.'], 400);
        }

        $stmt = $db->prepare('DELETE FROM alternatives WHERE id = ? AND user_id = ?');
        $stmt->execute([$dbId, $userId]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['success' => false, 'message' => 'Alternatif tidak ditemukan.'], 404);
        }

        jsonResponse(['success' => true, 'message' => 'Alternatif berhasil dihapus.']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}
