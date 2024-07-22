const { Command } = require('commander');
const axios = require('axios');
const chalk = require('chalk');

const program = new Command();

program
    .command('auth <username> <password>')
    .description('Authenticate a user')
    .action(async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/auth', { username, password });
            console.log(chalk.green('User authenticated successfully!'));
            console.log(response.data);
        } catch (error) {
            console.error(chalk.red('Failed to authenticate user:'), error.message);
        }
    });

module.exports = program;
