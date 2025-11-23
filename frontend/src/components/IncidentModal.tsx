export default function IncidentModal({ incident, onClose }: any) {
  if (!incident) return null


  return (
    <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, width: '80%', maxWidth: 800 }}>
        <h3>Incident {incident.incident_id}</h3>
        <p><b>Prompt:</b> {incident.prompt_text}</p>
        <p><b>Response:</b> {incident.response_text}</p>
        <p><b>Severity:</b> {incident.severity}</p>
        <p><b>Reason:</b> {incident.reason}</p>


        <h4>Replay</h4>
        <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 6 }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{`User prompt:\n${incident.prompt_text}\n\nModel response:\n${incident.response_text}`}</pre>
        </div>


        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}