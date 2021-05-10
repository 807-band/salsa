const db = require('../../config/db');

module.exports.all = async (req, res) => {
  await db.execute(
    'SELECT * FROM ( '
      + 'SELECT U.userID, U.name, Sections.name AS section, sID, '
        + 'Station.title, Station.level, '
        + 'Station.class, ifnull(Evaluator.name, "No attempts") AS evaluator, '
        + 'ifnull(Evaluation.passed, 0) AS passed, evalTime, '
        + 'COUNT(passed) OVER (PARTITION BY U.userID, sID) AS attempts '
      + 'FROM Users U JOIN SectionMembers ON U.userID=SectionMembers.userID '
        + 'JOIN Sections ON SectionMembers.sectionID=Sections.sectionID '
      + 'CROSS JOIN Station '
        + 'LEFT JOIN Evaluation ON Evaluation.station=Station.sID '
          + 'AND Evaluation.userID=U.userID '
        + 'LEFT JOIN Users Evaluator ON evaluatorID=Evaluator.userID '
    + ') FE '
    + 'WHERE passed >= ALL ( '
      + 'SELECT passed FROM Evaluation '
      + 'WHERE station=FE.sID AND userID=FE.userID '
    + ') ORDER BY section, name, class, level',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};
