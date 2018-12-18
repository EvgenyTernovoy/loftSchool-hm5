const express = require('express');
const path = require('path');
const config = require('../config');
const db = require('./models/db');
const bodyParser = require('body-parser');
const passport = require('passport');
const strategy = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const http = require('http');
const initSocket = require('./middleware/socket');

const app = express();
const socketServer = http.createServer(app);
initSocket(socketServer);

app.set('dataBase', db);

app.use(express.static(path.join(process.cwd(), config.public)));
app.use(express.static(path.join(process.cwd(), config.upload.path)));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(cookieParser());

passport.use(strategy);
app.use(passport.initialize());
app.use(require('./middleware/cors'));

app.use('/', require('./routs'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});



app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({ error: `${res.status}:  ${err.message}`});
});

const server = socketServer.listen(process.env.PORT || config.port, () => {
  console.log(`server listen on ${server.address().port} port`);
}).on('error', (err) => {
  console.log(err);
});
