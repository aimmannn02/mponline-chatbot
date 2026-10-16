import { useTheme } from "./ThemeContext";

function Profile({ currentUser, onLogout }) {
  const { colors } = useTheme();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px",
        backgroundColor: colors.card,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: colors.navy,
          color: colors.gold,
          fontSize: "28px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 15px",
        }}
      >
        {currentUser.email.charAt(0).toUpperCase()}
      </div>

      <h2 style={{ color: colors.heading, marginBottom: "5px" }}>My Profile</h2>
      <p style={{ color: colors.subtext, marginBottom: "20px" }}>
        {currentUser.is_admin ? "Administrator" : "Registered User"}
      </p>

      <div style={{ textAlign: "left", marginBottom: "25px" }}>
        <p style={{ marginBottom: "8px", color: colors.text }}>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <p style={{ color: colors.text }}>
          <strong>User ID:</strong> {currentUser.user_id}
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
          width: "100%",
          backgroundColor: "#DC2626",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;