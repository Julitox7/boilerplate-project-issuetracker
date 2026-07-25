/*
*
*
*
*
*
*
*
*
*
*
*
*       ALLOWED TO EDIT ONLY THIS FILE
*       FOR THE PURPOSE OF THIS CHALLENGE
*       
*       
*       
*       
*       
*       
*       
*       
*       
*       
*       
*/

'use strict';

const fs = require('fs');
const runner = require('../test-runner');

module.exports = function (app) {

  app.route('/_api/server.js')
    .get(function(req, res, next) {
      console.log('requested bot_file');
      fs.readFile(__dirname + '/../server.js', function(err, data) {
        if(err) return next(err);
        res.send(data.toString());
      });
    });
    
  app.route('/_api/routes/api.js')
    .get(function(req, res, next) {
      console.log('requested bot_file');
      fs.readFile(__dirname + '/../routes/api.js', function(err, data) {
        if(err) return next(err);
        res.send(data.toString());
      });
    });

  app.route('/_api/get-tests')
    .get(function(req, res, next){
      console.log('freeCodeCamp is scraping your functional tests...');
      if(!runner.report) return next();
      res.json(testFilter(runner.report));
    });
};

function testFilter(tests) {
  let out = [];
  tests.forEach(function(test) {
    let t = {
      title: test.title,
      context: test.context,
      state: test.state,
      // we don't need error messages in the report
    };
    if(test.state === 'failed') {
      t.error = test.error;
    }
    out.push(t);
  });
  return out;
}
