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

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$username || !$email || !$password) {
    echo json_encode(["erreur" => "Tous les champs sont obligatoires"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["erreur" => "Cet email est déjà utilisé"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->execute([$username, $email, $hash]);

echo json_encode(["succès" => "Compte créé avec succès"]);
?>