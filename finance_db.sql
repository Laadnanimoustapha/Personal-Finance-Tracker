CREATE DATABASE finance_db;

USE finance_db;

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('income', 'expense'),
  category VARCHAR(100),
  amount DECIMAL(10, 2),
  date DATE,
  note TEXT
);
