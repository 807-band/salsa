const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));

const port = process.env.PORT || 3001;

// TEMP!!! DELETE THIS!!!
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
