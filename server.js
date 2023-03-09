const connection = require('./config/connection');
const inquirer = require('inquirer');

connection.connect((error) => {
    if (error) throw error;
    userQuestions();
});

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
                'complete and leave'
            ] 
        }
    ])
    .then((answers) =>{
        const {selection} = answers;

            if (selection === 'view all departments') {

            }
            if (selection === 'view all roles') {
                
            }
            if (selection === 'view all employees') {
                
            }
            if (selection === 'add a department') {
                
            }
            if (selection === 'add a role') {
                
            }
            if (selection === 'add an employee') {
                
            }
            if (selection ===  'update an employee role') {
                
            }
            if (selection === 'complete and leave') {
                connection.end();
            }
    });
};

//view all departments
const viewAllDepartments = () => {
    const sql = `SELECT department.id AS id, department_name AS department FROM department`;
    connection.promise().query(sql ,(error, response ) => {
        if (error) throw error;
        userQuestions();
    });
};

// TODO: add inner join
const viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name AS department FROM role`;
    connection.promise().query(sql ,(error, response ) => {
        if (error) throw error;
        userQuestions();
    });
};

const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS 'department', role.salary FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id ORDER BY employee.id ASC`;
    connection.promise().query(sql ,(error, response ) => {
        if (error) throw error;
        userQuestions();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'Please name the department you want to add?'  
        }
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        viewAllDepartments();
      });
    });
};
