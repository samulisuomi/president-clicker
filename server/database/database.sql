-- https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04

CREATE DATABASE presidentclicker;

\connect presidentclicker;

CREATE TABLE SCORE (
    TRUMP TEXT,
    HILLARY TEXT
);

INSERT INTO SCORE (HILLARY, TRUMP) VALUES ('0', '0');

CREATE TABLE SCORE_HISTORY (
    ID SERIAL,
    TIMESTAMP TIMESTAMP,
    HILLARY TEXT,
    TRUMP TEXT,
    SOCKETS_SOCKETS_LENGTH VARCHAR(69),
    SOCKETS_CONNECTED_LENGTH VARCHAR(69)
);
