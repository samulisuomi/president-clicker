-- https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04

CREATE TABLE SCORE (
    HILLARY TEXT,
    TRUMP TEXT
);

INSERT INTO SCORE (HILLARY, TRUMP) VALUES ('0', '0');

CREATE TABLE SCORE_HISTORY (
    ID SERIAL,
    TIMESTAMP TIMESTAMP,
    HILLARY TEXT,
    TRUMP TEXT
);
