// client/src/pages/admin/groups.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminGroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    productId: "",
    minParticipants: "",
    isActive: true,
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await axios.get(`${API_URL}/api/admin/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "שגיאה בטעינת הקבוצות";
      setError(Array.isArray(msg) ? msg.join(" | ") : String(msg));
    }
  }

  function resetForm() {
    setForm({
      name: "",
      productId: "",
      minParticipants: "",
      isActive: true,
      deadline: "",
    });
    setEditingId(null);
    setError("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "isActive") {
      setForm((prev) => ({
        ...prev,
        isActive: type === "checkbox" ? checked : value === "true",
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEdit(group) {
    setEditingId(group.id);
    setForm({
      name: group.name || "",
      productId: group.productId || (group.product ? group.product.id : ""),
      minParticipants: typeof group.minParticipants === "number" ? String(group.minParticipants) : "",
      isActive: !!group.isActive,
      deadline: group.deadline ? new Date(group.deadline).toISOString().slice(0, 16) : "",
    });
    setError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("למחוק את הקבוצה הזו?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      await axios.delete(`${API_URL}/api/admin/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchGroups();
    } catch (err) {
      console.error(err);
      setError("שגיאה במחיקת הקבוצה");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload = {};
      if (form.name && form.name.trim() !== "") payload.name = form.name.trim();
      if (form.productId && form.productId.trim() !== "") payload.productId = form.productId.trim();
      if (form.minParticipants !== "" && form.minParticipants != null) {
        const n = Number(form.minParticipants);
        if (!Number.isNaN(n)) payload.minParticipants = n;
      }
      payload.isActive = form.isActive;
      if (form.deadline) payload.deadline = form.deadline;

      if (editingId) {
        await axios.put(`${API_URL}/api/admin/groups/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/api/admin/groups`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetchGroups();
      resetForm();
    } catch (err) {
      console.error(err);
      setError("שגיאה בשמירת הקבוצה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", direction: "rtl" }}>
      <h1>ניהול קבוצות (Admin)</h1>

      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/products">לניהול מוצרים</Link> |{" "}
        <Link href="/products">לרשימת המוצרים</Link> |{" "}
        <Link href="/">דף הבית</Link>
      </div>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        
        {/* טופס עריכה/יצירה */}
        <section style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "4px", flex: "0 0 400px", backgroundColor: "#f9f9f9" }}>
          <h2>{editingId ? "עריכת קבוצה" : "יצירת קבוצה חדשה"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label> שם קבוצה <input type="text" name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "0.4rem" }} /> </label>
            <label> Product ID <input type="text" name="productId" value={form.productId} onChange={handleChange} style={{ width: "100%", padding: "0.4rem" }} /> </label>
            <label> מינימום משתתפים <input type="number" name="minParticipants" value={form.minParticipants} onChange={handleChange} style={{ width: "100%", padding: "0.4rem" }} /> </label>
            <label> 
              תאריך יעד (Deadline) 
              <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} style={{ width: "100%", padding: "0.4rem" }} /> 
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> קבוצה פעילה
            </label>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button type="submit" disabled={loading} style={{ padding: "0.4rem 0.8rem", cursor: "pointer" }}>
                {loading ? "שומר..." : editingId ? "עדכן קבוצה" : "צור קבוצה"}
              </button>
              {editingId && <button type="button" onClick={resetForm} style={{ padding: "0.4rem 0.8rem", cursor: "pointer" }}> ביטול עריכה </button>}
            </div>
          </form>
        </section>

        {/* רשימת קבוצות עם פרטי מוצר (אדמין) */}
        <section style={{ flex: "1" }}>
          <h2 style={{ marginBottom: "1rem", display: "block", width: "100%", textAlign: "left" }}>MY GROUPS</h2>
          {groups.length === 0 && <p>אין קבוצות עדיין.</p>}
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {groups.map((g) => (
              <div
                key={g.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  backgroundColor: "#fff"
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleEdit(g)} style={{ padding: "0.3rem 0.6rem", cursor: "pointer" }}>ערוך</button>
                  <button onClick={() => handleDelete(g.id)} style={{ padding: "0.3rem 0.6rem", cursor: "pointer", color: "red" }}>מחק</button>
                </div>

                <div style={{ textAlign: "left", flex: 1, paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "5px" }}>
                    <strong style={{ fontSize: "1.2rem" }}>{g.name}</strong>
                  </div>
                  
                  {g.product ? (
                    <div style={{ padding: "8px", borderRadius: "4px", marginBottom: "8px" }}>
                      <div>product: {g.product.name}</div>
                      <div style={{ color: "black" }}> ₪{g.product.price}</div>
                      {g.product.description && <div style={{ fontSize: "0.85rem", fontStyle: "italic" }}>{g.product.description}</div>}
                    </div>
                  ) : (
                    <div style={{ color: "orange", fontSize: "0.85rem" }}>טרם קושר מוצר לקבוצה</div>
                  )}

                  <div style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                    target Participants: {g.minParticipants} people | status: {g.isActive ? "active" : "not active"} 
                  </div>

                  {/* Progress Bar Section - UPDATED */}
                  <div style={{ marginTop: "10px", padding: "5px 0" }}>
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        fontSize: "0.85rem", 
                        marginBottom: "4px",
                        direction: "ltr" // המשתתפים בשמאל, אחוזים בימין
                    }}>
                      <span>
                           <strong>{g.currentParticipants || 0}</strong>/{g.minParticipants}
                      </span>
                      <span style={{ fontWeight: "bold", color: (g.progress >= 100) ? "#28a745" : "#007bff" }}>
                        {g.progress || 0}%
                      </span>
                    </div>
                    
                    <div style={{ width: "100%", height: "10px", backgroundColor: "#e9ecef", borderRadius: "5px", overflow: "hidden", direction: "ltr" }}>
                      <div style={{ 
                        width: `${Math.min(g.progress || 0, 100)}%`, 
                        height: "100%", 
                        backgroundColor: (g.progress >= 100) ? "#28a745" : "#007bff",
                        transition: "width 0.5s ease" 
                      }} />
                    </div>
                  </div>

                  <div style={{ marginTop: "15px" }}>
                    {g.deadline ? (
                      <div style={{ 
                        fontSize: "0.9rem", 
                        color: new Date(g.deadline) < new Date() ? "#721c24" : "#333", 
                        fontWeight: "bold", 
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 10px",
                        backgroundColor: new Date(g.deadline) < new Date() ? "#f8d7da" : "#f1f3f5",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: new Date(g.deadline) < new Date() ? "#f5c6cb" : "#dee2e6"
                      }}>
                        ⏰ Deadline: {new Date(g.deadline).toLocaleString("he-IL", {
                          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                        {new Date(g.deadline) < new Date() && <span style={{fontSize: "0.7rem", marginLeft: "4px"}}>(EXPIRED)</span>}
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.85rem", color: "#999", fontStyle: "italic" }}>
                        No Deadline Set
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <hr style={{ margin: "3rem 0", border: "0", borderTop: "2px solid #eee" }} />
      
      <section style={{ marginBottom: "3rem", direction: "ltr" }}>
        <h2 style={{ 
          marginBottom: "1.5rem", 
          textAlign: "center", 
          width: "100%",
          direction: "rtl" 
        }}>
          All Groups
        </h2>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "1.5rem",
          direction: "ltr"
        }}>
          {groups && groups.length > 0 ? (
            groups.map((g) => (
              <GlobalGroupCard key={g.id} group={g} />
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%" }}>No groups to display.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function GlobalGroupCard({ group }) {
  return (
    <div style={{
      border: "1px solid #eee",
      padding: "15px",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      direction: "ltr", 
      textAlign: "left"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>{group.name}</h3>
        
        <span style={{ 
          fontSize: "0.8rem", 
          color: group.isActive ? "#28a745" : "#dc3545",
          fontWeight: "bold",
          backgroundColor: group.isActive ? "#e6ffed" : "#fff1f0",
          padding: "2px 8px",
          borderRadius: "4px",
          border: `1px solid ${group.isActive ? "#b7eb8f" : "#ffa39e"}`
        }}>
          {group.isActive ? "Active " : "Inactive "}
        </span>
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "black" }}>
          Product: <strong>{group.product?.name || "None"}</strong>
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", color: "#333" }}>
          Price: <strong>₪{group.product?.price || "0"}</strong>
        </p>
        <p style={{ margin: "5px 0", fontSize: "0.85rem", color: "black", fontStyle: "italic" }}>
          Description: {group.product?.description || "No description"}
        </p>
      </div>
        
      {/* Progress Section - UPDATED */}
      <div style={{ marginTop: "15px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          fontSize: "0.85rem", 
          fontWeight: "bold",
          marginBottom: "4px",
          direction: "ltr"
        }}>
          <span style={{ color: "#333" }}>
            Users {group.currentParticipants || 0} / {group.minParticipants}
          </span>
          <span style={{ color: "#007bff" }}>{group.progress || 0}%</span>
        </div>
        
        <div style={{ width: "100%", height: "8px", backgroundColor: "#e9ecef", borderRadius: "4px", overflow: "hidden", direction: "ltr" }}>
          <div style={{ 
            width: `${Math.min(group.progress || 0, 100)}%`, 
            height: "100%", 
            backgroundColor: (group.progress >= 100) ? "#28a745" : "#007bff", 
            borderRadius: "4px",
            transition: "width 0.4s ease-out"
          }} />
        </div>
      </div>

      <div style={{ 
        marginTop: "15px", 
        fontSize: "0.85rem", 
        color: "black",
        borderTop: "1px solid #f5f5f5",
        paddingTop: "10px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "5px"
      }}>
        ⏰ Deadline: {group.deadline ? new Date(group.deadline).toLocaleDateString("en-US") : "Not Set"}
      </div>
    </div>
  );
}