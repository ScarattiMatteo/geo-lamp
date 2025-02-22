<?
session_start();

$current_session_id = session_id();

$risposta_json = [
    'current_session_id' => $current_session_id,
];

header('Content-Type: application/json; charset=utf-8');
echo json_encode($risposta_json, JSON_PRETTY_PRINT);
