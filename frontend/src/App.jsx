<div id="root"></div>
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
