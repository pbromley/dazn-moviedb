const express = require('express');
const path = require('path');
const http = require('http');

const initialiseApp = () => {
    const app = express();
    const srcDir = path.join(__dirname, '../../public/');

    app.set('srcDir', srcDir);
    app.use('/public', express.static(srcDir));

    app.get('*', (req, res) => {
        res.sendFile(`${srcDir}/index.html`);
    });

    return app;
};
module.exports = initialiseApp;


