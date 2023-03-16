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
    const sql = `SELECT id, name FROM departments`;
    connection.query(sql , (error, response ) => {
        if (error) throw error;
        console.table(response);
        userQuestions();
    });
};

//view all roles
const viewAllRoles = () => {
    const sql = `SELECT id, title, salary, departments_id FROM roles`;
    connection.query(sql , (error, response ) => {
        if (error) throw error;
        console.table(response);
        userQuestions();
    });
};

//view all employees
const viewAllEmployees = () => {
    const sql = `SELECT id, first_name, last_name, roles_id, manager_id FROM employees`;
    connection.query(sql , (error, response ) => {
        if (error) throw error;
        console.table(response);
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
      const sql = `INSERT INTO departments (name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.table(response);
        viewAllDepartments();
      });
    });
};

//add role
const addRole = () => {
    inquirer.prompt([
        {
            name: 'newRole',
            type: 'input',
            message: 'Please name the role you want to add?'  
        }
    ])
    .then((answer) => {
      const sql = `INSERT INTO roles (id, title, salary, departments_id) VALUES (?)`;
      connection.query(sql, answer.newRole, (error, response) => {
        if (error) throw error;
        console.table(response);
        viewAllDepartments();
      });
    });
    
};

  
  //add new employee
  const addNewEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is their first name?'
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
        connection.query(roleQuestions, (error, data) => {
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
                connection.query(managerInfo, (error, data) => {
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
                        const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)`;
                        connection.query(sql, newEmployee, (error) => {
                            if (error) throw error;
                            console.table(response);
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
    const sql = `SELECT employees.id, employees.first_name, roles.id AS roles_id FROM employees, roles, departments WHERE departments.id = roles.departments_id AND roles.id = employees.roles_id`;
    
    connection.query(sql, (error, response) => {
        if (error) throw error;
        const employeeNameQuestion =[];
        response.forEach((employees) => {employeeNameQuestion.push(`${employees.first_name} ${employees.last_name}`)});

        const sql = `SELECT roles.id roles.title FROM roles`;
        connection.query(sql, (error, response) => {
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
            let newTitleId, employeesId;

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
            
            const sqll = `UPDATE employees SET employees.roles_id = ? WHERE employees.id = ?`;
            connection.query(sqll, [newTitleId, employeesId], (error) => {
                if (error) throw error;
                console.table(response);
                userQuestions();
            })
        });
    }); 
};

//Bonus 

//update employee manager
const updateEmployeeManager = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager.manager_id FROM employees`;
    connection.query(sql, (error, response) => {
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
        let employeesId, managerId;
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
        console.table(response);
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
    const sql = `
        SELECT departments_id, departments.name AS department_name, SUM(salary) AS budget 
        FROM roles 
        INNER JOIN departments ON roles.departments_id = departments.id 
        GROUP by roles.departments_id
    `;

    connection.query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        userQuestions();
    });
};
