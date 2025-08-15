# visuaverseconst express = require('express');
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

{
  "name": "visuaverse-backend",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "axios": "^1.6.0",
    "compromise": "^13.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  }
}

import React, { useState } from 'react';
import axios from 'axios';
import KeywordChart from './components/KeywordChart';
import './styles/App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/api/topic/${query}`);
    setData(res.data);
  };

  return (
    <div className="App">
      <h1>VisuaVerse 🌍</h1>
      <input
        type="text"
        placeholder="Enter a topic..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchData}>Visualize</button>

      {data && (
        <div className="result">
          <h2>{data.title}</h2>
          <p>{data.extract}</p>
          {data.thumbnail && <img src={data.thumbnail} alt={data.title} />}
          <KeywordChart keywords={data.keywords.slice(0, 10)} />
          <div className="image-box">[AI Image Placeholder]</div>
        </div>
      )}
    </div>
  );
}

export default App;

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function KeywordChart({ keywords }) {
  const data = {
    labels: keywords.map(k => k.normal),
    datasets: [{
      label: 'Keyword Frequency',
      data: keywords.map(k => k.count),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };
  return <Bar data={data} />;
}
.App {
  text-align: center;
  padding: 2rem;
  font-family: sans-serif;
}

input {
  padding: 0.5rem;
  width: 300px;
  margin-right: 1rem;
}

button {
  padding: 0.5rem 1rem;
}

.result {
  margin-top: 2rem;
}

.image-box {
  width: 300px;
  height: 200px;
  background: #eee;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
}

