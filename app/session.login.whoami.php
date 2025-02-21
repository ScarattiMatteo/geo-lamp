<?
session_start();

$current_session_id = session_id();

$servername = $_ENV['MYSQL_HOST'];
$username = $_ENV['MYSQL_USER'];
$password = $_ENV['MYSQL_PASSWORD'];
$database = $_ENV['MYSQL_DATABASE'];

// Creazione della connessione
$conn = new mysqli($servername, $username, $password, $database);

// Verifica della connessione
if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

$query = "SELECT * FROM utenti WHERE session_id = '{$current_session_id}' LIMIT 1";

$result = $conn->query($query);

$rows = $result->fetch_all(MYSQLI_ASSOC);

$id_utente = null;
$username = null;
if (count($rows) > 0 ) {
    $id_utente = $rows[0]['id_utente'];
    $username = $rows[0]['username'];
}

$conn->close();

$risposta_json = [
    'current_session_id' => $current_session_id,
    'id_utente' => $id_utente,
    'username' => $username
];

header('Content-Type: application/json; charset=utf-8');
echo json_encode($risposta_json, JSON_PRETTY_PRINT);
