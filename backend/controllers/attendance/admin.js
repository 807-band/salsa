const nodemailer = require('nodemailer');
const db = require('../../config/db');
require('dotenv').config();

const sendEmail = async (csv, title) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
  });
  const mailData = {
    to: process.env.RECIEVES_ATTENDANCE_UPDATES,
    subject: 'Attendance updates',
    html: `<b>Attendance updates:</b><br> New attendance uploaded for event: ${title}<br/>`,
    attachments: [{ filename: 'attendance.csv', content: csv }],
  };
  transporter.sendMail(mailData, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const parseAttendance = (eventID, csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const timeArrivedIndex = headers.indexOf('time');
  const aliasIndex = headers.indexOf('cp alias');
  const body = lines.slice(1);
  if (timeArrivedIndex === -1 || aliasIndex === -1) {
    return 0;
  }
  body.forEach((entry) => {
    if (entry === '') {
      return;
    }
    const parts = entry.split(',').map((p) => p.trim());

    const timeArrived = parts[timeArrivedIndex];
    const alias = parts[aliasIndex];

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
  return 1;
};

module.exports.putAttendance = async (req, res) => {
  if (!req.file || req.file.mimetype !== 'text/csv' || req.file.originalname.slice(-3) !== 'csv') {
    res.send({
      success: false,
      message: 'Please submit a csv file for attendance with attributes CP Alias and time',
    });
  } else {
    const eventID = req.params.id;
    const csv = req.file.buffer.toString('utf-8');

    // delete old attendance for this event
    db.execute('DELETE FROM Attendance WHERE eventID=?', [eventID],
      () => {
        if (parseAttendance(eventID, csv)) {
          db.execute('SELECT title from Events WHERE eventID=?', [eventID],
            (err, results) => {
              sendEmail(csv, results[0].title);
              res.send({
                success: true,
                message: 'Success',
                fileName: req.file.originalname,
              });
            });
        } else {
          res.send({
            success: false,
            message: 'Please submit a csv file for attendance with attributes CP Alias and time',
          });
        }
      });
  }
};
