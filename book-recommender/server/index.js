const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/recommend', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/recommend', req.body);
    res.json(response.data); // response now includes title, author, reason
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Express server running on port 