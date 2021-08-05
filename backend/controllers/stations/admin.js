const db = require('../../config/db');

module.exports.create = async (req, res) => {
  db.execute('INSERT INTO Station (title, description, class) VALUES (?, ?, ?)',
    [req.body.title, req.body.description, req.body.rank],
    (err, results) => {
      req.body.sID = results.insertId;
      res.jsonp(req.body);
    });
};

module.exports.updateStation = async (req, res) => {
  const sID = req.params.id;
  let updates = '';

  Object.keys(req.body).forEach((key) => {
    updates += `${key}='${req.body[key]}', `;
  });
  updates = updates.slice(0, -2);

  const SQL = `UPDATE Station SET ${updates} WHERE sID=${sID}`;
  db.execute(SQL);

  res.end();
};

module.exports.updateStationOrder = async (req, res) => {
  const sID = req.params.id;
  const to = req.body.order;
  const promisePool = db.promise();
  let station = await promisePool.query('SELECT level, class FROM Station WHERE sID=?', [sID]);
  station = JSON.stringify(station[0][0]);
  station = JSON.parse(station);
  const from = station.level;
  const currClass = station.class;

  if (from > to) { // if item moved up
    db.promise().execute('UPDATE Station SET level = level + 1 WHERE level >= ? AND level < ? AND class = ?', [to, from, currClass]).then(() => {
      db.execute('UPDATE Station SET level = ? WHERE sID = ?', [to, sID]);
    });
  } else if (to > from) { // if item moved down
    db.promise().execute('UPDATE Station SET level = level - 1 WHERE level > ? AND level <= ? AND class = ?', [from, to, currClass]).then(() => {
      db.execute('UPDATE Station SET level = ? WHERE sID = ?', [to, sID]);
    });
  } else db.promise().execute('UPDATE Station SET level = ? WHERE sID = ?', [to, sID]);

  res.end();
};

module.exports.delete = async (req, res) => {
  const promisePool = db.promise();
  const sID = req.params.id;

  const ds = await promisePool.query('SELECT * FROM Station WHERE sID=?', [sID]);
  const dStat = ds[0][0];

  db.promise().execute('UPDATE Station SET level = level - 1 '
     + 'WHERE class=? AND level>?', [dStat.class, dStat.level]).then(() => {
    db.execute('DELETE FROM Station WHERE sID=?', [sID]);
  });
  res.end();
};
