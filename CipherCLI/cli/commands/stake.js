const { Command } = require('commander');
const axios = require('axios');
const chalk = require('chalk');

const program = new Command();

program
    .command('stake <amount>')
    .description('Stake a certain amount')
    .action(async (amount) => {
        try {
            const response = await axios.post('http://localhost:3000/stake', { amount });
            console.log(chalk.green('Staked successfully!'));
            console.log(response.data);
        } catch (error) {
            console.error(chalk.red('Failed to stake:'), error.message);
        }
    });

module.exports = program;
