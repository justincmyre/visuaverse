const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nlp = require('compromise');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/api/topic/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    const text = response.data.extract;
    const doc = nlp(text);
    const keywords = doc.nouns().out('frequency');

    res.json({
      title: response.data.title,
      extract: text,
      thumbnail: response.data.thumbnail?.source,
      keywords,
    });
  } catch (error) {
    res.status(500).json({ error: 'Topic not found or error fetching data.' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
