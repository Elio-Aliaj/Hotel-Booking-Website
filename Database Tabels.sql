CREATE TABLE
    `user` (
        `name` varchar(50) NOT NULL,
        `last` varchar(50) NOT NULL,
        `role` varchar(10) NOT NULL,
        `password` varchar(60) NOT NULL,
        `username` varchar(100) NOT NULL,
        PRIMARY KEY (`username`)
    );

CREATE TABLE
    `room` (
        `room_id` int NOT NULL AUTO_INCREMENT,
        `surface` int NOT NULL,
        `image` longtext,
        `orientation` varchar(100) NOT NULL,
        `nightly_price` int NOT NULL,
        PRIMARY KEY (`room_id`)
    );

CREATE TABLE
    `booking` (
        `username` varchar(100) NOT NULL,
        `room_id` int NOT NULL,
        `reservation_date` date NOT NULL,
        `booking_id` int NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (`booking_id`),
        KEY `fk_room_id` (`room_id`)
    );

INSERT INTO
    user (name, last, role, password, username)
VALUES
    (
        'admin',
        'admin',
        'admin',
        '$2b$10$neFaBIIpVfPijWst8aga0.mrKdId2aUnkpBfMcHDr.GpzMFdIXx8W',
        'admin'
    );