DROP DATABASE IF EXISTS chillguys;

CREATE DATABASE chillguys;

USE chillguys;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- informations communes pour tous les utilisateurs
    username VARCHAR(255) UNIQUE NOT NULL,              -- pseudo, obligatoire pour tout les utilisateurs de l'application
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,       -- Date de création de l'utilisateur
    lastConnexion DATETIME DEFAULT CURRENT_TIMESTAMP,   -- Date de la dernière connexion utile pour supprimer les non inscrits qui n'utilisent plus l'application
    
    -- informations uniquement réservées aux inscrits
    password VARCHAR(255),
    firstName VARCHAR(60),
    lastName VARCHAR(50),
    phoneNumber VARCHAR(20),
    birthday DATE,
    gender BOOLEAN,
    address VARCHAR(255),
    zipCode VARCHAR(20),
    country VARCHAR(50),
    city VARCHAR(50)xx
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- attributs du message
    content TEXT NOT NULL,                              -- Contenu du message
    messageTime DATETIME DEFAULT CURRENT_TIMESTAMP,     -- Heure du message
    senderID INT,                                       -- ID de l'expediteur
    channelID INT,                                      -- ID du channel
    receiverID INT,                                     -- ID du destinataire

    -- clés étrangères
    FOREIGN KEY (senderID) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (recipientID) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (channelID) REFERENCES channels(id) ON DELETE CASCADE
);

CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- attributs des channels
    channelName VARCHAR(255) UNIQUE NOT NULL,   -- nom du channel
    isPrivate BOOLEAN DEFAULT 0 NOT NULL        -- attribut privé du channel
);

-- table relationnelle
CREATE TABLE channel_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    channelID INT,
    joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- clés étrangères
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (channelID) REFERENCES channels(id) ON DELETE CASCADE
);
