-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.19-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura para tabela chatdb.contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `user_login` varchar(32) NOT NULL,
  `contact_login` varchar(32) NOT NULL,
  `blocked` tinyint(1) DEFAULT 0,
  KEY `user_login` (`user_login`),
  KEY `contact_login` (`contact_login`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`user_login`) REFERENCES `users` (`login`),
  CONSTRAINT `contacts_ibfk_2` FOREIGN KEY (`contact_login`) REFERENCES `users` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela chatdb.groups
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf32;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela chatdb.groupusers
CREATE TABLE IF NOT EXISTS `groupusers` (
  `groupid` int(11) NOT NULL,
  `userlogin` varchar(32) NOT NULL,
  `admin` tinyint(1) DEFAULT 0,
  KEY `groupid` (`groupid`),
  KEY `userlogin` (`userlogin`),
  CONSTRAINT `groupusers_ibfk_1` FOREIGN KEY (`groupid`) REFERENCES `groups` (`id`),
  CONSTRAINT `groupusers_ibfk_2` FOREIGN KEY (`userlogin`) REFERENCES `users` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela chatdb.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(64) NOT NULL AUTO_INCREMENT,
  `chat_hash` varchar(64) NOT NULL,
  `sender` varchar(32) NOT NULL,
  `content` varchar(1024) DEFAULT NULL,
  `senttime` datetime DEFAULT current_timestamp(),
  `hidden` tinyint(1) DEFAULT 0,
  `message_type` tinyint(3) unsigned DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `users` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf32;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela chatdb.users
CREATE TABLE IF NOT EXISTS `users` (
  `login` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`login`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- Exportação de dados foi desmarcado.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
