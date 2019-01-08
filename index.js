const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const nodemailer = require('nodemailer');

// Connect to Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' +config.database);
});

// on Error
mongoose.connection.on('error', (err) => {
    console.log('Database Error' +err);
});

console.log(mongoose.connection.readyState);

const app = express();

const users = require('./routes/users');

//PORT
const port = process.env.PORT || 3000;

//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser Middleware
app.use(bodyParser.json())

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);

//Index Routes
app.get('/', (req, res) => {
    res.send('Invalid EndPoint');
});

var rand, mailOptions, host, link;

//Email verify



//Start Server
app.listen(port, () =>{
console.log('server started on port ' +port);
});
