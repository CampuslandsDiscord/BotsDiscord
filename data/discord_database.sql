-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-02-2024 a las 16:18:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
-- Estructura de tabla para la tabla `banned`
--

CREATE TABLE `banned` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `reason` varchar(250) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `roll_id` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `banned_roll`
--

CREATE TABLE `banned_roll` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `roll_id` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `channels`
--

CREATE TABLE `channels` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `cycle_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `channel_text`
--

CREATE TABLE `channel_text` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `voice_text` varchar(250) NOT NULL,
  `channel_id` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `channel_voice`
--

CREATE TABLE `channel_voice` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `voice_one` varchar(250) NOT NULL,
  `voice_two` varchar(250) NOT NULL,
  `channel_id` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cycle`
--

CREATE TABLE `cycle` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolls`
--

CREATE TABLE `rolls` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `student_roll`
--

CREATE TABLE `student_roll` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `roll_id` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `cycle_id` int(11) DEFAULT NULL,
  `banned_id` int(11) DEFAULT NULL,
  `warning_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warning`
--

CREATE TABLE `warning` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `reason` varchar(250) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message_count` int(10) DEFAULT NULL,
  `roll_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `banned`
--
ALTER TABLE `banned`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roll_id` (`roll_id`);

--
-- Indices de la tabla `banned_roll`
--
ALTER TABLE `banned_roll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roll_id` (`roll_id`);

--
-- Indices de la tabla `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cycle_id` (`cycle_id`);

--
-- Indices de la tabla `channel_text`
--
ALTER TABLE `channel_text`
  ADD PRIMARY KEY (`id`),
  ADD KEY `channel_id` (`channel_id`);

--
-- Indices de la tabla `channel_voice`
--
ALTER TABLE `channel_voice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `channel_id` (`channel_id`);

--
-- Indices de la tabla `cycle`
--
ALTER TABLE `cycle`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rolls`
--
ALTER TABLE `rolls`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `student_roll`
--
ALTER TABLE `student_roll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roll_id` (`roll_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cycle_id` (`cycle_id`),
  ADD KEY `roll_id` (`banned_id`),
  ADD KEY `warning_id` (`warning_id`);

--
-- Indices de la tabla `warning`
--
ALTER TABLE `warning`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roll_id` (`roll_id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `banned_roll`
--
ALTER TABLE `banned_roll`
  ADD CONSTRAINT `banned_roll_ibfk_1` FOREIGN KEY (`roll_id`) REFERENCES `rolls` (`id`);

--
-- Filtros para la tabla `channels`
--
ALTER TABLE `channels`
  ADD CONSTRAINT `channels_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `cycle` (`id`);

--
-- Filtros para la tabla `channel_text`
--
ALTER TABLE `channel_text`
  ADD CONSTRAINT `channel_text_ibfk_1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

--
-- Filtros para la tabla `channel_voice`
--
ALTER TABLE `channel_voice`
  ADD CONSTRAINT `channel_voice_ibfk_1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`);

--
-- Filtros para la tabla `rolls`
--
ALTER TABLE `rolls`
  ADD CONSTRAINT `rolls_ibfk_1` FOREIGN KEY (`id`) REFERENCES `cycle` (`id`);

--
-- Filtros para la tabla `student_roll`
--
ALTER TABLE `student_roll`
  ADD CONSTRAINT `student_roll_ibfk_1` FOREIGN KEY (`roll_id`) REFERENCES `rolls` (`id`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `cycle` (`id`),
  ADD CONSTRAINT `user_ibfk_4` FOREIGN KEY (`banned_id`) REFERENCES `banned` (`id`);

--
-- Filtros para la tabla `warning`
--
ALTER TABLE `warning`
  ADD CONSTRAINT `warning_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`warning_id`) ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
