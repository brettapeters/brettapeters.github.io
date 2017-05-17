/* eslint no-console: 0 */

const { resolve } = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 8080;
const hostname = process.env.HOSTNAME || 'localhost';

app.use(express.static(resolve(__dirname, 'dist')));
app.get('*', (req, res) => {
	res.sendFile(resolve(__dirname, 'dist/index.html'));
});

app.listen(port, hostname, err => {
	if (err) console.log(err);
	console.log(`Server listening at http://${hostname}:${port}`);
});