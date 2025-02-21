CREATE TABLE IF NOT EXISTS `utenti` (
  `id_utente` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(10) NOT NULL,
  `password` varchar(10) NOT NULL,
  `session_id` varchar(32) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `utenti` (`username`, `password`)
    VALUES (
        CONCAT('utente_', FLOOR(RAND()*(100)+1)),
        LEFT(MD5(RAND()), 8)
    );
