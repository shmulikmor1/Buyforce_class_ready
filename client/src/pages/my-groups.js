import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "../config/api";
import NavBar from "../components/NavBar";
import CountdownTimer from "../components/CountDownTimer";

export default function MyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveLoadingId, setLeaveLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchMyGroups() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/groups/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Error loading your groups");
      } finally {
        setLoading(false);
      }
    }
    fetchMyGroups();
  }, [router]);

  async function handleLeave(groupId) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      setLeaveLoadingId(groupId);
      await axios.delete(`${API_URL}/api/groups/${groupId}/join`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (err) {
      alert(err?.response?.data?.message || "Error leaving group");
    } finally {
      setLeaveLoadingId(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f6", direction: "ltr" }}>

      <main style={{ padding: "3rem 1rem", maxWidth: "1400px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "#1a1a1a", textTransform: "uppercase" }}>
            My Groups
          </h1>
          <p style={{ color: "#666", fontWeight: "500" }}>Manage the groups you have joined</p>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", fontSize: "1.5rem" }}>Loading...</div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
            gap: "2.5rem" 
          }}>
            {groups.map((group) => {
              const progress = group.progress ?? 0;
              const isFull = progress >= 100 || group.isActive === false;
              const imageUrl = group.product?.imageUrl || "https://via.placeholder.com/400x250?text=No+Image";

              return (
                <div key={group.id} style={cardStyle}>
                  {/* Image Section */}
                  <div style={imageContainerStyle}>
                    <img src={imageUrl} alt={group.name} style={imageStyle} />
                  </div>

                  {/* Status Badge */}
                  <div style={isFull ? fullBadgeStyle : activeBadgeStyle}>
                    {isFull ? "Completed/Full" : "Active"}
                  </div>

                  <div style={contentStyle}>
                    <div>
                      <h3 style={titleStyle}>{group.name}</h3>
                      
                      <div style={priceStyle}>₪{group.product?.price || 0}</div>
                    </div>

                    <p style={descStyle}>{group.description}</p>

                    {/* Progress Bar */}
                    <div style={{ marginTop: "auto" }}>
                      <div style={progressLabelStyle}>
                        <span>Progress: {group.currentParticipants} / {group.minParticipants}</span>
                        <span>{progress}%</span>
                      </div>
                      <div style={progressBgStyle}>
                        <div style={{ ...progressFillStyle, width: `${progress}%` }} />
                      </div>
                    </div>

                    {/* Timer Section */}
                    <div style={timerContainerStyle}>
                      ⏰ Ends in: <CountdownTimer deadline={group.deadline} />
                    </div>

                    {/* Joined Date Label */}
                    {group.joinedAt && (
                      <div style={{ fontSize: "0.8rem", color: "#999" }}>
                        Joined: {new Date(group.joinedAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => handleLeave(group.id)}
                      disabled={isFull || leaveLoadingId === group.id}
                      style={buttonStyle(
                        isFull || leaveLoadingId === group.id ? "#ccc" : "#fff",
                        isFull || leaveLoadingId === group.id ? "#888" : "#ff4d4f",
                        isFull || leaveLoadingId === group.id ? "#ccc" : "#ff4d4f"
                      )}
                    >
                      {leaveLoadingId === group.id ? "Leaving..." : isFull ? "Full - Cannot Leave" : "Leave Group"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && groups.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
            You haven't joined any groups yet.
          </p>
        )}
      </main>
    </div>
  );
}

// --- Styles (Identical to HomePage for consistency) ---
const cardStyle = { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", position: "relative" };
const imageContainerStyle = { width: "100%", height: "220px", overflow: "hidden", backgroundColor: "#eee" };
const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const activeBadgeStyle = { position: "absolute", top: "15px", right: "15px", backgroundColor: "#20c997", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" };
const fullBadgeStyle = { ...activeBadgeStyle, backgroundColor: "#f08c00" };
const contentStyle = { padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column", gap: "1rem" };
const titleStyle = { margin: 0, fontSize: "1.6rem", fontWeight: "800", color: "#111" };
const priceStyle = { color: "#228be6", fontWeight: "700", fontSize: "1.1rem", marginTop: "5px" };
const descStyle = { fontSize: "1rem", color: "#666", lineHeight: "1.5", margin: 0 };
const progressLabelStyle = { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "8px" };
const progressBgStyle = { backgroundColor: "#e9ecef", height: "12px", borderRadius: "6px", overflow: "hidden" };
const progressFillStyle = { backgroundColor: "#228be6", height: "100%", transition: "width 0.6s ease" };
const timerContainerStyle = { fontSize: "0.9rem", color: "#555", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" };
const buttonStyle = (bg, color, border) => ({
  width: "100%", padding: "12px", backgroundColor: bg, color: color, border: `2px solid ${border}`, borderRadius: "8px", cursor: "pointer", fontWeight: "800", fontSize: "0.9rem", textTransform: "uppercase", marginTop: "10px"
});