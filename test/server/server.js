// import fs from 'fs';
import path from 'path';
// import * as http from 'http';
import express from 'express';
// import * as onHeaders from 'on-headers';

let server;
function startServer(page) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.static(path.join(process.env.PWD, 'test', 'server')));
  app.get('/', (req, res) => res.sendFile(path.join(process.env.PWD, 'test', 'server', page)));

  console.log('app is listening on port 4321');
  server = app.listen(4321);
}

async function stopServer() {
  console.log('stopping server');
  server.close();
  // wait for two seconds to allow shutdown.
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
}

export {stopServer, startServer};

if (require.main === module) {
  console.log('starting server');
  startServer('index_success.html');
}
