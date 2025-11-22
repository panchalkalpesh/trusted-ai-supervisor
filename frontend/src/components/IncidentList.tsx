export default function IncidentList({ incidents }: any) {
  return (
    <div>
      <h2>Incidents</h2>
      <ul>
        {incidents.map((i: any) => (
          <li key={i.id}>
            <b>Severity:</b> {i.severity} — <b>Prompt:</b> {i.prompt}
          </li>
        ))}
      </ul>
    </div>
  );
}