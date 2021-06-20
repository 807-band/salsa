const db = require('../../config/db');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Events ORDER BY startTime',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT * FROM Events WHERE eventID=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results[0]);
    });
};

// get all members expected at this event (group 'groupID' with specified substitutions)
module.exports.getEventMembers = async (req, res) => {
  db.execute(
    'SELECT groupID FROM Events WHERE eventID=?', [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      const { groupID } = results[0];
      if (groupID) {
        db.execute('SELECT eventMembers.userID, Users.name AS name, Sections.sectionID, Sections.name AS section, oldUserID, oldUsers.name AS oldName FROM (SELECT IFNULL(newUserID, userID) AS userID, oldUserID FROM '
          + '(SELECT * FROM UserGroups WHERE groupID=?) AS groupMembers '
          + 'LEFT OUTER JOIN '
          + '(SELECT * FROM Substitutions WHERE eventID=?) AS subs ON groupMembers.userID=subs.oldUserID) AS eventMembers '
          + 'NATURAL JOIN Users NATURAL JOIN SectionMembers JOIN Sections ON Sections.sectionID=SectionMembers.sectionID '
          + 'LEFT JOIN Users AS oldUsers ON oldUsers.userID=oldUserID',
        [groupID, req.params.id],
        (err2, results2) => {
          if (err2) console.log(err2);
          res.jsonp(results2);
        });
      } else { // null groupID -> event is for whole band...
        db.execute(
          'SELECT Users.userID, Users.username, Users.name, SectionMembers.sectionID, Sections.name AS section FROM Users '
          + 'JOIN SectionMembers ON Users.userID=SectionMembers.userID '
          + 'JOIN Sections ON SectionMembers.sectionID=Sections.sectionID '
          + 'ORDER BY sectionID',
          (err2, results2) => {
            if (err2) console.log(err2);
            res.jsonp(results2);
          },
        );
      }
    },
  );
};
