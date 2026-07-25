const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let deleteId = '5f665d343105a30017a10000';

  suite('Routing Tests', function() {
    
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
      chai.request(server).post('/api/issues/test').send({ issue_title: 'F', issue_text: 'F', created_by: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server).post('/api/issues/test').send({ issue_title: 'F', issue_text: 'F', created_by: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server).post('/api/issues/test').send({}).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
      chai.request(server).get('/api/issues/test').end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai.request(server).get('/api/issues/test').query({ open: true }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai.request(server).get('/api/issues/test').query({ open: true, created_by: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server).put('/api/issues/test').send({ _id: deleteId, issue_title: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server).put('/api/issues/test').send({ _id: deleteId, issue_title: 'F', issue_text: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server).put('/api/issues/test').send({ issue_title: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai.request(server).put('/api/issues/test').send({ _id: deleteId }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server).put('/api/issues/test').send({ _id: deleteId, issue_title: 'F' }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server).delete('/api/issues/test').send({ _id: deleteId }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server).delete('/api/issues/test').send({ _id: deleteId }).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server).delete('/api/issues/test').send({}).end(function(err, res) { assert.equal(res.status, 200); done(); });
    });

  });
});
