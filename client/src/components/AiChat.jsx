import React, { useState } from "react";
import axios from "axios";
import "../styles/aiChat.css"; // Create this css file for basic styling if needed

const AiChat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConsult = async () => {
    if (!symptoms) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/consult", { symptoms });
      setResponse(res.data);
    } catch (error) {
      setResponse("Error connecting to AI.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", margin: "20px 0" }}>
      <h3>🤖 AI Symptom Checker</h3>
      <textarea
        rows="3"
        placeholder="Describe your symptoms (e.g., severe headache, nausea)..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleConsult} disabled={loading} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
        {loading ? "Checking..." : "Consult AI"}
      </button>
      {response && (
        <div style={{ marginTop: "15px", background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>
          <strong>Suggestion:</strong> <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AiChat;