const db = require('../../config/db');

module.exports.create = async (req, res) => {
  db.execute('INSERT INTO Events (title, startTime) VALUES (?, ?)',
    [req.body.title, req.body.startTime],
    (err, results) => {
      req.body.eventID = results.insertId;
      res.jsonp(req.body);
    });
};
