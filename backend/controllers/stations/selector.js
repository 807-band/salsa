const db = require('../../config/db');

/**
 * Station selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT sID, title, class, level FROM Station ORDER BY class, level',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  const promisePool = db.promise();
  const sID = req.params.id;
  let station;
  let groups;

  station = await promisePool.query('SELECT * FROM Station WHERE sID=?', [sID]);
  station = JSON.stringify(station[0][0]);
  station = JSON.parse(station);

  groups = await promisePool.query('SELECT * FROM StationGroup WHERE StationID=?', [sID]);
  groups = JSON.stringify(groups[0]);
  groups = JSON.parse(groups);

  groups = await Promise.all(groups.map(async (g) => {
    const { groupID } = g;
    delete (g.stationID);

    let item = await promisePool.query('SELECT itemID, item, level, required FROM StationItem WHERE GroupID=?', [groupID]);
    item = JSON.stringify(item[0]);
    g.items = JSON.parse(item);

    return g;
  }));

  station.groups = groups;
  res.jsonp(station);
};
