DROP DATABASE IF EXISTS chillguys;

CREATE DATABASE chillguys;

USE chillguys;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Informations communes pour tous les utilisateurs
    username VARCHAR(255) UNIQUE NOT NULL,              -- Pseudo obligatoire pour tous les utilisateurs
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,       -- Date de création de l'utilisateur
    lastConnexion DATETIME DEFAULT CURRENT_TIMESTAMP,   -- Dernière connexion (utile pour les invités)

    -- Informations uniquement pour les inscrits
    email VARCHAR(255),
    password VARCHAR(255),
    firstName VARCHAR(60),
    lastName VARCHAR(50),
    phoneNumber VARCHAR(20),
    birthday DATE,
    gender BOOLEAN,
    address VARCHAR(255),
    zipCode VARCHAR(20),
    country VARCHAR(50),
    city VARCHAR(50)
);

-- Table des canaux
CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Attributs des canaux
    channelName VARCHAR(255) UNIQUE NOT NULL,           -- Nom unique du canal
    isPrivate BOOLEAN DEFAULT 0 NOT NULL                -- Indique si le canal est privé
);

-- Table des messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Attributs du message
    content TEXT NOT NULL,                              -- Contenu du message
    messageTime DATETIME DEFAULT CURRENT_TIMESTAMP,     -- Heure du message
    senderID INT,                                       -- ID de l'expéditeur
    channelID INT,                                      -- ID du canal
    receiverID INT,                                     -- ID du destinataire (uniquement pour messages privés)

    -- Clés étrangères
    FOREIGN KEY (senderID) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiverID) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (channelID) REFERENCES channels(id) ON DELETE CASCADE
);

-- Table relationnelle pour les membres des canaux
CREATE TABLE channel_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,                                         -- ID de l'utilisateur
    channelID INT,                                      -- ID du canal
    joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,        -- Date d'entrée dans le canal

    -- Clés étrangères
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (channelID) REFERENCES channels(id) ON DELETE CASCADE
);

-- Insertion test
INSERT INTO users (username, password, firstName, lastName, phoneNumber, birthday, gender, adxxdress, zipCode, country, city) VALUES ('test', 'root', 'axel', 'theule', '0612345678', '2000-01-01', 1, '1 rue du test', '34000', 'france', 'montpellier');