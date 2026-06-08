<?php
require_once "config.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];
$action = $_GET["action"] ?? null;

// ================================
// GET — Lire les données
// ================================
if ($method === "GET") {

    // Liste des catégories
    if ($action === "categories") {
        $stmt = $pdo->query("
            SELECT fc.*, COUNT(ft.id) as nb_topics
            FROM forum_categories fc
            LEFT JOIN forum_topics ft ON ft.category_id = fc.id
            GROUP BY fc.id
            ORDER BY fc.ordre
        ");
        echo json_encode($stmt->fetchAll());
    }

    // Sujets d'une catégorie
    elseif ($action === "topics") {
        $category_id = $_GET["category_id"] ?? null;
        if (!$category_id) { echo json_encode(["erreur" => "category_id manquant"]); exit; }

        $stmt = $pdo->prepare("
            SELECT ft.*, u.username, u.role,
                   COUNT(fr.id) as nb_replies
            FROM forum_topics ft
            JOIN users u ON ft.user_id = u.id
            LEFT JOIN forum_replies fr ON fr.topic_id = ft.id
            WHERE ft.category_id = ?
            GROUP BY ft.id
            ORDER BY ft.created_at DESC
        ");
        $stmt->execute([$category_id]);
        echo json_encode($stmt->fetchAll());
    }

    // Détail d'un sujet + ses réponses
    elseif ($action === "topic") {
        $topic_id = $_GET["topic_id"] ?? null;
        if (!$topic_id) { echo json_encode(["erreur" => "topic_id manquant"]); exit; }

        $stmt = $pdo->prepare("
            SELECT ft.*, u.username, u.role
            FROM forum_topics ft
            JOIN users u ON ft.user_id = u.id
            WHERE ft.id = ?
        ");
        $stmt->execute([$topic_id]);
        $topic = $stmt->fetch();

        $stmt = $pdo->prepare("
            SELECT fr.*, u.username, u.role
            FROM forum_replies fr
            JOIN users u ON fr.user_id = u.id
            WHERE fr.topic_id = ?
            ORDER BY fr.created_at ASC
        ");
        $stmt->execute([$topic_id]);
        $replies = $stmt->fetchAll();

        echo json_encode(["topic" => $topic, "replies" => $replies]);
    }
}

// ================================
// POST — Créer un sujet ou une réponse
// ================================
elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data["action"] ?? null;

    // Créer un sujet
    if ($action === "create_topic") {
        $category_id = $data["category_id"] ?? null;
        $user_id = $data["user_id"] ?? null;
        $titre = trim($data["titre"] ?? "");
        $contenu = trim($data["contenu"] ?? "");

        if (!$category_id || !$user_id || !$titre || !$contenu) {
            echo json_encode(["erreur" => "Tous les champs sont obligatoires"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO forum_topics (category_id, user_id, titre, contenu, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$category_id, $user_id, $titre, $contenu]);
        echo json_encode(["succès" => true, "id" => $pdo->lastInsertId()]);
    }

    // Répondre à un sujet
    elseif ($action === "create_reply") {
        $topic_id = $data["topic_id"] ?? null;
        $user_id = $data["user_id"] ?? null;
        $contenu = trim($data["contenu"] ?? "");

        if (!$topic_id || !$user_id || !$contenu) {
            echo json_encode(["erreur" => "Tous les champs sont obligatoires"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO forum_replies (topic_id, user_id, contenu, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$topic_id, $user_id, $contenu]);
        echo json_encode(["succès" => true]);
    }
}

// ================================
// DELETE — Supprimer un sujet ou une réponse
// ================================
elseif ($method === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data["action"] ?? null;

    if ($action === "delete_topic") {
        $id = $data["id"] ?? null;
        $pdo->prepare("DELETE FROM forum_replies WHERE topic_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM forum_topics WHERE id = ?")->execute([$id]);
        echo json_encode(["succès" => true]);
    }

    elseif ($action === "delete_reply") {
        $id = $data["id"] ?? null;
        $pdo->prepare("DELETE FROM forum_replies WHERE id = ?")->execute([$id]);
        echo json_encode(["succès" => true]);
    }
}
?>