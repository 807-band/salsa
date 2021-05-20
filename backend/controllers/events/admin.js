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
    } else {
      updates += `${key}='${req.body[key]}', `;
    }
  });
  updates = updates.slice(0, -2);

  const SQL = `UPDATE Events SET ${updates} WHERE eventID=${eventID}`;
  db.execute(SQL);

  res.end();
};

module.exports.putAttendance = async (req, res) => {
  const eventID = req.params.id;
  console.log(eventID);
  console.log(req.file.buffer.toString('utf-8'));
  // TODO: parse attendance & put info in DB
  res.end();
};

module.exports.delete = async (req, res) => {
  await db.execute('DELETE FROM Events WHERE eventID=?', [req.params.id]);
  res.end();
};
