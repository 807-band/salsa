const db = require('../../config/db');

/**
 * Station selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Events ORDER BY startTime',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT * FROM Events WHERE eventID=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results[0]);
    });
};
