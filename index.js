const express = require('express');
const app = express();

// Body Parser 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kurs', { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log('Database Connected');
});

// Loading Router
const main = require('./routes/kurs');

// Using Router
app.use('/api', main);



// Setting up Server
const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Server Connected at ${port}`);
})

module.exports = app;  // For Testing Purpose