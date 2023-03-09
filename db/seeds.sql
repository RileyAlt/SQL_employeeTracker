INSERT INTO departments (name)
VALUES ("Owner"),
       ("Sales"),
       ("Processing"),
       ("Assistant"),
       ("Realtor");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", "500,000", 1),
       ("Loan Officer", "200,000", 2),
       ("Processor", "100,000", 3),
       ("Loan Officer Assistant", "75,000", 4),
       ("Agent", "150,000", 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Nate", "Raich", 1, NULL),
       ("Mike", "Arvold", 2, 1),
       ("Cari", "Martin", 3, 1),
       ("Riley", "Altenburg", 4, 2),
       ("Tyler", "Miller", 5, NULL);