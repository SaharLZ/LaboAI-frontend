"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../style.css";
import Sidebar from "../components/Sidebar";

const FEATURES_LUNG =['GENDER', 'AGE', 'SMOKING', 'YELLOW_FINGERS', 'ANXIETY', 'PEER_PRESSURE', 'CHRONIC DISEASE', 'FATIGUE ', 'ALLERGY ', 'WHEEZING', 'ALCOHOL CONSUMING', 'COUGHING', 'SHORTNESS OF BREATH', 'SWALLOWING DIFFICULTY', 'CHEST PAIN']

export default function LungCancerUpload() {
  const [form, setForm] = useState(
    FEATURES_LUNG.reduce((acc, key) => ({ ...acc, [key]: "" }), {})
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    for (const key of FEATURES_LUNG) {
      if (!form[key] || isNaN(parseFloat(form[key]))) {
        toast.error(`Please enter a valid number for ${key}`);
        return;
      }
    }

    setLoading(true);
    toast.loading("Predicting...");

    try {
      const res = await fetch("http://localhost:5000/predict?model=model3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      toast.dismiss();

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResult(data);
      toast.success("Prediction complete!");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Sidebar />

      <main className="main-content">
        <h1>🫁 Lung Cancer Prediction</h1>

        <p className="info-text">
          ⚠️ Please fill in all the fields with valid numeric values before submitting.
        </p>

        <div className="feature-form">
          {FEATURES_LUNG.map((feature) => (
            <div className="feature-pair" key={feature}>
              <div className="feature-input">
                <label>{feature}</label>
                <input
                  type="number"
                  step="any"
                  name={feature}
                  value={form[feature]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-button"
        >
          {loading ? <div className="spinner"></div> : "Submit & Predict"}
        </button>

        {result && (
          <div className="result-box">
            <h2>Result: {result.result}</h2>
          </div>
        )}
      </main>
    </div>
  );
}
