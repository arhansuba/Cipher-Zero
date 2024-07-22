const { Command } = require('commander');
const axios = require('axios');
const chalk = require('chalk');

const program = new Command();

program
    .command('transfer <fileId> <toAddress>')
    .description('Transfer a file to another address')
    .action(async (fileId, toAddress) => {
        try {
            const response = await axios.post('http://localhost:3000/transfer', { fileId, toAddress });
            console.log(chalk.green('File transferred successfully!'));
            console.log(response.data);
        } catch (error) {
            console.error(chalk.red('Failed to transfer file:'), error.message);
        }
    });

module.exports = program;
