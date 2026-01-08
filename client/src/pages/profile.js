import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { http } from "../config/http";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(null);
  const [myGroups, setMyGroups] = useState([]); // נתונים שקיימים ב-Backend
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatarUrl: "",
  });

  async function loadData() {
    try {
      setError("");
      // טעינת פרופיל וקבוצות במקביל
      const [userRes, groupsRes] = await Promise.all([
        http.get("/api/users/me"),
        http.get("/api/groups/my") // משתמש ב-getUserGroups הקיים שלך
      ]);

      setProfile(userRes.data);
      setMyGroups(groupsRes.data);
      setForm({
        fullName: userRes.data.fullName || "",
        phone: userRes.data.phone || "",
        address: userRes.data.address || "",
        avatarUrl: userRes.data.avatarUrl || "",
      });
    } catch (e) {
      console.error(e);
      if (e?.response?.status === 401) router.replace("/login");
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await http.patch("/api/users/me", form);
      setProfile(res.data);
      setIsEditing(false);
      // עדכון ה-localStorage כפי שעשית קודם
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user");
        const current = raw ? JSON.parse(raw) : {};
        localStorage.setItem("user", JSON.stringify({ ...current, ...res.data }));
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={centerStyle}>Loading Profile...</div>;

  return (
    <main style={pageContainer}>
      {/* כרטיס פרופיל עליון */}
      <section style={profileCard}>
        <div style={coverPhoto}></div>
        <div style={profileHeader}>
          <img 
            src={profile?.avatarUrl || "https://ui-avatars.com/api/?name=" + (profile?.fullName || "User")} 
            style={avatarLarge} 
            alt="Avatar" 
          />
          <div style={headerText}>
            <h1 style={userName}>{profile?.fullName || profile?.username}</h1>
            <p style={userEmail}>{profile?.email} • Member since {new Date(profile?.createdAt).getFullYear()}</p>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} style={editToggleBtn}>
            {isEditing ? "View Profile" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={save} style={editForm}>
            <div style={inputGroup}>
              <label>Full Name</label>
              <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label>Address</label>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label>Avatar URL</label>
              <input value={form.avatarUrl} onChange={e => setForm({...form, avatarUrl: e.target.value})} style={inputStyle} />
            </div>
            <button type="submit" disabled={saving} style={saveBtn}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div style={statsContainer}>
            <div style={statBox}>
              <span style={statNumber}>{myGroups.length}</span>
              <span style={statLabel}>Groups Joined</span>
            </div>
            <div style={statBox}>
              <span style={statNumber}>{myGroups.filter(g => g.isCompleted).length}</span>
              <span style={statLabel}>Success Purchases</span>
            </div>
          </div>
        )}
      </section>

      {/* רשימת הקבוצות שלי */}
      <section style={groupsSection}>
        <h2 style={sectionTitle}>My Groups Activity</h2>
        {myGroups.length === 0 ? (
          <p style={emptyText}>You haven't joined any groups yet.</p>
        ) : (
          <div style={groupsGrid}>
            {myGroups.map(group => (
              <div key={group.id} style={groupSmallCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b style={groupName}>{group.name}</b>
                  <span style={groupStatus(group.isCompleted)}>
                    {group.isCompleted ? "Completed" : "Active"}
                  </span>
                </div>
                <div style={progressContainer}>
                  <div style={progressBar(group.progress)}></div>
                </div>
                <div style={groupFooter}>
                  <span>{group.currentParticipants}/{group.minParticipants} Users</span>
                  <span>{group.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// --- Styles (CSS-in-JS) ---
const pageContainer = { maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#fcfcfc' };
const profileCard = { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '30px' };
const coverPhoto = { height: '120px', background: 'linear-gradient(90deg, #228be6 0%, #15aabf 100%)' };
const profileHeader = { padding: '0 30px 30px', marginTop: '-50px', display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' };
const avatarLarge = { width: '120px', height: '120px', borderRadius: '50%', border: '5px solid #fff', backgroundColor: '#eee', objectFit: 'cover' };
const headerText = { flex: 1, minWidth: '200px' };
const userName = { margin: 0, fontSize: '28px', color: '#1a1b1e' };
const userEmail = { margin: '5px 0 0', color: '#868e96' };
const editToggleBtn = { padding: '10px 20px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600' };

const statsContainer = { display: 'flex', gap: '40px', padding: '0 30px 30px', justifyContent: 'flex-start' };
const statBox = { display: 'flex', flexDirection: 'column' };
const statNumber = { fontSize: '24px', fontWeight: 'bold', color: '#228be6' };
const statLabel = { fontSize: '13px', color: '#868e96', textTransform: 'uppercase' };

const editForm = { padding: '30px', display: 'grid', gap: '15px', borderTop: '1px solid #eee' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '16px' };
const saveBtn = { padding: '12px', backgroundColor: '#228be6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };

const groupsSection = { marginTop: '40px' };
const sectionTitle = { fontSize: '20px', marginBottom: '20px', color: '#343a40' };
const groupsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const groupSmallCard = { backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };
const groupName = { fontSize: '16px', color: '#2c2e33' };
const groupStatus = (isDone) => ({ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', backgroundColor: isDone ? '#ebfbee' : '#e7f5ff', color: isDone ? '#2f9e44' : '#228be6', fontWeight: 'bold' });
const progressContainer = { height: '8px', backgroundColor: '#f1f3f5', borderRadius: '4px', margin: '15px 0 8px', overflow: 'hidden' };
const progressBar = (p) => ({ width: p + '%', height: '100%', backgroundColor: '#228be6', transition: 'width 0.3s ease' });
const groupFooter = { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#868e96' };
const emptyText = { color: '#adb5bd', fontStyle: 'italic' };
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#868e96' };