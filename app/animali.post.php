<?php
$servername = $_ENV['MYSQL_HOST'];
$username = $_ENV['MYSQL_USER'];
$password = $_ENV['MYSQL_PASSWORD'];
$database = $_ENV['MYSQL_DATABASE'];

// Creazione della connessione
$conn = new mysqli($servername, $username, $password, $database);

header('Content-Type: application/json; charset=utf-8');

$id_animale = $_POST['id_animale'];
$offset_top = $_POST['offset_top'];
$offset_left = $_POST['offset_left'];

$result = $conn->execute_query("UPDATE animali SET offset_top = {$offset_top}, offset_left = {$offset_left} WHERE id_animale = {$id_animale}");

$risposta_json = [
    "result" => $result
];

echo json_encode($risposta_json, JSON_PRETTY_PRINT);
