const db = require('../../config/db');

/**
 * Grouping operations
 */

module.exports.createGrouping = async (req, res) => {
  db.execute('INSERT INTO StationGroup (stationID, title) VALUES (?, ?)',
    [req.params.id, req.body.title],
    (err, results) => {
      req.body.groupID = results.insertId;
      res.jsonp(req.body);
    });
};

module.exports.updateGrouping = async (req, res) => {
  const gID = req.params.gid;
  let updates = '';

  Object.keys(req.body).forEach((key) => {
    updates += `${key}='${req.body[key]}', `;
  });
  updates = updates.slice(0, -2);

  const SQL = `UPDATE StationGroup SET ${updates} WHERE groupID=${gID}`;
  db.execute(SQL);

  res.end();
};

module.exports.deleteGrouping = async (req, res) => {
  const promisePool = db.promise();
  const gID = req.params.gid;

  const ds = await promisePool.query('SELECT * FROM StationGroup WHERE groupID=?', [gID]);
  const dStat = ds[0][0];

  db.promise().execute('UPDATE StationGroup SET level = level - 1 '
    + 'WHERE stationID=? AND level>?', [dStat.stationID, dStat.level]).then(() => {
    db.execute('DELETE FROM StationGroup WHERE groupID=?', [gID]);
  });
  res.end();
};
