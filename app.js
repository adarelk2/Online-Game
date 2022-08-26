const { log } = require('console');
const express = require('express'); // using express
const http = require('http')
const port = process.env.PORT||3000 // setting the port
let app = express();
let server = http.createServer(app);

server.listen(port);