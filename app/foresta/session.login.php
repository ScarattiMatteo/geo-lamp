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

$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM utenti WHERE username = '{$username}' AND password = '{$password}' LIMIT 1";

$result = $conn->query($query);

$rows = $result->fetch_all(MYSQLI_ASSOC);

if (count($rows) > 0 ) {
    $id_utente = $rows[0]['id_utente'];
    $query_update = "UPDATE utenti SET session_id = '{$current_session_id}' WHERE id_utente = {$id_utente}";
    $conn->execute_query($query_update);

    $result = $conn->query($query);
    $rows = $result->fetch_all(MYSQLI_ASSOC);
}

$conn->close();

$risposta_json = [
    'current_session_id' => $current_session_id,
    'rows' => $rows
];

header('Content-Type: application/json; charset=utf-8');
echo json_encode($risposta_json, JSON_PRETTY_PRINT);
