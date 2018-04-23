const initialiseApp = require('./web');
const fs = require('fs-sync');
const http = require('http');

const port = process.env.PORT || 4000;
const app = initialiseApp();

http.createServer(app).listen(port, () => {
  console.log(fs.read('banner.txt'));
  console.log(`Server listening on port ${port}`);
  console.log(`Serving content from: ${app.get('srcDir')}`);
});