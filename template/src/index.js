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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
