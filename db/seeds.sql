INSERT INTO departments (name)
VALUES ("Owner"),
       ("Sales"),
       ("Processing"),
       ("Assistant"),
       ("Realtor");

INSERT INTO roles (title, salary, departments_id)
VALUES ("CEO", 500000, 1),
       ("Loan Officer", 200000, 2),
       ("Processor", 100000, 3),
       ("Loan Officer Assistant", 75000, 4),
       ("Agent", 150000, 5);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Nate", "Raich", 1, NULL),
       ("Mike", "Arvold", 2, 1),
       ("Cari", "Martin", 3, 1),
       ("Riley", "Altenburg", 4, 2),
       ("Tyler", "Miller", 5, NULL);
