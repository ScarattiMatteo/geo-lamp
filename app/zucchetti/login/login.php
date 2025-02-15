<?php
    // Connect to the database
    include "../shared/connect_database.php";

    // Check if any of the fields have been left unfilled (somehow)
    if (
        !isset($_POST["role"]) ||
        !isset($_POST["first-name"]) || empty($_POST["first-name"]) ||
        !isset($_POST["last-name"])  || empty($_POST["last-name"]) ||
        !isset($_POST["password"])   || empty($_POST["password"])
    ) {
        // Output an error message
        consoleLog("Missing data");

        // Save the error in the localStorage: 'login.js' will retrieve it and handle it
        // Also, redirect back to the login page
        echo "<script>localStorage.setItem('login_error', 'missing_data'); window.location.href = 'login.html';</script>";

        // Close the connection
        exit;
    }

    // Store all the login data
    $role = $_POST["role"];
    $first_name = $_POST["first-name"];
    $last_name = $_POST["last-name"];
    $password = $_POST["password"];

    // Do something...
    echo $role . ', ' . $first_name . ', ' . $last_name . ', ' . $password;
?>