const db = require('../../config/db');

module.exports.progress = async (req, res) => {
  db.execute('SELECT sID, title, class, level, MAX(passed) AS passed '
      + 'FROM Station LEFT JOIN Evaluation '
      + 'ON Evaluation.station=sID AND userID=? '
      + 'GROUP BY sID, title, class, level '
      + 'ORDER BY class, level',
  [req.params.userid],
  (err, results) => {
    if (err) console.log(err);
    res.jsonp(results);
  });
};

module.exports.next = async (req, res) => {
  db.execute('SELECT Station.sID, level, class '
      + 'FROM Evaluation JOIN Station '
      + 'ON Station.sID=Evaluation.station AND Evaluation.passed=true '
      + 'WHERE Evaluation.userID=? '
      + 'ORDER BY class, level',
  [req.params.userid],
  (err1, results1) => {
    const lastCompleted = results1[results1.length - 1];
    db.execute('SELECT * FROM Station ORDER BY class, level',
      (err2, results2) => {
        if (!lastCompleted) {
          res.jsonp(results2[0]);
          return;
        }
        const i = results2.findIndex((station) => station.sID === lastCompleted.sID);
        res.jsonp(results2[i + 1]);
      });
  });
};
