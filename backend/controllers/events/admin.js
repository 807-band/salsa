const db = require('../../config/db');

module.exports.create = async (req, res) => {
  console.log(req.body.title);
  console.log(req.body.startTime);
  db.execute('INSERT INTO Events (title, startTime) VALUES (?, ?)',
    [req.body.title, req.body.startTime],
    (err, results) => {
      console.log(results);
      req.body.eventID = results.insertId;
      res.jsonp(req.body);
    });
};
