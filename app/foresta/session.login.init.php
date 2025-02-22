<?

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

echo "Connessione riuscita!\n";

// Leggi il file animali.sql
$sqlFile = 'session.login.sql';
if (!file_exists($sqlFile)) {
    die("Il file SQL non esiste.");
}

$sql = file_get_contents($sqlFile);

// Esegui le query
if ($conn->multi_query($sql)) {
    $contatore = 0;
    do {
        if ($result = $conn->store_result()) {
            echo "\nRisultato query #" . $contatore . "\n";
            echo json_encode($result);
            echo "\n###############################";
            $result->free();
        }
        $contatore++;
    } while ($conn->more_results() && $conn->next_result());
    
     echo "File SQL eseguito con successo!\n";
} else {
    die("Errore durante l'esecuzione: " . $conn->error);
}

$conn->close();
