const { Command } = require('commander');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const chalk = require('chalk');

const program = new Command();

program
    .command('upload <file>')
    .description('Upload a file')
    .action(async (file) => {
        try {
            const form = new FormData();
            form.append('file', fs.createReadStream(file));

            const response = await axios.post('http://localhost:3000/upload', form, {
                headers: form.getHeaders(),
            });
            console.log(chalk.green('File uploaded successfully!'));
            console.log(response.data);
        } catch (error) {
            console.error(chalk.red('Failed to upload file:'), error.message);
        }
    });

module.exports = program;
