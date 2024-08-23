const { Command } = require('commander');
const axios = require('axios');
const chalk = require('chalk');

const program = new Command();

program
    .command('register <username> <password>')
    .description('Register a new user')
    .action(async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/register', { username, password });
            console.log(chalk.green('User registered successfully!'));
            console.log(response.data);
        } catch (error) {
            console.error(chalk.red('Failed to register user:'), error.message);
        }
    });

module.exports = program;
