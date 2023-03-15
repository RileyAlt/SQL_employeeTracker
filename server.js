const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Start up
connection.connect((error) => {
    if (error) throw error;
    userQuestions();
});
//Questions
const userQuestions = () => {
    inquirer.prompt([
        {
            name: 'selection',
            type: 'list', 
            message: 'Please select the best option:',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role', 
                'add an employee',
                'update an employee role',
                'update an employee manager',
                'view by department budget',
                'complete and leave'
            ] 
        }
    ])
    .then((answers) =>{
        const {selection} = answers;

            if (selection === 'view all departments') {
                viewAllDepartments();
            }
            if (selection === 'view all roles') {
                viewAllRoles();
            }
            if (selection === 'view all employees') {
                viewAllEmployees();
            }
            if (selection === 'add a department') {
                addDepartment(); 
            }
            if (selection === 'add a role') {
                addRole();
            }
            if (selection === 'add an employee') {
                addNewEmployee();
            }
            if (selection ===  'update an employee role') {
                updateEmployeeRole();
            }
            if (selection ===  'update an employee manager') {
                updateEmployeeManager();
            }
            if (selection ===  'view employee by manager') {
                updateEmployeeManager();
            }
            if (selection === 'complete and leave') {
                connection.end();
            }
    });
};

//view all departments
const viewAllDepartments = () => {
    const sql = `SELECT departments.id AS id, department_name AS departments FROM departments`;
    connection.promise().query(sql , (error, response ) => {
        if (error) throw error;
        userQuestions();
    });
};

//view all roles
const viewAllRoles = () => {
    const sql = `SELECT roles.title, roles.id, departments.department_name AS departments, roles.salary`;
    connection.promise().query(sql , (error, response ) => {
        if (error) throw error;
        userQuestions();
    });
};

//view all employees
const viewAllEmployees = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS 'departments', roles.salary FROM employees, departments WHERE departments.id = roles.department_id AND roles.id = employees.roles_id ORDER BY employees.id ASC`;
    connection.promise().query(sql , (error, response ) => {
        if (error) throw error;
        userQuestions();
    });
};

//add department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'Please name the department you want to add?'  
        }
    ])
    .then((answer) => {
      const sql = `INSERT INTO departments (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        viewAllDepartments();
      });
    });
};

