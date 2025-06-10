CREATE DATABASE  IF NOT EXISTS `agroquimicodb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `agroquimicodb`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: agroquimicodb
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Insectisidas'),(2,'Fertilizantes'),(4,'Herbicidas');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleventa`
--

DROP TABLE IF EXISTS `detalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleventa` (
  `idVenta` int NOT NULL,
  `idProducto` smallint NOT NULL,
  `cantidad` smallint NOT NULL,
  `precioUnitario` double(18,2) NOT NULL,
  PRIMARY KEY (`idVenta`,`idProducto`),
  KEY `fk_DetalleVenta_Venta1_idx` (`idVenta`),
  KEY `fk_DetalleVenta_Producto1_idx` (`idProducto`),
  CONSTRAINT `fk_DetalleVenta_Producto1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`id`),
  CONSTRAINT `fk_DetalleVenta_Venta1` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventa`
--

LOCK TABLES `detalleventa` WRITE;
/*!40000 ALTER TABLE `detalleventa` DISABLE KEYS */;
INSERT INTO `detalleventa` VALUES (5,6,3,49.99),(5,7,2,29.50),(6,6,10,49.99),(6,8,5,19.90),(6,9,10,39.99),(7,9,1,39.99),(8,9,1,39.99),(9,7,1,29.50),(10,6,100,49.99),(10,8,100,19.90);
/*!40000 ALTER TABLE `detalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `precio` decimal(18,2) NOT NULL,
  `descripcion` text NOT NULL,
  `stock` smallint NOT NULL,
  `unidadDeMedida` varchar(45) NOT NULL,
  `imagen` varchar(45) DEFAULT NULL,
  `Categoria_id` tinyint NOT NULL,
  `estado` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Producto_Categoria_idx` (`Categoria_id`),
  CONSTRAINT `fk_Producto_Categoria` FOREIGN KEY (`Categoria_id`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (6,'Fertilizante Mágico',49.99,'Hace crecer tus plantitas más rápido que un rayo uwu~',100,'Litros','a',2,1),(7,'Insecticida Arcoíris',29.50,'Elimina plagas con una lluvia de color y ternura nwn',80,'Mililitros','insecticida-arcoiris.png',2,1),(8,'Abono de Estrellas',19.90,'Hecho con polvo de estrellas para un jardín galáctico',120,'Kilos','abono-estrellas.png',1,1),(9,'Repelente Lunar',39.99,'Mantén a los bichitos lejos con energía lunar owo',60,'Mililitros','repelente-lunar.png',2,1),(10,'Tierra de Hadas',25.00,'Tierra mágica que rejuvenece raíces y corazones',90,'Litros','tierra-hadas.png',1,1),(11,'Gramoxones',56.00,'Para hierbas',56,'1 Kg','',1,0),(12,'Galletas',1.00,'Son galletas',20,'Unidades','',1,0);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `primerApellido` varchar(45) NOT NULL,
  `segundoApellido` varchar(45) DEFAULT NULL,
  `correo` varchar(45) NOT NULL,
  `rol` varchar(45) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `imagen` varchar(45) DEFAULT NULL,
  `estado` tinyint NOT NULL,
  `contraseña` varchar(70) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo_UNIQUE` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Teresa','Sanizo','Guzman','teresa@gmail.com','vendedor','79984810','',1,'$2b$10$liGaN5NFrGbDrFAA7fd9t.sD8L6IkgJJsHRpj/ZMj6Jxx2Wykpwua'),(2,'Zamallita Actualizada','Uwucito','Programitas','admin@uwu.com','superadmin','99999999',NULL,0,'$2b$10$pvR/qlWVyg99EhPKdppPGutkhW9z8F89d6Obytvada8I0mAdh6y3y'),(3,'Carla','Camacho','Sanizo','carla@gmail.com','Admin','65303501',NULL,1,'$2b$10$tdyEu9fPzGMzFOJt4fH3suaTTPWsZv/M2YctQv39HjPhQzuCnnw/e'),(4,'Carla','Camacho','Sanizo','carla2@gmail.com','admin','65303501','',1,'admin'),(5,'mateo','perez','rocha','mateo@gmail.com','usuario','66787876','',0,'$2b$10$IueysPd9y6G9MNoLGcDhVutpRfnAAa5kweW1DoklSE1OFFU5DuHQ6'),(15,'mateo','perez','rocha','mateo2@gmail.com','Admin','66787876','',1,'$2b$10$dLKv4xkpvuE7uvh4OK6MFebc19F1X4F03CRx4U1OUck4oi5xvhxz6'),(16,'luis','perez','rocha','luis@gmail.com','Admin','79984810','',1,'$2b$10$OS0ATbBHDmy1thz7RD3TLOKHUsPhBDi.H/63kl6zg95VSi.Ny0haS');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaVenta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` tinyint NOT NULL,
  `idVendedor` smallint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Venta_Usuario1_idx` (`idVendedor`),
  CONSTRAINT `fk_Venta_Usuario1` FOREIGN KEY (`idVendedor`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES (1,'2025-06-04 16:18:55',1,1),(2,'2025-06-04 16:23:12',1,1),(5,'2025-06-04 16:28:56',1,1),(6,'2025-06-08 13:47:15',1,1),(7,'2025-06-08 15:23:18',1,3),(8,'2025-06-08 16:12:43',1,3),(9,'2025-06-08 16:13:03',0,3),(10,'2025-06-09 17:16:34',1,3);
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-10 13:02:48
