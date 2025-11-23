import { useEffect, useState } from 'react'
import { submitPrompt, getIncidents, getHealth } from './api'
import IncidentList from './components/IncidentList'
import HealthStatus, { type HealthResponse } from './components/HealthStatus'
import IncidentModal from './components/IncidentModal'
import './index.css';

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [incidents, setIncidents] = useState<unknown[]>([])
  const [selected, setSelected] = useState<unknown>(null)
  const [health, setHealth] = useState<HealthResponse>({ backend: false, sandbox: false })


  async function loadIncidents() { setIncidents(await getIncidents()) }
  async function loadHealth() { setHealth(await getHealth()) }


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadIncidents();
    loadHealth();
    const t = setInterval(loadHealth, 5000);
    return () => clearInterval(t);
  }, [])


  async function run() {
    await submitPrompt(prompt)
    await loadIncidents()
    setPrompt('')
  }


  return (
    <div style={{ padding: 20 }}>
      <h1>Trusted Model Supervisor</h1>
      <HealthStatus health={health} />


      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} style={{ width: '100%' }} />
      <br />
      <button onClick={run} style={{ marginTop: 8 }}>Run Probe</button>


      <IncidentList incidents={incidents} onOpen={setSelected} />
      <IncidentModal incident={selected} onClose={() => setSelected(null)} />
    </div>
  )
}