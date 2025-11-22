import { useState } from "react";
import { submitPrompt, getIncidents } from "./api";
import IncidentList from "./components/IncidentList";


export default function App() {
  const [prompt, setPrompt] = useState("");
  const [incidents, setIncidents] = useState([]);


  const run = async () => {
    await submitPrompt(prompt);
    setIncidents(await getIncidents());
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>Trusted Model Supervisor</h1>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
      <br />
      <button onClick={run}>Run Probe</button>
      <IncidentList incidents={incidents} />
    </div>
  );
}
