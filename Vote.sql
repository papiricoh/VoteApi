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
    user_id int NOT NULL,
    law_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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

CREATE TABLE votes(
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    law_id int NOT NULL,
    vote VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (law_id) REFERENCES laws(id)
);

CREATE TABLE government_members(
    id int NOT NULL AUTO_INCREMENT,
    role VARCHAR(255) NOT NULL,
    user_id int NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


INSERT INTO parties (label, name, logo, ideology, color) VALUES ('IND', 'Independiente', '', 0, '#6a6a6a');