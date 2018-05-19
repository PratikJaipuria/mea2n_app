//importing modules
var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());


// CORS Middleware
app.use(cors());

const passport    = require('passport');
app.use(passport.initialize());
app.use(passport.session());

require ("./server/app.js")(app);
// testing server
// app.get('/', (req, res) => {
//     res.send('Invalid Endpoint');
// });

// configure a public directory to host static content
// Set Static Folder

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


//port number
const port = 3000;

app.listen(port);