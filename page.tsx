export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#0b0f19",
      color: "white"
    }}>
      <h1>Stock Ideas Dashboard</h1>
      <p>AI-powered stock ideas and scoring system</p>

      <a
        href="/ideas"
        style={{
          marginTop: 20,
          padding: "12px 24px",
          background: "#3b82f6",
          color: "white",
          borderRadius: 8,
          textDecoration: "none"
        }}
      >
        Enter Dashboard →
      </a>
    </div>
  )
}
