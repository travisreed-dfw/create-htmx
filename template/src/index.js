const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

let counter = 0;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle /increment request
app.post('/increment', (req, res) => {
    counter += 1;
    res.send(`<div id="counter">${counter}</div>`);
});

// Handle /decrement request
app.post('/decrement', (req, res) => {
    counter -= 1;
    res.send(`<div id="counter">${counter}</div>`);
});

// Serve documentation link
app.get('/docs', (req, res) => {
    res.send(
        '<p>Check <a href="https://htmx.org/docs/">the docs</a> for more info!</p>'
    );
});

// Start the server and log the port
app.listen(PORT, () => {
    console.log(
        '\x1b[32m%s\x1b[34m%s\x1b[32m%s\x1b[0m',
        'Server is running on ',
        `http://localhost:${PORT}`,
        ''
    );
});
