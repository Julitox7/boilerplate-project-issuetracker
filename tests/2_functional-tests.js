const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let deleteId;

  suite('Routing Tests', function() {
    
    // 1. Create an issue with every field
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post('/api/issues/test_project')
        .send({
          issue_title: 'Fix Bug',
          issue_text: 'The server crashes on launch',
          created_by: 'Julio',
          assigned_to: 'Dev Team',
          status_text: 'High Priority'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Fix Bug');
          assert.equal(res.body.issue_text, 'The server crashes on launch');
          assert.equal(res.body.created_by, 'Julio');
          assert.equal(res.body.assigned_to, 'Dev Team');
          assert.equal(res.body.status_text, 'High Priority');
          assert.property(res.body, '_id');
          deleteId = res.body._id;
          done();
        });
    });

    // 2. Create an issue with only required fields
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post('/api/issues/test_project')
        .send({
          issue_title: 'Required Title',
          issue_text: 'Required Text',
          created_by: 'Tester'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Required Title');
          assert.equal(res.body.issue_text, 'Required Text');
          assert.equal(res.body.created_by, 'Tester');
          done();
        });
    });

    // 3. Create an issue with missing required fields
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post('/api/issues/test_project')
        .send({
          issue_title: 'Missing critical fields'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });

    // 4. View issues on a project
    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test_project')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // 5. View issues on a project with one filter
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test_project')
        .query({ created_by: 'Tester' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // 6. View issues on a project with multiple filters
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get('/api/issues/test_project')
        .query({ created_by: 'Tester', open: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    // 7. Update one field on an issue
    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test_project')
        .send({ _id: deleteId, issue_title: 'New Title' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, deleteId);
          done();
        });
    });

    // 8. Update multiple fields on an issue
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test_project')
        .send({ _id: deleteId, issue_text: 'Altered text block', open: false })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, deleteId);
          done();
        });
    });

    // 9. Update an issue with missing _id
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test_project')
        .send({ issue_title: 'No ID' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    // 10. Update an issue with no fields to update
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test_project')
        .send({ _id: deleteId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, deleteId);
          done();
        });
    });

    // 11. Update an issue with an invalid _id
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put('/api/issues/test_project')
        .send({ _id: '5f665d343105a30017a10000', issue_title: 'Fake ID' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, '5f665d343105a30017a10000');
          done();
        });
    });

    // 12. Delete an issue
    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete('/api/issues/test_project')
        .send({ _id: deleteId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, deleteId);
          done();
        });
    });

    // 13. Delete an issue with an invalid _id
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete('/api/issues/test_project')
        .send({ _id: '5f665d343105a30017a10000' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, '5f665d343105a30017a10000');
          done();
        });
    });

    // 14. Delete an issue with missing _id
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete('/api/issues/test_project')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

  });
});
