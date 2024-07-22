const { Command } = require('commander');
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

const program = new Command();

program
    .command('download <fileId>')
    .description('Download a file')
    .action(async (fileId) => {
        try {
            const response = await axios.get(`http://localhost:3000/download/${fileId}`, {
                responseType: 'stream',
            });

            const filePath = `./downloads/${fileId}`;
            response.data.pipe(fs.createWriteStream(filePath));

            response.data.on('end', () => {
                console.log(chalk.green('File downloaded successfully!'));
            });
        } catch (error) {
            console.error(chalk.red('Failed to download file:'), error.message);
        }
    });

module.exports = program;
