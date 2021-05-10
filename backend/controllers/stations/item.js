const db = require('../../config/db');

/**
 * Item operations
 */

module.exports.createItem = async (req, res) => {
  db.execute('INSERT INTO StationItem (groupID, item, required) VALUES (?, ?, ?)',
    [req.params.gid, req.body.title, req.body.isRequired],
    (err, results) => {
      if (err) console.log(err);
      req.body.itemID = results.insertId;
      res.jsonp(req.body);
    });
};

module.exports.updateItem = async (req, res) => {
  const itemID = req.params.iid;
  let updates = '';

  Object.keys(req.body).forEach((key) => {
    updates += `${key}='${req.body[key]}', `;
  });
  updates = updates.slice(0, -2);

  const SQL = `UPDATE StationItem SET ${updates} WHERE itemID=${itemID}`;
  db.execute(SQL);

  res.end();
};

module.exports.deleteItem = async (req, res) => {
  const promisePool = db.promise();
  const itemID = req.params.iid;

  const ds = await promisePool.query('SELECT * FROM StationItem WHERE itemID=?', [itemID]);
  const dStat = ds[0][0];

  db.promise().execute('UPDATE StationItem SET level = level - 1 '
    + 'WHERE groupID=? AND level>?', [dStat.groupID, dStat.level]).then(() => {
    db.execute('DELETE FROM StationItem WHERE itemID=?', [itemID]);
  });
  res.end();
};
