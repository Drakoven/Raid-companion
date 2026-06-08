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

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$password) {
    echo json_encode(["erreur" => "Tous les champs sont obligatoires"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password"])) {
    echo json_encode(["erreur" => "Email ou mot de passe incorrect"]);
    exit;
}

echo json_encode([
    "succès" => "Connecté avec succès",
    "user" => [
        "id" => $user["id"],
        "username" => $user["username"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);
?>