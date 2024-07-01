CREATE DATABASE Impre_Avila;
USE myapp;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    es_administrador BOOLEAN NOT NULL DEFAULT false
);
