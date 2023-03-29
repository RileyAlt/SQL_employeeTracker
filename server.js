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
    viewAllDepartments();
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
    viewAllRoles();
    inquirer.prompt([
        {
            name: 'newRoleTitle',
            type: 'input',
            message: 'Please name the role you want to add?'  
        },
        {
            name: 'newRoleSalary',
            type: 'input',
            message: 'what is their salary?'  
        },
        {
            name: 'newRoleDepartment_id',
            type: 'input',
            message: 'What is their department id?'  
        },
    ])
    .then((answer) => {
      const sql = `INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)`;
      connection.query(sql, [answer.newRoleTitle, answer.newRoleSalary, answer.newRoleDepartment_id], (error, response) => {
        if (error) throw error;
        console.table(response);
        viewAllRoles();
      });
    });
    
};

  
  //add new employee
  const addNewEmployee = () => {
    viewAllEmployees();
    inquirer.prompt([
        {
            name: 'newEmployeeFirstName',
            type: 'input',
            message: 'What is their first name?'
        },
        {
            name: 'newEmployeeLastName', 
            type: 'input',
            message: 'What is their last Name?',
        },
        {
            name: 'newEmployeeRole_id',
            type: 'input',
            message: 'What is their role id?'
        },
        {
            name: 'newEmployeeManager_id', 
            type: 'input',
            message: 'What is their managers id?',
        }
    ])
    .then((answer) => {
        const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)`;
        connection.query(sql, [answer.newEmployeeFirstName, answer.newEmployeeLastName, answer.newEmployeeRole_id, answer.newEmployeeManager_id], (error, response) => {
          if (error) throw error;
          console.table(response);
          viewAllEmployees();
        });
    });
};

//update employee role 
const updateEmployeeRole = () => {
    viewAllRoles();
    inquirer.prompt([
        {
            name: 'updateEmployeeRoleId',
            type: 'input',
            message: 'what is the employee id you want to update?',

        },
    ])
    .then((answer) => {
        const sql = `UPDATE employees SET role_id = '' WHERE VALUES(?)`;
        connection.query(sql, [answer.updateEmployeeRoleId], (error, response) => {
          if (error) throw error;
          console.table(response);
          viewAllRoles();
        });
    });
   
};

//Bonus 

//update employee manager
const updateEmployeeManager = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.roles_id employees.manager.manager_id FROM employees`;
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
