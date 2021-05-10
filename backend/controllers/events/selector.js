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
