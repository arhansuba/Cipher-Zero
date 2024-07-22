const { Command } = require('commander');
const program = new Command();

// Import command files
const registerCommand = require('./commands/register');
const authCommand = require('./commands/auth');
const uploadCommand = require('./commands/upload');
const downloadCommand = require('./commands/download');
const transferCommand = require('./commands/transfer');
const stakeCommand = require('./commands/stake');

// Register commands
program
    .version('1.0.0')
    .description('BitTheta Secure CLI');

// Define commands
program.addCommand(registerCommand);
program.addCommand(authCommand);
program.addCommand(uploadCommand);
program.addCommand(downloadCommand);
program.addCommand(transferCommand);
program.addCommand(stakeCommand);

// Parse CLI arguments
program.parse(process.argv);
