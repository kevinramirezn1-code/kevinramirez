CREATE DATABASE  IF NOT EXISTS `bd_proyecto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bd_proyecto`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bd_proyecto
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria_reservas`
--

DROP TABLE IF EXISTS `auditoria_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_reserva` int NOT NULL,
  `id_docente_afectado` int NOT NULL,
  `fechaInicio_antes` datetime DEFAULT NULL,
  `fechaFin_antes` datetime DEFAULT NULL,
  `idSala_antes` int DEFAULT NULL,
  `estado_antes` varchar(20) DEFAULT NULL,
  `fechaInicio_despues` datetime DEFAULT NULL,
  `fechaFin_despues` datetime DEFAULT NULL,
  `idSala_despues` int DEFAULT NULL,
  `estado_despues` varchar(20) DEFAULT NULL,
  `accion` varchar(20) DEFAULT NULL,
  `fecha_cambio` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_reservas`
--

LOCK TABLES `auditoria_reservas` WRITE;
/*!40000 ALTER TABLE `auditoria_reservas` DISABLE KEYS */;
INSERT INTO `auditoria_reservas` VALUES (1,2,2,'2026-05-28 09:30:00','2026-05-28 11:00:00',2,'ACTIVA','2026-05-28 09:30:00','2026-05-28 11:00:00',1,'ACTIVA','AJUSTE','2026-05-22 22:50:10');
/*!40000 ALTER TABLE `auditoria_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facultad`
--

DROP TABLE IF EXISTS `facultad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facultad` (
  `id` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `decano` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facultad`
--

LOCK TABLES `facultad` WRITE;
/*!40000 ALTER TABLE `facultad` DISABLE KEYS */;
INSERT INTO `facultad` VALUES (1,'Facultad de Ingeniería','Janner'),(2,'Facultad de Comunicación Social','Manuel'),(3,'Facultad de Ciencias Humanas y Artes','Carlos'),(4,'Facultad de Arquitectura','Pepito'),(5,'Facultad de Administración','Juan'),(6,'Instituto de Estudios para la Sostenibilidad','Maria');
/*!40000 ALTER TABLE `facultad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lista_blanca`
--

DROP TABLE IF EXISTS `lista_blanca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lista_blanca` (
  `id` int NOT NULL,
  `correo` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lista_blanca`
--

LOCK TABLES `lista_blanca` WRITE;
/*!40000 ALTER TABLE `lista_blanca` DISABLE KEYS */;
INSERT INTO `lista_blanca` VALUES (1,'SecretariaLista@uao.edu.co');
/*!40000 ALTER TABLE `lista_blanca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(45) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'PC-001','Computador','Ryzen 4'),(2,'SL-001','Silla','Comoda'),(3,'PY-001','Proyector','4K'),(4,'PC-002','Computador','Intel 5'),(5,'SL-002','Silla','Rimax'),(6,'TV-001','Televisor','Full HD');
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime NOT NULL,
  `estado` varchar(20) NOT NULL,
  `idUsuario` int NOT NULL,
  `idSala` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reserva_usuario_idx` (`idUsuario`),
  KEY `reserva_sala_idx` (`idSala`),
  CONSTRAINT `reserva_sala` FOREIGN KEY (`idSala`) REFERENCES `sala` (`id`),
  CONSTRAINT `reserva_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,'2026-05-26 07:00:00','2026-05-26 08:30:00','ACTIVA',2,1),(2,'2026-05-28 09:30:00','2026-05-28 11:00:00','ACTIVA',2,1),(3,'2026-05-29 13:00:00','2026-05-29 15:30:00','ACTIVA',2,1),(4,'2026-05-29 09:00:00','2026-05-29 10:30:00','ACTIVA',3,3),(5,'2026-05-25 10:00:00','2026-05-25 12:00:00','ACTIVA',3,4);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `auditoria_reservas_update` AFTER UPDATE ON `reserva` FOR EACH ROW BEGIN

    IF OLD.fechaInicio <> NEW.fechaInicio
       OR OLD.fechaFin <> NEW.fechaFin
       OR OLD.idSala <> NEW.idSala
       OR OLD.estado <> NEW.estado THEN

        INSERT INTO auditoria_reservas (
            id_reserva,
            id_docente_afectado,
            fechaInicio_antes,
            fechaFin_antes,
            idSala_antes,
            estado_antes,
            fechaInicio_despues,
            fechaFin_despues,
            idSala_despues,
            estado_despues,
            accion,
            fecha_cambio
        )
        VALUES (
            OLD.id,
            OLD.idUsuario,
            OLD.fechaInicio,
            OLD.fechaFin,
            OLD.idSala,
            OLD.estado,
            NEW.fechaInicio,
            NEW.fechaFin,
            NEW.idSala,
            NEW.estado,

            CASE 
                WHEN OLD.estado <> 'CANCELADA' AND NEW.estado = 'CANCELADA'
                    THEN 'CANCELACION'
                WHEN OLD.estado = 'CANCELADA' AND NEW.estado <> 'CANCELADA'
                    THEN 'REACTIVACION'
                ELSE 'AJUSTE'
            END,

            NOW()
        );

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `ubicacion` varchar(60) NOT NULL,
  `capacidad` int NOT NULL,
  `estado` varchar(20) NOT NULL,
  `facultad_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sala_facultad_idx` (`facultad_id`),
  CONSTRAINT `sala_facultad` FOREIGN KEY (`facultad_id`) REFERENCES `facultad` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (1,'Oficina Cafetin','Bloque B',15,'disponible',1),(2,'Lab Robotica','Laboratorio 1',20,'disponible',1),(3,'Torreon ','Bloque A',60,'disponible',2),(4,'Salon de Actividades','Auditorio',15,'disponible',2);
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala_recursos`
--

DROP TABLE IF EXISTS `sala_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala_recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_sala` int NOT NULL,
  `id_recurso` int NOT NULL,
  `estado` varchar(45) NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  KEY `recurso_sala_idx` (`id_recurso`),
  KEY `salaRecurso_sala_idx` (`id_sala`),
  CONSTRAINT `recurso_sala` FOREIGN KEY (`id_recurso`) REFERENCES `recursos` (`id`),
  CONSTRAINT `salaRecurso_sala` FOREIGN KEY (`id_sala`) REFERENCES `sala` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala_recursos`
--

LOCK TABLES `sala_recursos` WRITE;
/*!40000 ALTER TABLE `sala_recursos` DISABLE KEYS */;
INSERT INTO `sala_recursos` VALUES (1,1,1,'activo'),(2,1,2,'activo'),(3,2,3,'activo'),(4,1,4,'inactivo'),(5,3,5,'activo'),(6,3,6,'activo'),(7,4,4,'activo');
/*!40000 ALTER TABLE `sala_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `correo` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(45) NOT NULL,
  `idFacultad` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_facultad_idx` (`idFacultad`),
  CONSTRAINT `usuario_facultad` FOREIGN KEY (`idFacultad`) REFERENCES `facultad` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Secretaria@uao.edu.co','$2b$10$V55Y3w2cT3/Z03bWvpcKvuArz3S3s3iZja6LmgG6bsI7.qZ8rB2qm','secretaria',1),(2,'Docente@uao.edu.co','$2b$10$DqkHGQHWg9TofPdPkCCBaOXoh/LYMl3onP.ijs.usVeSbGaSGE7FW','docente',1),(3,'Prueba1@uao.edu.co','$2b$10$RvFcD0AiX0eglSJteHxuJuwggUaPriU/y4TdIE/vt68RYMQiYt4Qa','docente',2),(4,'Prueba2@uao.edu.co','$2b$10$gbjATAw/MgW9vbjPNpKnyejrblCZk6JBaBSB.9O/9jREMwN7m4sBG','docente',1),(5,'Prueba3@uao.edu.co','$2b$10$NJNw8r99XYYbAHOCMce9yuREArAvrSjVB2b9VvIijV75kQh1u8mJ2','docente',2),(6,'Prueba4@uao.edu.co','$2b$10$HM7Hs88uS4LLUk.eu3jUuurbwONxNAsO0vrvqZBGvlqDoJNdRhAlS','secretaria',2);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `eliminacion_BD_lista_blanca` AFTER INSERT ON `usuario` FOR EACH ROW BEGIN
    DELETE FROM lista_blanca
    WHERE correo = NEW.correo;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'bd_proyecto'
--

--
-- Dumping routines for database 'bd_proyecto'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22 23:05:43
