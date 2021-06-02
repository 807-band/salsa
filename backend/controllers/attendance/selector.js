const db = require('../../config/db');

module.exports.getAttendance = async (req, res) => {
  const eventID = req.params.id;
  db.execute('SELECT Attendance.*, Users.*, Sections.name AS section '
    + 'FROM Attendance NATURAL JOIN Users NATURAL JOIN SectionMembers '
    + 'JOIN Sections ON SectionMembers.sectionID=Sections.sectionID WHERE eventID=?', [eventID],
  (err, results) => {
    if (err) console.log(err);
    res.jsonp(results);
  });
};
