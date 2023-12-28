CREATE TABLE Room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    surface INT NOT NULL,
    image MEDIUMBLOB NOT NULL,
    orientation VARCHAR(100) NOT NULL,
    nightly_price INT NOT NULL
);
CREATE TABLE User (
    name VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    role VARCHAR(10) NOT NULL,
    password VARCHAR(60) NOT NULL,
    username VARCHAR(100) NOT NULL PRIMARY KEY
);
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    room_id INT NOT NULL,
    reservation_date DATE
);