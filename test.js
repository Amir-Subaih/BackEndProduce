const path = require('path');

//const express = require('express');

//const app = express();

const pathimage = path.join(__dirname, "images");

console.log(pathimage);
console.log(__dirname);

console.log(new Date().toISOString().replace(/:/g, '-'));

//console.log(app.use(express.static(pathimage)));
