// app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        color: "#333",
      }}
    >
      <h1>🚧 We'll be back soon!</h1>
      <p>
        Our site is currently under maintenance. Thank you for your patience.
      </p>
    </main>
  );
}
