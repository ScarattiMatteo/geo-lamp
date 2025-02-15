<?php
    /* Function to output a message to the console */
    function consoleLog($data) {
        // Just creates a new <script> element containing a "console.log" command with the input string
        echo "<script>console.log('$data');</script>";
    }

    // Connect to the localhost
    $hostname = $_ENV['MYSQL_HOST'];

    // User is 'root'
    $username = $_ENV['MYSQL_USER'];

    // No password
    $password = $_ENV['MYSQL_PASSWORD'];

    // The name of the database
    $database = $_ENV['MYSQL_DATABASE'];

    // Create a new connection
    $connection = new mysqli($hostname, $username, $password, $database);

    // If the connection succeeds, output a success message, else it dies
    if (!$connection->connect_errno) {
        consoleLog("Database Connection: Successful");
    } else {
        die(consoleLog("Database Connection: Failed"));
    }
?>