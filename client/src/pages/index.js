import { useEffect, useState } from "react";
import { http } from "../config/http";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
import CountdownTimer from "../components/CountDownTimer"; 

export default function HomePage() {
  const [groups, setGroups] = useState([]);
  const [myGroupIds, setMyGroupIds] = useState(new Set());
  const [wishlistIds, setWishlistIds] = useState(new Set()); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  // פונקציית טעינה ראשונית עם Loading
  async function fetchData() {
    setLoading(true);
    try {
      await syncData();
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  }

  // פונקציה לסנכרון נתונים שקט (בלי להקפיץ Loading)
  async function syncData() {
    try {
      const token = localStorage.getItem("token");
      const resGroups = await http.get("/api/groups");
      
      if (token) {
        const resMyGroups = await http.get("/api/groups/my");
        setMyGroupIds(new Set(resMyGroups.data.map(g => String(g.id))));

        const resWish = await http.get("/api/wishlist");
        
        // --- תוספת לזיהוי קבוצות בווישליסט ---
        const favIds = new Set();
        resWish.data.forEach(item => {
          if (item.productId) favIds.add(String(item.productId));
          if (item.groupId) favIds.add(String(item.groupId)); // זיהוי קבוצה
          if (item.product?.id) favIds.add(String(item.product.id));
        });
        setWishlistIds(favIds);
      }

      const activeGroups = resGroups.data.filter(g => 
        g.isActive && (!g.deadline || new Date(g.deadline) > new Date())
      );
      setGroups(activeGroups);
    } catch (err) {
      console.error("Sync error", err);
    }
  }

  // פונקציה חדשה שהוספה לטיפול בווישליסט של קבוצות מבלי לשנות את handleVote המקורית
  async function handleGroupVote(groupId, shouldAdd) {
    if (!groupId) return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const gIdStr = String(groupId);
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      shouldAdd ? newSet.add(gIdStr) : newSet.delete(gIdStr);
      return newSet;
    });

    try {
      if (shouldAdd) {
        await http.post("/api/wishlist/add", { groupId: gIdStr });
      } else {
        await http.delete(`/api/wishlist/remove/${gIdStr}`);
      }
    } catch (err) {
      console.error("Group vote error", err);
      syncData();
    }
  }

  async function handleVote(productId, shouldAdd) {
    if (!productId || productId === "null" || productId === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const pIdStr = String(productId);
    // עדכון אופטימי לווישליסט
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      shouldAdd ? newSet.add(pIdStr) : newSet.delete(pIdStr);
      return newSet;
    });

    try {
      if (shouldAdd) {
        await http.post("/api/wishlist/add", { productId: pIdStr });
      } else {
        await http.delete(`/api/wishlist/remove/${pIdStr}`);
      }
    } catch (err) {
      console.error("Vote error", err);
      syncData(); // במקרה של שגיאה מסנכרנים חזרה
    }
  }

  async function handleJoin(groupId) {
    if (!localStorage.getItem("token")) return router.push("/login");
    
    const groupIdStr = String(groupId);

    // 1. עדכון אופטימי מיידי למניעת קפיצה
    setMyGroupIds(prev => new Set(prev).add(groupIdStr));
    setGroups(prevGroups => prevGroups.map(g => {
      if (String(g.id) === groupIdStr) {
        const newCount = g.currentParticipants + 1;
        return { 
          ...g, 
          currentParticipants: newCount,
          progress: Math.min(Math.round((newCount / g.minParticipants) * 100), 100)
        };
      }
      return g;
    }));

    try {
      await http.post(`/api/groups/${groupId}/join`);
      syncData(); // עדכון שקט מהשרת
    } catch (err) {
      alert(err.response?.data?.message || "Error joining");
      syncData(); // חזרה למצב קודם במקרה של שגיאה
    }
  }

  async function handleLeave(groupId) {
    const groupIdStr = String(groupId);

    // 1. עדכון אופטימי מיידי
    setMyGroupIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupIdStr);
      return newSet;
    });
    setGroups(prevGroups => prevGroups.map(g => {
      if (String(g.id) === groupIdStr) {
        const newCount = Math.max(g.currentParticipants - 1, 0);
        return { 
          ...g, 
          currentParticipants: newCount,
          progress: Math.min(Math.round((newCount / g.minParticipants) * 100), 100)
        };
      }
      return g;
    }));

    try {
      await http.delete(`/api/groups/${groupId}/join`);
      syncData(); // עדכון שקט
    } catch (err) {
      alert(err.response?.data?.message || "Error leaving");
      syncData();
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f6", direction: "ltr" }}>
      <main style={{ padding: "3rem 1rem", maxWidth: "1400px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "4rem", fontWeight: "900", color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "2px" }}>Buyforce</h1>
          <p style={{ fontSize: "1.4rem", color: "#555", fontWeight: "600", borderTop: "3px solid #000", display: "inline-block", paddingTop: "10px" }}>
            WHERE THE BUY IS THE FORCE OF NATURE
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", fontSize: "1.5rem" }}>Loading Groups...</div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
            gap: "2.5rem" 
          }}>
            {groups.map(group => {
              const isJoined = myGroupIds.has(String(group.id));
              const prodId = group.product?.id || group.productId || group.product_id;
              
              // --- שינוי בבדיקת הלייק: בודק ספציפית את מזהה הקבוצה ---
              const isLiked = wishlistIds.has(String(group.id));
              
              const imageUrl = group.product?.imageUrl || "https://via.placeholder.com/400x250?text=No+Image+Available";
              
              return (
                <div key={group.id} style={cardStyle}>
                  <div style={{ width: "100%", height: "220px", overflow: "hidden", backgroundColor: "#eee", position: "relative" }}>
                    <img 
                      src={imageUrl} 
                      alt={group.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    
                    <div style={voteOverlayStyle}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // --- שימוש בפונקציה החדשה עבור קבוצות ---
                          handleGroupVote(group.id, !isLiked);
                        }}
                        style={miniVoteButtonStyle(isLiked, 'like')}
                      >
                        {isLiked ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <div style={badgeStyle}>Active</div>
                  </div>

                  <div style={{ padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div onClick={() => prodId && router.push(`/products/${prodId}`)} style={{ cursor: 'pointer' }}>
                      <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: "800", color: "#111" }}>{group.name}</h3>
                      <div style={{ color: "#228be6", fontWeight: "700", fontSize: "1.1rem", marginTop: "5px" }}>
                        ₪{group.product?.price || 0}
                      </div>
                      <div style={{ color: "#555", fontSize: "1rem", fontWeight: "600", marginTop: "2px" }}>
                        {group.product?.name}
                      </div>
                    </div>
                    
                    <p style={{ fontSize: "1rem", color: "#666", lineHeight: "1.5", margin: 0 }}>
                      {group.description || "Join this power group to get the best deal."}
                    </p>

                    <div style={{ marginTop: "auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "8px" }}>
                        <span>Progress: {group.currentParticipants} / {group.minParticipants}</span>
                        <span>{group.progress}%</span>
                      </div>
                      <div style={{ backgroundColor: "#e9ecef", height: "12px", borderRadius: "6px", overflow: "hidden" }}>
                        <div style={{ 
                          backgroundColor: "#228be6", 
                          width: `${group.progress}%`, 
                          height: "100%", 
                          transition: "width 0.4s ease-out" 
                        }} />
                      </div>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#555", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                      ⏰ Time Left: <CountdownTimer deadline={group.deadline} />
                    </div>

                    {isJoined ? (
                      <button onClick={() => handleLeave(group.id)} style={buttonStyle("#fff", "#ff4d4f", "#ff4d4f")}>
                        עזוב קבוצה
                      </button>
                    ) : (
                      <button onClick={() => handleJoin(group.id)} style={buttonStyle("#000", "#fff", "#000")}>
                        הצטרף לקבוצה
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Styles (אותם סטיילים מקוריים שלך) ---
const cardStyle = { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", transition: "transform 0.2s ease", position: "relative" };
const badgeStyle = { position: "absolute", top: "15px", right: "15px", backgroundColor: "#20c997", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" };
const voteOverlayStyle = { position: "absolute", top: "15px", left: "15px", display: "flex", gap: "8px", zIndex: 10 };
const miniVoteButtonStyle = (isLiked, type) => ({ width: "35px", height: "35px", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", fontSize: "1rem", transition: "all 0.2s", backgroundColor: isLiked ? "#fff" : "rgba(255,255,255,0.8)", opacity: 1 });
const buttonStyle = (bg, color, border) => ({ width: "100%", padding: "14px", backgroundColor: bg, color: color, border: `2px solid ${border}`, borderRadius: "8px", cursor: "pointer", fontWeight: "800", fontSize: "1rem", textTransform: "uppercase", transition: "all 0.2s ease" });
