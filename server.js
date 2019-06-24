require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk');
let config = require('./config')();

require('dotenv').config();

// Announce environment
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
	console.log('Running application for production');
}
else {
	console.log('Running application for development');
}

// Set up Express.js
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const server = require('http').Server(app);
const PORT = process.env.PORT || config.port;
const DATABASE = process.env.MONGODB_URI || config.database.uri;

// Handle errors
app.use(function(err, req, res, next) {
	if (err instanceof SyntaxError) {
		res.json({'error': 'Invalid JSON'});
	}
	else {
		next();
	}
});

// Catch all for backend API
app.use(require('./src/backend/routes')());

app.get('/index.html', (req, res) => {
	res.redirect('/');
});

// Frontend endpoints
app.use('/public', express.static(`${__dirname}/dist`));

// Catch all for frontend routes
app.all('/*', function(req, res) {
	res.sendFile(`${__dirname}/dist/index.html`);
});

server.listen(PORT);

console.log(chalk.green("Started on port " + PORT));

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false); // Allows findOneAndUpdate()

const conn = () => {
	mongoose.connect(DATABASE, {
		useCreateIndex: true,
		useNewUrlParser: true
	});
};

conn();
  
const db = mongoose.connection;

db.on('error', err => {
	console.log(chalk.red('Error connecting to MongoDB: ' + err));
	console.log('Trying again...');
	setTimeout(() => conn(), config.database.reconnectInterval);
});

db.once('open', () => {
	console.log(chalk.green('Connected to MongoDB: ' + DATABASE));
});