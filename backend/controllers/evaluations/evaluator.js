const db = require('../../config/db');

async function isPassed(itemMap, maxFailed) {
  const promisePool = db.promise();
  let numFailed = 0;
  let passed = true;
  Object.keys(itemMap).forEach(async (key) => {
    if (!itemMap[key]) {
      numFailed += 1;
      if (numFailed > maxFailed) passed = false;
      const dStat = await promisePool.query('SELECT required FROM StationItem WHERE itemID=?',
        [key]);
      if (dStat[0][0].required) passed = false;
    }
  });
  return passed ? numFailed <= maxFailed : false;
}

module.exports.submit = async (req, res) => {
  const passed = await isPassed(req.body.itemMap, req.body.maxFailed);
  db.execute('INSERT INTO Evaluation (userID, evaluatorID, station, passed) '
      + 'VALUES (?, ?, ?, ?)',
  [req.params.userid, req.body.evaluatorid, req.params.stationid, passed],
  (err, results) => {
    if (err) console.log(err);
    Object.keys(req.body.itemMap).forEach((key) => {
      db.execute('INSERT INTO EvaluationItems (evalID, itemID, status) '
               + 'VALUES (?, ?, ?)',
      [results.insertId, key, req.body.itemMap[key]]);
    });
  });
  res.end();
};
