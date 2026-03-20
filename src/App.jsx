import { useState } from "react";
import "./index.css";

export default function App() {
  const [premium, setPremium] = useState(80);
  const [location, setLocation] = useState("Hyderabad");
  const [risk, setRisk] = useState("Medium");

  const calculatePremium = () => {
    if (risk === "Low") setPremium(50);
    else if (risk === "Medium") setPremium(80);
    else setPremium(120);
  };

  return (
    <div>
      <h1>🚀 GigShield AI</h1>

      <div className="container">

        {/* PROFILE */}
        <div className="card">
          <div className="section-title">👤 User Profile</div>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Location"
          />

          <div className="select-wrapper">
            <select value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option value="Low">Low Risk Area</option>
              <option value="Medium">Medium Risk Area</option>
              <option value="High">High Risk Area</option>
            </select>
          </div>

          <button className="primary" onClick={calculatePremium}>
            Calculate Premium
          </button>

          <div className="highlight">
            Weekly Premium: <span className="green">₹{premium}</span>
          </div>
        </div>

        {/* CONDITIONS */}
        <div className="card">
          <div className="section-title">🌦️ Live Risk Monitor</div>

          <p>🌧 Rainfall: <span className="green">60mm ✔</span></p>
          <p>🌫 AQI: <span className="green">420 ✔</span></p>
          <p>🌡 Temp: 44°C</p>

          <div className="divider"></div>

          <p className="red">⚠ Auto Claim Triggered</p>
        </div>

        {/* PAYOUT */}
        <div className="card">
          <div className="section-title">💸 Smart Payout</div>

          <p>Days Affected: 2</p>
          <p>Daily Compensation: ₹300</p>

          <div className="highlight">
            Total Payout: <span className="green">₹600</span>
          </div>

          <button className="success">
            Instant UPI Transfer ⚡
          </button>
        </div>

      </div>
    </div>
  );
}