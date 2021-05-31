const express = require('express');
const cors = require('cors');
const multer = require('multer');
const groupsRoutes = require('./routes/groups.js');
const stationRoutes = require('./routes/stations.js');
const userRoutes = require('./routes/users.js');
const sectionRoutes = require('./routes/sections');
const evaluationRoutes = require('./routes/evaluations');
const eventRoutes = require('./routes/events');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const port = process.env.PORT || 3001;
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.single('file'));

app.use(cors({ origin: true, credentials: true }));
app.use('/api/groups/', groupsRoutes);
app.use('/api/station/', stationRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/section/', sectionRoutes);
app.use('/api/evaluations/', evaluationRoutes);
app.use('/api/event/', eventRoutes);
app.use('/api/attendance/', attendanceRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
