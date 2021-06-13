const db = require('../../config/db');

module.exports.getAttendanceByEvent = async (req, res) => {
  const eventID = req.params.id;
  db.execute('SELECT Attendance.*, Users.*, Sections.name AS section '
    + 'FROM Attendance NATURAL JOIN Users NATURAL JOIN SectionMembers '
    + 'JOIN Sections ON SectionMembers.sectionID=Sections.sectionID WHERE eventID=?', [eventID],
  (err, results) => {
    if (err) console.log(err);
    res.jsonp(results);
  });
};

module.exports.getAttendanceByUser = async (req, res) => {
  const userID = req.params.id;
  db.execute('SELECT Attendance.*, Users.*, Sections.name AS section '
    + 'FROM Attendance NATURAL JOIN Users NATURAL JOIN SectionMembers '
    + 'JOIN Sections ON SectionMembers.sectionID=Sections.sectionID WHERE userID=?', [userID],
  (err, results) => {
    if (err) console.log(err);
    res.jsonp(results);
  });
};
