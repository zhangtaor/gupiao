export default function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#0b0f19",
      color: "#fff"
    }}>
      <h1>Stock Ideas Dashboard</h1>
      <p>AI-powered stock analysis system</p>

      <a href="/股票" style={{
        marginTop: 20,
        padding: "12px 24px",
        background: "#3b82f6",
        borderRadius: 8,
        color: "#fff",
        textDecoration: "none"
      }}>
        Enter Dashboard →
      </a>
    </div>
  )
}
