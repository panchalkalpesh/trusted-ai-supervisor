export interface HealthResponse {
  backend: boolean;
  sandbox: boolean;
  timestamp?: string;
}

export default function HealthStatus({ health }: { health: HealthResponse }) {
  const { backend, sandbox } = health;

  return (
    <aside className="health-status" style={{ marginBottom: 12 }}>
      Backend: <b className={"" + backend}>{backend ? 'OK' : 'DOWN'}</b>
      &nbsp; | &nbsp;
      Sandbox: <b className={"" + sandbox}>{sandbox ? 'OK' : 'DOWN'}</b>
    </aside >
  )
}