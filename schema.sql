CREATE DATABASE lunch;
USE lunch;


CREATE TABLE person (
    PRIMARY KEY(person_id),
  person_id INT AUTO_INCREMENT,
  first_name VARCHAR(40),
  last_name VARCHAR(40),
  last_order DATETIME
) CHARSET=utf8;

CREATE TABLE order_location (
  PRIMARY KEY(loc_id),
  loc_id INT AUTO_INCREMENT,
  tradestyle VARCHAR(80),
  menu_link VARCHAR(250),
  order_fee DOUBLE,
  min_order DOUBLE,
  min_tip DOUBLE,
  max_radius INT,
  addr1 VARCHAR(80),
  addr2 VARCHAR(80),
  city VARCHAR(40),
  state CHAR(2),
  zip INT(5)
) CHARSET=utf8;

CREATE TABLE loc_menu (
        PRIMARY KEY(menu_id),
  menu_id INT AUTO_INCREMENT,
  location INT,
  heading VARCHAR(40),
  description VARCHAR(250),
  img VARCHAR(150),
  price DOUBLE,
  max INT
) CHARSET=utf8;

/* CREATE TABLE menu_combo (
        PRIMARY KEY(combo_id),
  combo_id INT AUTO_INCREMENT,
  price DOUBLE
) CHARSET=utf8;

CREATE TABLE menu_combo_item (
        PRIMARY KEY(combo_item_id),
  combo_item_id INT AUTO_INCREMENT,
) CHARSET=utf8; */

CREATE TABLE order_control (
  PRIMARY KEY(week),
  week INT,
  location INT,

  FOREIGN KEY(location)
    REFERENCES order_location(loc_id)
) CHARSET=utf8;

CREATE TABLE order_item (
  PRIMARY KEY(item_id),
  item_id INT AUTO_INCREMENT,
  person INT,
  order_period INT,
  description VARCHAR(250),
  amount DOUBLE,
  menu_item INT,

  FOREIGN KEY(order_period)
    REFERENCES order_control(week),

  FOREIGN KEY(person)
    REFERENCES person(person_id),

  FOREIGN KEY(menu_item)
        REFERENCES loc_menu(menu_id)
) CHARSET=utf8;


INSERT INTO order_location (tradestyle, order_fee, min_order, min_tip, menu_link) VALUES ('Jade Dragon', 1.00, 20.00, 0.25, 'http://jadedragonoh.com');