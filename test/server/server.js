// import fs from 'fs';
import path from 'path';
// import * as http from 'http';
import express from 'express';
// import * as onHeaders from 'on-headers';

let app;
let server;
function startServer(page) {
  app = express();
  app.disable('x-powered-by');
  app.use(express.static(path.join(process.env.PWD, 'test', 'server')));
  app.get('/', (req, res) => res.sendFile(path.join(process.env.PWD, 'test', 'server', page)));

  console.log('app is listening on port 3000');
  server = app.listen(3000);
}

function stopServer() {
  console.log('stopping server');
  // const server = require('http').createServer(app);
  server.close();
}

export {stopServer, startServer};

if (require.main === module) {
  console.log('starting server');
  startServer('index_success.html');
}
