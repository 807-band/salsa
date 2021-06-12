const db = require('../../config/db');

/**
 * User selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT Users.userID, Users.username, Users.name, SectionMembers.sectionID, Sections.name AS section FROM Users '
    + 'JOIN SectionMembers ON Users.userID=SectionMembers.userID '
    + 'JOIN Sections ON SectionMembers.sectionID=Sections.sectionID '
    + 'ORDER BY sectionID',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute(
    'SELECT Users.userID, Users.username, Users.name, SectionMembers.sectionID, Sections.name AS section FROM Users '
    + 'LEFT JOIN SectionMembers ON Users.userID=SectionMembers.userID '
    + 'LEFT JOIN Sections ON SectionMembers.sectionID=Sections.sectionID '
    + 'WHERE Users.userID=?', [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results[0]);
    },
  );
};

module.exports.getByUsername = async (req, res) => {
  db.execute(
    'SELECT Users.userID, Users.username, Users.name, SectionMembers.sectionID, Sections.name AS section FROM Users '
    + 'LEFT JOIN SectionMembers ON Users.userID=SectionMembers.userID '
    + 'LEFT JOIN Sections ON SectionMembers.sectionID=Sections.sectionID '
    + 'WHERE Users.username=?', [req.params.username],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results[0]);
    },
  );
};

/**
 * Permission selectors
 */
module.exports.getPermissions = async (req, res) => {
  db.execute('SELECT permission FROM Permissions '
    + 'WHERE userID=?',
  [req.params.id],
  (err, results) => {
    if (err) console.log(err);
    const permissions = [];
    Object.keys(results).forEach((p) => {
      permissions.push(results[p].permission);
    });
    res.jsonp(permissions);
  });
};
