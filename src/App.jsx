import { useState } from "react";
import RealImageAnalyzer from "./RealImageAnalyzer";
import "./index.css";

export default function App() {
  const [pingResult, setPingResult] = useState("");

  // Call the serverless API route
  const handlePing = async () => {
  setPingResult("Calling…");
  try {
    const res = await fetch("/api/openai-ping");
    const data = await res.json();
    setPingResult(
      data.ok ? data.text : `❌ ${data.error}${data.detail ? ` — ${data.detail}` : ""}`
    );
  } catch (err) {
    setPingResult(`❌ ${String(err)}`);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Your existing component */}
      <RealImageAnalyzer />

      {/* Test button for API */}
      <div className="mt-6">
        <button
          onClick={handlePing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test OpenAI API
        </button>
      </div>

      {/* Show result */}
      {pingResult && (
        <p className="mt-4 text-gray-700">
          API Response: <span className="font-semibold">{pingResult}</span>
        </p>
      )}
    </div>
  );
}