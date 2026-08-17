import React, { useState } from "react";
import axios from "axios";
import "../styles/aiChat.css";
import { FaRobot, FaSparkles, FaPaperPlane, FaUserMd } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const quickSymptoms = [
  "Persistent headache and sensitivity to light",
  "High fever, dry cough, and shortness of breath",
  "Sudden lower back pain and joint stiffness",
  "Skin redness with itching on hands",
  "Acid reflux and severe stomach bloating"
];

const AiChat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConsult = async (e) => {
    if (e) e.preventDefault();
    if (!symptoms.trim()) {
      return toast.error("Please describe your symptoms first");
    }

    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("/ai/consult", { symptoms });
      setResponse(res.data);
      toast.success("AI Analysis Complete!");
    } catch (error) {
      console.error(error);
      setResponse("Our AI triage service is temporarily unavailable. Please browse our doctors list or consult a physician directly.");
      toast.error("AI service could not process request");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (symptomText) => {
    setSymptoms(symptomText);
  };

  return (
    <section className="ai-chat-section" id="ai-consultation">
      <div className="ai-chat-card">
        <div className="ai-chat-header">
          <div className="ai-avatar">
            <FaRobot />
          </div>
          <div className="ai-header-text">
            <h3>
              DocLink AI Medical Assistant <span className="ai-badge">GPT-3.5</span>
            </h3>
            <p>
              Describe what you are experiencing. Our AI will analyze your symptoms and suggest the most suitable specialist.
            </p>
          </div>
        </div>

        <div className="ai-chat-body">
          <div className="ai-quick-tags">
            <span className="tag-label">Common Prompt Suggestions:</span>
            <div className="tag-chips">
              {quickSymptoms.map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chip-btn"
                  onClick={() => handleChipClick(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleConsult} className="ai-input-wrapper">
            <textarea
              className="ai-textarea"
              rows="3"
              placeholder="E.g., I've had a recurring migraine for 3 days accompanied by mild dizziness and nausea..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <div className="ai-submit-row">
              <button
                type="submit"
                disabled={loading}
                className="btn"
                style={{ background: "linear-gradient(135deg, #0284c7 0%, #8b5cf6 100%)" }}
              >
                {loading ? (
                  <>Analyzing Symptoms...</>
                ) : (
                  <>
                    <FaPaperPlane /> Analyze & Recommend
                  </>
                )}
              </button>
            </div>
          </form>

          {response && (
            <div className="ai-response-box">
              <div className="ai-response-header">
                <FaRobot /> AI Clinical Recommendation
              </div>
              <p className="ai-response-text">{response}</p>
              <div className="ai-response-cta">
                <NavLink to="/doctors" className="btn btn-secondary">
                  <FaUserMd /> Browse Suggested Doctors
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiChat;