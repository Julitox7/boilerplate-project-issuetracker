'use strict';

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypasses home network lookup blocks

require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');

// 🟢 THE CORRECT OFFICIAL IMPORT: Points to the built-in testing asset wrapper
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const apiRoutes   = require('./routes/api.js');
const runner      = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); // For FCC testing purposes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// 🟢 CRITICAL: Activates the official testing hooks required for Test 11
fccTesting(app);

// Routing for API 
apiRoutes(app);  
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Instantly open the server listener port
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Listening on port " + port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.log(e);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
