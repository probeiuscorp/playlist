import express = require('express');
import chalk = require('chalk');
import path = require('path');
import fs = require('fs');

import page from './page';

const app = express();

export const CHECK = String.fromCharCode(0x2713);
export const X = String.fromCharCode(0x2717);

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

app.get('/', (req, res) => {
    res.send(page());
});

const FAVICON = fs.readFileSync(path.join(__dirname, '..', 'favicon.ico'));

app.get('/favicon.ico', (req, res) => {
    res.send(FAVICON);
});

app.listen(3040, () => {
    console.log(chalk.greenBright(CHECK + ' server listening on port 3040'));
});

/*

To get the thumbnail: https://i.ytimg.com/vi/$id/mqdefault.jpg

*/