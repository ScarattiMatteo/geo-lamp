<?
session_start();

$current_session_id = session_id();
$session_status = session_status();
$session_status_human = "";

// https://www.php.net/manual/en/function.session-status.php
switch ($session_status) {
    case PHP_SESSION_DISABLED:
        $session_status_human = "PHP_SESSION_DISABLED";
        break;
    case PHP_SESSION_NONE:
        $session_status_human = "PHP_SESSION_NONE";
        break;
    case PHP_SESSION_ACTIVE:
        $session_status_human = "PHP_SESSION_ACTIVE";
        break;
    default:
        $session_status_human = "N/A";
}

$session_new = false;
if (!isset($_SESSION['start_time'])) {
    $session_new = true;
    $_SESSION['start_time'] = time();
}

$session_duration = time() - $_SESSION['start_time'];

$risposta_json = [
    'current_session_id' => $current_session_id,
    'session_status' => $session_status,
    'session_status_human' => $session_status_human,
    'session_new' => $session_new,
    'session_start_time' => $_SESSION['start_time'],
    'session_duration' => $session_duration
];

header('Content-Type: application/json; charset=utf-8');
echo json_encode($risposta_json, JSON_PRETTY_PRINT);
