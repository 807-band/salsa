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
    to: 'booce3@gmail.com, bryce.collard@gmail.com',
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
  const body = lines.slice(1);
  body.forEach((entry) => {
    if (entry === '') {
      return;
    }
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
    db.execute('DELETE FROM Attendance WHERE eventID=?', [eventID],
      () => {
        parseAttendance(eventID, csv);
        db.execute('SELECT title from Events WHERE eventID=?', [eventID],
          (err, results) => {
            sendEmail(csv, results[0].title);
          });
      });
    res.send({
      success: true,
      message: 'Success',
      fileName: req.file.originalname,
    });
  }
};
