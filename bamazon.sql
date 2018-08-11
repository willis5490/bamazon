DROP DATABASE IF EXISTS bamazon_bd;
CREATE DATABASE bamazon_bd;

USE bamazon_bd;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(100) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price INT default 0,
  quantity_available INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, quantity_available)
VALUES ("K2 Roller Blades", "Sporting Goods", 60.99, 20), ("Burton Snowboards", "Sporting Goods", 249.99, 10), 
("Kimmel Kitchen Set", "Kitchen", 120.50, 8),("Acer Computer", "Technology", 600.65, 5),
("Toy Cars", "Toys", 13.89, 30), ("Vortex V5 Fan", "Home Accessories", 54.50, 24), 
("Makers Coffee Maker", "Kitchen", 31.99, 4), ("Dove Bar Soap", "Bathroom Accessories", 6.89, 57),
("Bleach Toilet Cleaner", "Bathroom Accessories", 6.45, 79), ("Logic Bluetooth Headset", "Technology", 75.75, 21), 
("Oral-B Spinbrush", "Bathroom Accessories", 89.99, 11);