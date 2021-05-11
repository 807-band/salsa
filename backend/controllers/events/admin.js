const db = require('../../config/db');

module.exports.create = async (req, res) => {
  db.execute('INSERT INTO Events (title, startTime) VALUES (?, ?)',
    [req.body.title, req.body.startTime],
    (err, results) => {
      req.body.eventID = results.insertId;
      res.jsonp(req.body);
    });
};

module.exports.updateEvent = async (req, res) => {
  const eventID = req.params.id;
  let updates = '';

  Object.keys(req.body).forEach((key) => {
    updates += `${key}='${req.body[key]}', `;
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
