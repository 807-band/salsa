const db = require('../../config/db');

module.exports.create = async (req, res) => {
  if (req.body.tardyTime) {
    db.execute('INSERT INTO Events (title, startTime, tardyTime, groupID) VALUES (?, ?, ?, ?)',
      [req.body.title, req.body.startTime, req.body.tardyTime, req.body.groupID],
      (err, results) => {
        req.body.eventID = results.insertId;
        res.jsonp(req.body);
      });
  } else {
    db.execute('INSERT INTO Events (title, startTime, groupID) VALUES (?, ?, ?)',
      [req.body.title, req.body.startTime, req.body.groupID],
      (err, results) => {
        req.body.eventID = results.insertId;
        res.jsonp(req.body);
      });
  }
};

module.exports.updateEvent = async (req, res) => {
  const eventID = req.params.id;
  let updates = '';

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === 'DEFAULT') {
      updates += `${key}=DEFAULT, `;
    } else if (!req.body[key]) {
      updates += `${key}=NULL, `;
    } else {
      updates += `${key}='${req.body[key]}', `;
    }
  });
  updates = updates.slice(0, -2);

  const SQL = `UPDATE Events SET ${updates} WHERE eventID=${eventID}`;
  db.execute(SQL);

  res.end();
};

module.exports.delete = async (req, res) => {
  await db.execute('DELETE FROM Events WHERE eventID=?', [req.params.id]);
  res.end();
};

/**
 * substitutions
 */

module.exports.createSub = async (req, res) => {
  const eventID = req.params.id;
  await db.execute('INSERT INTO Substitutions (eventID, oldUserID, newUserID) VALUES (?, ?, ?)',
    [eventID, req.body.oldUserID, req.body.newUserID],
    (err, results) => {
      if (err) console.log(err);
      res.send(results);
    });
};

module.exports.updateSub = async (req, res) => {
  const eventID = req.params.id;
  await db.execute('UPDATE Substitutions SET newUserID=? WHERE eventID=? AND oldUserID=?',
    [req.body.newUserID, eventID, req.body.oldUserID],
    (err, results) => {
      if (err) console.log(err);
      res.send(results);
    });
};

module.exports.deleteSub = async (req, res) => {
  const eventID = req.params.id;
  const { oldUserID } = req.params;
  await db.execute('DELETE FROM Substitutions WHERE eventID=? AND oldUserID=?',
    [eventID, oldUserID],
    (err, results) => {
      if (err) console.log(err);
      res.send(results);
    });
};
