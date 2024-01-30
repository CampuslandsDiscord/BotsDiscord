-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-01-2024 a las 14:03:56
-- Versión del servidor: 8.0.34
-- Versión de PHP: 8.1.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `discord_database`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `advertencias`
--

CREATE TABLE `advertencias` (
  `id` int NOT NULL,
  `contador` int DEFAULT '0',
  `usuario` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `advertencias`
--

INSERT INTO `advertencias` (`id`, `contador`, `usuario`) VALUES
(4, 3, 'owellandry'),
(5, 4, 'owellandry'),
(6, 8, 'owellandry');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `baneados`
--

CREATE TABLE `baneados` (
  `id` int NOT NULL,
  `contador` int DEFAULT '0',
  `usuario` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `baneados`
--

INSERT INTO `baneados` (`id`, `contador`, `usuario`) VALUES
(1, 8, 'owellandry'),
(2, 1, 'owellandry');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canales`
--

CREATE TABLE `canales` (
  `id` int NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `canales_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `canales`
--

INSERT INTO `canales` (`id`, `nombre`, `canales_id`) VALUES
(1, 'Canal-voz', 123456789123456780);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int NOT NULL,
  `categoria_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `categoria_name`) VALUES
(1, 'Trainers');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id` int NOT NULL,
  `fecha_hora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metodo` varchar(10) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `tipo_solicitud` varchar(10) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `parametros` text,
  `respuesta` text,
  `usuario_id` int DEFAULT NULL,
  `detalles_adicionales` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `logs`
--

INSERT INTO `logs` (`id`, `fecha_hora`, `metodo`, `ip`, `pais`, `tipo_solicitud`, `endpoint`, `parametros`, `respuesta`, `usuario_id`, `detalles_adicionales`) VALUES
(1, '2024-01-25 17:30:00', 'GET', '192.168.1.1', 'EjemploPais', 'HTTP', '/api/logs', '{\"param1\": \"valor1\", \"param2\": \"valor2\"}', '{\"status\": 200, \"message\": \"OK\"}', 1, 'Detalles adicionales de ejemplo'),
(2, '2024-01-24 22:28:34', 'POST', NULL, NULL, NULL, '/canales', NULL, NULL, NULL, 'Canal creado con ID: 1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `rol_id` varchar(255) DEFAULT NULL,
  `categoria_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `advertencias`
--
ALTER TABLE `advertencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `baneados`
--
ALTER TABLE `baneados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `canales`
--
ALTER TABLE `canales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `advertencias`
--
ALTER TABLE `advertencias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `baneados`
--
ALTER TABLE `baneados`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `canales`
--
ALTER TABLE `canales`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
