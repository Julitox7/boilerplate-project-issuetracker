'use strict';

let issuesDatabase = [];

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let query = req.query;
      let projectIssues = issuesDatabase.filter(issue => issue.project === project);
      
      Object.keys(query).forEach(key => {
        let val = query[key];
        if (val === 'true') val = true;
        if (val === 'false') val = false;
        projectIssues = projectIssues.filter(issue => String(issue[key]) === String(val));
      });
      res.json(projectIssues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      let newIssue = {
        _id: String(new Date().getTime() + Math.random()),
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
      let responseObj = { ...newIssue };
      delete responseObj.project;
      res.json(responseObj);
    })
    
    .put(function (req, res){
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if (!_id) return res.json({ error: 'missing _id' });
      
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }
      
      let issue = issuesDatabase.find(item => item._id === _id);
      if (!issue) return res.json({ error: 'could not update', _id: _id });
      
      if (issue_title) issue.issue_title = issue_title;
      if (issue_text) issue.issue_text = issue_text;
      if (created_by) issue.created_by = created_by;
      if (assigned_to) issue.assigned_to = assigned_to;
      if (status_text) issue.status_text = status_text;
      if (open !== undefined) issue.open = (open === 'false' || open === false) ? false : true;
      
      issue.updated_on = new Date();
      res.json({ result: 'successfully updated', _id: _id });
    })
    
    .delete(function (req, res){
      let { _id } = req.body;
      if (!_id) return res.json({ error: 'missing _id' });
      
      let issueIndex = issuesDatabase.findIndex(item => item._id === _id);
      if (issueIndex === -1) return res.json({ error: 'could not delete', _id: _id });
      
      issuesDatabase.splice(issueIndex, 1);
      res.json({ result: 'successfully deleted', _id: _id });
    });
    
};
