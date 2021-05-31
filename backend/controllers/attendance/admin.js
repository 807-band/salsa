const db = require('../../config/db');

const parseAttendance = (eventID, csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const body = lines.slice(1);
  console.log(headers);
  body.forEach((entry) => {
    if (entry === '') {
      return;
    }
    console.log(`\n${entry}`);
    const parts = entry.split(',').map((p) => p.trim());

    const timeArrived = parts[headers.indexOf('time')];
    const alias = parts[headers.indexOf('cp alias')];

    if (!alias) {
      return;
    }
    db.execute('SELECT userID from Users where username=?', [alias],
      (err, res) => {
        if (res[0]) {
          db.execute('INSERT INTO Attendance (eventID, userID, timeArrived) VALUES (?, ?, ?)',
            [eventID, res[0].userID, timeArrived]);
        }
      });
  });
};

module.exports.putAttendance = async (req, res) => {
  if (!req.file || req.file.mimetype !== 'text/csv' || req.file.originalname.slice(-3) !== 'csv') {
    res.send({
      success: false,
      message: 'Please submit a csv file for attendance // Format: First,Last,Section,CP Alias,Time',
    });
  } else {
    const eventID = req.params.id;
    const csv = req.file.buffer.toString('utf-8');

    // delete old attendance for this event
    db.execute('DELETE FROM Attendance WHERE eventID=?', [eventID]);
    parseAttendance(eventID, csv);
    res.send({
      success: true,
      message: 'Success',
      fileName: req.file.originalname,
    });
  }
};
