// start-tunnel.js
require('dotenv').config();
const { exec } = require('child_process');

// Access the domain from your .env file
const domain = process.env.DOMAIN; // Ensure .env has a DOMAIN variable

// Run the command with the domain from .env
exec(`start cmd /K ngrok http --domain=${domain} 4000`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Stdout: ${stdout}`);
});
