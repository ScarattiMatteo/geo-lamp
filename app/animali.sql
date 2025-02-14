CREATE TABLE IF NOT EXISTS `animali` (
  `id_animale` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `offset_top` int(11) NOT NULL DEFAULT '0',
  `offset_left` int(11) NOT NULL DEFAULT '0',
  `emoji` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `animali` (`emoji`) VALUES ('🦊'), ('🐻'), ('🐰');
