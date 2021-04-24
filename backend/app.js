const express = require('express');
const cors = require('cors');
const stationRoutes = require('./routes/stations.js');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use('/api/station/', stationRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