//add role
const addRole = () => {
    const sql = 'SELECT * FROM departments'
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        const departmentOptions = [];
        response.forEach((departmentOptions) => { departmentOptions.push(department_name)});
        departmentOptions.push('Department Choice')
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'What department is the new role for?',
                choices: departmentOptions
            }
        ])
        .then((answer) => {
            if (answer.departmentName === 'Department Choice') {
                this.addDepartment();
            } else {
                addNewRole(answer);
            }
        });
  
        const addNewRole = (departmentInfo) => {
            inquirer.prompt([
                {
                    name: 'newRole',
                    type: 'input',
                    message: 'What is the new role?',
                },
                {
                    name: 'salary', 
                    type: 'input',
                    message: 'What is the salary?',
                }
            ])
            .then((answer) => {
                const createRole = answer.newRole;
                let departmentId;

                response.forEach((department) => {
                    if (departmentInfo.departmentName === departments.department_name) {departmentId = departments.id;}
                });

                const sql = `INSERT INTO roles (title, salary, department_id) VAUES (?, ?, ?)`;
                const newRoleAdded = [createRole, answer.salary, departmentId];

                connection.promise().query(sql, newRoleAdded, (error) => {
                    if (error) throw error;
                    viewAllRoles();
                });
            });
  
        };
  
    });
  };

  
  //add new employee
  const addNewEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is their new role?'
        },
        {
            name: 'lastName', 
            type: 'input',
            message: 'What is their last Name?',
        }
    ])
    .then(answer => {
        const newEmployee = [answer.firstName, answer.lastName]
        const roleQuestions = `SELECT roles.id, roles.title FROM roles`;
        connection.promise().query(roleQuestions, (error, data) => {
            if (error) throw error;
            const roles = data.map(({ id, title }) => ({ name: title, value: id}));
            inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the new employee role?',
                    choices: roles
                }
            ])
            .then(roleSelection => {
                const role = roleSelection.role;
                newEmployee.push(role);

                const managerInfo = `SELECT * FROM employees`;
                connection.promise().query(managerInfo, (error, data) => {
                    if (error) throw error;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + last_name, value: id}));
                    inquirer.prompt([ 
                        {
                            name: 'manager',
                            type: 'list',
                            message: 'What is their manager?',
                            choices: managers 
                        }
                    ])
                    .then(managerSelection => {
                        const manager = managerSelection.manager;
                        newEmployee.push(manager);
                        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                        connection.query(sql, newEmployee, (error) => {
                            if (error) throw error;
                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
};

//update employee role 
const updateEmployeeRole = () => {
    const sql = `SELECT employees.id, employees.first_name, roles.id AS "role_id FROM employees, roles, departments WHERE departments.id = roles.department_id AND roles.id = employee.role_id`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        const employeeNameQuestion =[];
        response.forEach((employees) => {employeeNameQuestion.push(`${employees.first_name} ${employees.last_name}`)});

        const sql = `SELECT roles.id roles.title FROM roles`;
        connection.promise().query(sql, (error, response) => {
            if (error) throw error
            const employeeRoleQuestion = [];
            response.forEach((roles) => employeeRoleQuestion.push(roles.title))
        });
        
        inquirer.prompt([
            {
                name: 'selectedEmployee',
                type: 'list',
                message: 'What Employee is getting a new role?'
            },
            {
                name: 'selectedRole',
                type: 'list',
                message: 'What is the new role?'
            }
        ])
        .then((answer) => {
            let newTitleId, employeeId;

            response.forEach((employees) => {
                if (
                    answer.selectedEmployee === `${employees.first_name} ${employees.last_name}`
                ){
                    employeeId = employees.id;
                }
            });

            response.forEach((roles) => {
                if (
                    answer.selectdRole === roles.title
                ){
                    newTitleId = roles.id;
                }
            });
            
            const sqll = `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
            connection.query(sqll, [newTitleId, employeeId], (error) => {
                if (error) throw error;
                userQuestions();
            })
        });
    }); 
};

//Bonus 

//update employee manager
const updateEmployeeManager = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager.manager_id FROM employees`;
    connection.promise(). query(sql, (error, response) => {
        const employeeNameQuestion = [];
        response.forEach((employees) => {employeeNamQuestion.push(`${employees.first_name} ${employees.last_name}`)})
    });

    inquirer.prompt([
        {
            name: 'selectedEmployee',
            type: 'list',
            message: 'What Employee is getting a new manager?',
            choices: employeeNameQuestion
        },
        {
            name: 'newManager',
            type: 'list',
            message: 'What is the new role?',
            choices: employeeNameQuestion
        }
    ])
    .then((answer) => {
        let employeeId, managerId;
        response.forEach((employees) =>{
            if (
                answer.seletedEmployee === `${employees.first_name} ${employees.last_name}`
            ) {
                employeeid = employees.id;
            }
            if (
                answer.newManager === `${employees.first_name} ${employees.last_name}`
            ){
                managerId = employees.id;
            }
        });

        const sql = `UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?`;
        connection.query(sql, [employeeId, managerId], (error) => {
        if (error) throw error;
        userQuestions();
        });
    });
};

//view employee by manager 

//view employee by department

//delete departments

//delete roles 

//delete employees

//view by department budget 

const viewDepartmentBudget = () => {
    const sql = `SELECT departments_id AS id, departments.department_name AS departments, SUMsalary) AS budget FROM roles INNER JOIN departments ON roles.departments.id GROUP by roles.department_id`;

    connection.query(sql, (error, response) => {
        if (error) throw error;
        userQuestions();
    });
};
