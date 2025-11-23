function colorForSeverity(s: number) {
  if (s >= 0.9) return '#b00020' // red
  if (s >= 0.7) return '#ff8c00' // orange
  return '#2e7d32' // green
}


export default function IncidentList({ incidents, onOpen }: any) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Incidents</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {incidents.map((it: any) => (
          <li key={it.incident_id} style={{ marginBottom: 8, padding: 8, border: '1px solid #ddd', borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14 }}><b>Prompt:</b> {it.prompt_text}</div>
                <div style={{ fontSize: 12, color: '#666' }}><b>Response:</b> {it.response_text}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ background: colorForSeverity(it.severity), color: 'white', padding: '6px 10px', borderRadius: 6 }}>
                  Severity: {it.severity}
                </div>
                <button style={{ marginTop: 8 }} onClick={() => onOpen && onOpen(it)}>View</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}