const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();
const interactions = {};

app.use(bodyParser.json());
app.use(cookieParser());

// Endpoint to update interaction count
app.post('/interactions', (req, res) => {
  const userId = req.body.userId;

  if (interactions[userId] && interactions[userId] >= 3) {
    return res.status(403).json({ message: 'Interaction limit reached' });
  }

  interactions[userId] = (interactions[userId] || 0) + 1;
  res.sendStatus(200);
});

// Endpoint to retrieve interaction count (if needed)
app.get('/interactions/:userId', (req, res) => {
  const userId = req.params.userId;
  const count = interactions[userId] || 0;
  res.json({ count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
