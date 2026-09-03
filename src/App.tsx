/**
 * Application root.
 *
 * The stage, chrome and panels are layered in over subsequent changes; for now
 * this renders the bare dark canvas the design sits on.
 */
export function App() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#06080c',
      }}
    />
  )
}
