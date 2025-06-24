import { useState } from 'react'

import './App.css'

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/humanize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    setOutput(data.humanized);
  };
  return (
    <div style={{ padding: 20 }}>
      {/* <h2>AI Text Humanizer</h2> */}
      <textarea
        rows="8"
        cols="60"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your AI text here..."
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: 10 }}>Humanize</button>
      {/* <h3>Humanized Text:</h3> */}
      <pre
        style={{
          whiteSpace: 'pre-wrap', marginTop: 10, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5,
          maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '14px',
          color: '#333', lineHeight: '1.5', border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          wordBreak: 'break-word', textAlign: 'left', fontWeight: 'normal', letterSpacing: '0.5px',
          tabSize: 2, margin: '0 auto', width: '80%', maxWidth: '800px', display: 'block',
        }}

      >{output}</pre>
    </div>
  )
}

export default App
