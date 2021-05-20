const db = require('../../config/db');

module.exports.createGroup = async (req, res) => {
  db.execute(
    'INSERT INTO BandGroups (groupName) VALUES (?)',
    [req.body.name],
    (err, results) => {
      if (err) console.log(err);

      let values = '';
      req.body.members.forEach((m) => {
        values += `(${m}, ${results.insertId}), `;
      });
      values = values.slice(0, -2);

      if (values.length > 0) {
        db.execute(`INSERT INTO UserGroups (userID, groupID) VALUES ${values}`);
      }

      res.jsonp(results);
    },
  );
};

module.exports.editGroup = async (req, res) => {
  const groupID = req.params.id;
  db.execute(
    'UPDATE BandGroups SET groupName=? WHERE groupID=?',
    [req.body.name, groupID],
  );

  let values = '';
  req.body.members.forEach((m) => {
    values += `(${m}, ${groupID}), `;
  });
  values = values.slice(0, -2);

  db.execute('DELETE FROM UserGroups WHERE groupID=?', [groupID], () => {
    if (values.length > 0) db.execute(`INSERT INTO UserGroups (userID, groupID) VALUES ${values}`);
  });

  res.end();
};

module.exports.deleteGroup = async (req, res) => {
  db.execute('DELETE FROM BandGroups WHERE groupID=?', [req.params.id]);
  res.end();
};
