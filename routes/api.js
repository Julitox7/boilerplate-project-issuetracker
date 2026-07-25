'use strict';

// 🟢 LOCAL DATA ARRAY: Safely tracks your issues internally without needing database connections
let issuesDatabase = [];

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    // 1. GET: View issues on a project (Handles all optional filters)
    .get(function (req, res){
      let project = req.params.project;
      let query = req.query;
      
      // Step A: Isolate items belonging only to the specified project path
      let projectIssues = issuesDatabase.filter(issue => issue.project === project);
      
      // Step B: Loop through and enforce any query filter elements present
      Object.keys(query).forEach(key => {
        let val = query[key];
        if (val === 'true') val = true;
        if (val === 'false') val = false;
        
        projectIssues = projectIssues.filter(issue => String(issue[key]) === String(val));
      });
      
      res.json(projectIssues);
    })
    
    // 2. POST: Create an issue with form payloads
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      // Enforce mandatory creation inputs per FCC spec
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      let newIssue = {
        _id: String(new Date().getTime() + Math.random()), // Safe local ID string layout
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        open: true,
        created_on: new Date(),
        updated_on: new Date()
      };
      
      issuesDatabase.push(newIssue);
      
      // Deep clone object and drop internal tracking key before returning JSON
      let responseObj = { ...newIssue };
      delete responseObj.project;
      res.json(responseObj);
    })
    
    // 3. PUT: Update one or multiple properties on an item
    .put(function (req, res){
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Verify at least one field modifier parameter was supplied
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }
      
      let issue = issuesDatabase.find(item => item._id === _id);
      if (!issue) {
        return res.json({ error: 'could not update', _id: _id });
      }
      
      // Update values dynamically if they are passed in the request body
      if (issue_title) issue.issue_title = issue_title;
      if (issue_text) issue.issue_text = issue_text;
      if (created_by) issue.created_by = created_by;
      if (assigned_to) issue.assigned_to = assigned_to;
      if (status_text) issue.status_text = status_text;
      if (open !== undefined) issue.open = (open === 'false' || open === false) ? false : true;
      
      issue.updated_on = new Date();
      res.json({ result: 'successfully updated', _id: _id });
    })
    
    // 4. DELETE: Erase a tracking entry entirely
    .delete(function (req, res){
      let { _id } = req.body;
      
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      let issueIndex = issuesDatabase.findIndex(item => item._id === _id);
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', _id: _id });
      }
      
      issuesDatabase.splice(issueIndex, 1);
      res.json({ result: 'successfully deleted', _id: _id });
    });
    
};
