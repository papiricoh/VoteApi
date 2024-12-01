DROP DATABASE IF EXISTS vote_db;
CREATE DATABASE vote_db;
USE vote_db;


CREATE TABLE users(
    id int NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(30) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    perms INT NOT NULL DEFAULT 0,
    journalist BOOLEAN NOT NULL DEFAULT FALSE,


    PRIMARY KEY (id),
    UNIQUE (email),
    UNIQUE (username)
);

CREATE TABLE parties(
    id int NOT NULL AUTO_INCREMENT,
    label VARCHAR(6) NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    ideology int NOT NULL,
    color VARCHAR(255) NOT NULL,
    leader int,


    PRIMARY KEY (id),
    UNIQUE (label),
    UNIQUE (leader),
    FOREIGN KEY (leader) REFERENCES users(id)
);


CREATE TABLE users_parties(
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    party_id int NOT NULL,


    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (party_id) REFERENCES parties(id)
);

CREATE TABLE party_join_requests(
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    party_id int NOT NULL,
    status VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (party_id) REFERENCES parties(id)
);

CREATE TABLE laws(
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    party_id int NOT NULL,
    user_id int,
    law_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sign VARCHAR(255),

    PRIMARY KEY (id),
    FOREIGN KEY (party_id) REFERENCES parties(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (title)
);

CREATE TABLE articles(
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    law_id int NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (law_id) REFERENCES laws(id)
);

CREATE TABLE sessions(
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    type VARCHAR(255) NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_id int,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE government_members(
    id int NOT NULL AUTO_INCREMENT,
    role VARCHAR(255) NOT NULL,
    user_id int NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE news(
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE mails(
    id int NOT NULL AUTO_INCREMENT,
    sender_id int NOT NULL,
    receiver_id int NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    mail_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE rules(
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    value int NOT NULL,

    PRIMARY KEY (id)
);

INSERT INTO rules (name, value) VALUES ('Puntos a la semana', 20);
INSERT INTO rules (name, value) VALUES ('Infraccion menor', -10);
INSERT INTO rules (name, value) VALUES ('Intraccion mayor', -20);

INSERT INTO parties (label, name, logo, ideology, color) VALUES ('IND', 'Independiente', '', 0, '#6a6a6a');


-- Insertar la constitución en la tabla `laws`
INSERT INTO laws (title, description, status, party_id, sign) VALUES
('Constitución', 'Constitución de la Clase', 'signed', 1, 'La Gente de la Clase');


SET @law_id = LAST_INSERT_ID();

-- Insertar algunos artículos más desarrollados en la tabla `articles`
INSERT INTO articles (title, content, law_id) VALUES
('Artículo 1', 'El artículo 1 establece los derechos y libertades fundamentales de los ciudadanos, incluyendo la libertad de expresión, religión y reunión.', @law_id),
('Artículo 2', 'El artículo 2 define la estructura del gobierno, incluyendo el poder ejecutivo, legislativo y judicial, y sus respectivas funciones y responsabilidades.', @law_id),
('Artículo 3', 'El artículo 3 describe el proceso de enmienda de la constitución, permitiendo cambios y actualizaciones a través de un procedimiento legislativo específico.', @law_id);

