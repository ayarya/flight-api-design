const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const flightRouter = require('./routes/flights');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'abcdefg' ]
	})
);
app.use(flightRouter);

app.listen(3000, () => {
	console.log('listening ');
});
