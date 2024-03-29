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
            if (selection ===  'view by department budget') {
                viewDepartmentBudget();
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
    const sql = `
        SELECT 
            r.id, 
            r.title, 
            d.name departments,
            r.salary
        FROM roles r
        JOIN departments d
        ON r.departments_id = d.id`;
    connection.query(sql , (error, response ) => {
        if (error) throw error;
        console.table(response);
        userQuestions();
    });
};

//view all employees
const viewAllEmployees = () => {
    const sql = `
        SELECT 
            e.id,
            e.first_name,
            e.last_name,
            r.title,
            d.name departments,
            r.salary, 
            CONCAT(e2.first_name, " ", e2.last_name) manager
        FROM employees e 
        JOIN roles r
        ON e.roles_id = r.id
        JOIN departments d 
        ON r.departments_id = d.id
        LEFT JOIN employees e2
        ON e.manager_id = e2.id`;
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
const addRole = async () => {

    let [departments] = await connection.promise().query('SELECT name, id value FROM departments');

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
            type: 'list',
            message: 'What is their department?',
            choices: departments
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
  const addNewEmployee = async () => {

    let [roles] = await connection.promise().query('SELECT title name, id value FROM roles');
    let [managers] = await connection.promise().query('SELECT CONCAT(first_name," ",last_name) name, id value FROM employees');
        managers.push({name:'Null',value:null});

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
            type: 'list',
            message: 'What is their role id?',
            choices: roles
        },
        {
            name: 'newEmployeeManager_id', 
            type: 'list',
            message: 'What is their managers id?',
            choices: managers
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
const updateEmployeeRole = async () => {
    let [employees] = await connection.promise().query('SELECT CONCAT(first_name," ",last_name) name, id value FROM employees');
    let [roles] = await connection.promise().query('SELECT title name, id value FROM roles');

    inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: 'who is the employee you want to update?',
            choices: employees
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'What is the new role?',
            choices: roles
        }
    ])
    .then(({id,role_id}) => {
        const sql = `UPDATE employees SET roles_id = ? WHERE id = ?`;
        connection.query(sql, [role_id,id], (error, response) => {
          if (error) throw error;
          console.table(response);
          viewAllEmployees();
        });
    });
   
};

//Bonus 

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
