const db = require('../../config/db');

module.exports.getAll = async (req, res) => {
  db.execute('SELECT * FROM Sections',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    });
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT * FROM Sections WHERE sectionID=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    });
};
