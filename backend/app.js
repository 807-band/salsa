const express = require('express');
const cors = require('cors');
const stationRoutes = require('./routes/stations.js');
const userRoutes = require('./routes/users.js');
const sectionRoutes = require('./routes/sections');
const evaluationRoutes = require('./routes/evaluations');
const eventRoutes = require('./routes/events');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: true, credentials: true }));
app.use('/api/station/', stationRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/section/', sectionRoutes);
app.use('/api/evaluations/', evaluationRoutes);
app.use('/api/event/', eventRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
