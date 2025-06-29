"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";
import Sidebar from "./components/Sidebar";

const MODELS = [
  { id: "model1", name: "Skin Cancer Classifier" },
  { id: "model2", name: "Another Model" },
  { id: "model3", name: "Third Model" },
];

const CLASS_DESCRIPTIONS = {
  "actinic keratosis": "A rough, scaly patch on skin caused by years of sun exposure.",
  "basal cell carcinoma": "A type of skin cancer that begins in basal cells.",
  "dermatofibroma": "A benign skin growth, usually firm and reddish-brown.",
  "melanoma": "A serious form of skin cancer that develops in melanocytes.",
  "nevus": "A common mole or birthmark on the skin.",
  "pigmented benign keratosis": "A harmless skin growth with pigmentation.",
  "seborrheic keratosis": "A benign, wart-like skin growth.",
  "squamous cell carcinoma": "A type of skin cancer that may appear as scaly patches.",
  "vascular lesion": "Abnormal clusters of blood vessels in the skin.",
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);
    toast.loading("Analyzing image...");

    try {
      const res = await fetch(`http://localhost:5000/predict?model=model1`, {
        method: "POST",
        body: formData,
      });

      toast.dismiss();

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResult(data);
      toast.success("Analysis complete!");
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
        <h1>🔬 LaboAI - Skin Disease Detection</h1>
      <p className="info-text">
        📷 Upload a clear image of a skin lesion for analysis using the AI model.
      </p>
     <div className="ster">
       <div className="file-upload">
          <label htmlFor="fileInput" className="custom-file-upload">
            Choose an Image
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              setFile(selected || null);
              if (selected) {
                setPreview(URL.createObjectURL(selected));
              }
            }}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="upload-button"
        >
          {loading ? "Analyzing..." : "Upload & Predict"}
        </button>
     </div>
       

        {preview && (
          <div className="preview">
            <img src={preview} alt="Selected" />
          </div>
        )}

        {result && (
          <div className="result-box">
            <h2>Result: {result.class}</h2>
            <p>Confidence: <strong>{result.confidence}%</strong></p>
            <p>{CLASS_DESCRIPTIONS[result.class] || "No description available."}</p>
          </div>
        )}
      </main>
    </div>
  );
}
