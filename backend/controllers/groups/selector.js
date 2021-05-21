const db = require('../../config/db');

/**
 * Station selectors
 */

module.exports.getGroupNames = async (req, res) => {
  db.execute(
    'SELECT * FROM BandGroups ORDER BY groupName',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getGroupMembers = async (req, res) => {
  db.execute(
    'SELECT *, Sections.name AS section, Users.name AS memberName '
    + 'FROM BandGroups NATURAL LEFT JOIN UserGroups NATURAL LEFT JOIN Users NATURAL LEFT JOIN SectionMembers '
    + 'LEFT JOIN Sections ON Sections.sectionID=SectionMembers.sectionID WHERE groupID=? ORDER BY groupID, Sections.name',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};
