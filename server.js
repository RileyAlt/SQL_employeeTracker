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
                'complete and leave'
            ] 
        }
    ])
}
