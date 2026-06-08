<?php
require_once "config.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];

// LIRE les commentaires d'une quête
if ($method === "GET") {
    $quest_id = $_GET["quest_id"] ?? null;

    if (!$quest_id) {
        echo json_encode(["erreur" => "quest_id manquant"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT comments.id, comments.contenu, comments.created_at, users.username, users.role
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.quest_id = ?
        ORDER BY comments.created_at DESC
    ");
    $stmt->execute([$quest_id]);
    $comments = $stmt->fetchAll();

    echo json_encode($comments);
}

// AJOUTER un commentaire
elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $quest_id = $data["quest_id"] ?? null;
    $user_id = $data["user_id"] ?? null;
    $contenu = trim($data["contenu"] ?? "");

    if (!$quest_id || !$user_id || !$contenu) {
        echo json_encode(["erreur" => "Tous les champs sont obligatoires"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO comments (quest_id, user_id, contenu, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$quest_id, $user_id, $contenu]);

    // Retourner le commentaire avec le username
    $stmt = $pdo->prepare("
        SELECT comments.id, comments.contenu, comments.created_at, users.username
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.id = ?
    ");
    $stmt->execute([$pdo->lastInsertId()]);
    $comment = $stmt->fetch();

    echo json_encode(["succès" => true, "comment" => $comment]);
}

// SUPPRIMER un commentaire (admin/moderateur seulement)
elseif ($method === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["id"] ?? null;

    if (!$id) {
        echo json_encode(["erreur" => "id manquant"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["succès" => true]);
}
?>