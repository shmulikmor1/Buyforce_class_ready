import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { http } from "../config/http";

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setError("");
        const res = await http.get("/api/notifications/my");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function markRead(id) {
    setBusyId(id);
    try {
      await http.patch(`/api/notifications/${id}/read`);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to mark as read");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteNotif(id) {
    const ok = window.confirm("Are you sure you want to delete this notification?");
    if (!ok) return;

    setBusyId(id);
    try {
      await http.delete(`/api/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete notification");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main style={containerStyle}>
      <h1 style={mainTitleStyle}>Notifications</h1>

      {error && <p style={errorStyle}>{error}</p>}
      
      <div style={contentWrapperStyle}>
        {loading ? (
          <p style={centeredTextStyle}>Loading notifications...</p>
        ) : items.length === 0 ? (
          <p style={centeredTextStyle}>No notifications yet.</p>
        ) : (
          <div style={gridStyle}>
            {items.map((n) => (
              <div key={n.id} style={{
                ...cardStyle,
                borderRight: n.isRead ? "4px solid #dee2e6" : "4px solid #228be6",
                backgroundColor: n.isRead ? "#f8f9fa" : "#fff"
              }}>
                <div style={cardHeaderStyle}>
                  <div style={typeTimeWrapper}>
                    <span style={typeStyle}>{n.type.replace('_', ' ')}</span>
                    <span style={timeStyle}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString('he-IL') : ""}
                    </span>
                  </div>
                  
                  <div style={actionButtonGroupStyle}>
                    {!n.isRead && (
                      <button
                        onClick={() => markRead(n.id)}
                        disabled={busyId === n.id}
                        style={markReadButtonStyle}
                      >
                        {busyId === n.id ? "..." : "Mark Read"}
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(n.id)}
                      disabled={busyId === n.id}
                      style={deleteButtonStyle}
                    >
                      {busyId === n.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                <p style={messageStyle}>{n.message}</p>

                <div style={cardFooterStyle}>
                  <span style={{
                    ...statusBadgeStyle,
                    backgroundColor: n.isRead ? "#e9ecef" : "#e7f5ff",
                    color: n.isRead ? "#495057" : "#228be6"
                  }}>
                    {n.isRead ? "Read" : "New"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// --- Styles ---
const containerStyle = {
  padding: "40px 20px",
  fontFamily: "'Inter', system-ui, sans-serif",
  backgroundColor: "#f1f3f5",
  minHeight: "100vh"
};

const mainTitleStyle = {
  textAlign: "center",
  fontSize: "3rem",
  fontWeight: "900",
  color: "#1a1a1a",
  marginBottom: "40px",
  letterSpacing: "-1px"
};

const contentWrapperStyle = {
  maxWidth: "800px",
  margin: "0 auto"
};

const gridStyle = {
  display: "grid",
  gap: "20px"
};

const cardStyle = {
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start"
};

const typeTimeWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const typeStyle = {
  fontWeight: "800",
  fontSize: "0.9rem",
  textTransform: "uppercase",
  color: "#495057"
};

const timeStyle = {
  fontSize: "0.8rem",
  color: "#868e96"
};

const messageStyle = {
  fontSize: "1.05rem",
  color: "#212529",
  lineHeight: "1.5",
  margin: 0
};

const actionButtonGroupStyle = {
  display: "flex",
  gap: "8px"
};

const markReadButtonStyle = {
  padding: "6px 12px",
  fontSize: "0.8rem",
  fontWeight: "600",
  backgroundColor: "#fff",
  border: "1px solid #ced4da",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#495057"
};

const deleteButtonStyle = {
  padding: "6px 12px",
  fontSize: "0.8rem",
  fontWeight: "600",
  backgroundColor: "#fff5f5",
  border: "1px solid #ffa8a8",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#fa5252"
};

const cardFooterStyle = {
  marginTop: "4px"
};

const statusBadgeStyle = {
  fontSize: "0.75rem",
  fontWeight: "700",
  padding: "4px 8px",
  borderRadius: "4px"
};

const centeredTextStyle = {
  textAlign: "center",
  color: "#868e96",
  marginTop: "50px"
};

const errorStyle = {
  textAlign: "center",
  color: "#fa5252",
  backgroundColor: "#fff5f5",
  padding: "10px",
  borderRadius: "8px",
  maxWidth: "400px",
  margin: "0 auto 20px"
};