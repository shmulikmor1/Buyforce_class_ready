import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // טעינת המשתמש מה-LocalStorage בכל שינוי נתיב
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, [router.pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // שימוש ב-window.location כדי לרענן את ה-State של האפליקציה בחוץ
    window.location.href = "/login";
  }

  const isLoggedIn = !!user;

  // פונקציית עזר לבדיקה האם הקישור נוכחי (Active)
  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  // עיצוב קישורים פעילים - מעודכן לצבע כחול רק אם isActive אמת
  const linkStyle = (href) => ({
    textDecoration: "none",
    color: isActive(href) ? "#228be6" : "#495057",
    fontWeight: isActive(href) ? "700" : "400",
    fontSize: "15px",
    transition: "color 0.2s ease",
  });

  return (
    <nav
      style={{
        display: "flex",
        gap: "1.2rem",
        alignItems: "center",
        padding: "0.75rem 2rem",
        borderBottom: "1px solid #eee",
        marginBottom: "1.25rem",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* לוגו / דף הבית */}
      <Link href="/" style={{ ...linkStyle("/") }}>
        home
      </Link>

      <Link href="/products" style={linkStyle("/products")}>
        Products
      </Link>

      {/* תפריט משתמש רשום */}
      {isLoggedIn && (
        <>
          <Link href="/my-groups" style={linkStyle("/my-groups")}>
            My Groups
          </Link>
          <Link href="/my-orders" style={linkStyle("/my-orders")}>
            My Orders
          </Link>
          <Link href="/wishlist" style={linkStyle("/wishlist")}>
            wishlist
          </Link>
          <Link href="/notifications" style={linkStyle("/notifications")}>
            Notifications
          </Link>
        </>
      )}

      {/* תפריט אדמין */}
      {user?.is_admin && (
        <>
          <span style={{ opacity: 0.2 }}>|</span>
          <Link href="/admin/products" style={linkStyle("/admin/products")}>
            Admin Products
          </Link>
          <Link href="/admin/groups" style={linkStyle("/admin/groups")}>
            Admin Groups
          </Link>
        </>
      )}

      {/* חלק ימני - שם -> תמונה -> Logout */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
        {isLoggedIn ? (
          <>
            {/* 1. שם המשתמש (משמאל לתמונה) */}
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#212529" }}>
              {user.fullName || user.username} {user.is_admin ? "🛡️" : ""}
            </span>

            {/* 2. תמונת הפרופיל (באמצע) */}
            <Link href="/profile" title="Go to Profile">
              <img
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName || user.username}&background=228be6&color=fff`}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e9ecef",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.borderColor = "#228be6";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "#e9ecef";
                }}
              />
            </Link>

            {/* 3. כפתור Logout אדום (מימין לתמונה) */}
            <button 
              onClick={logout} 
              style={{ 
                cursor: "pointer", 
                border: "1px solid #fa5252", 
                background: "none", 
                color: "#fa5252", 
                padding: "5px 12px", 
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "all 0.2s",
                marginLeft: "5px"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#fa5252";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#fa5252";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/login" style={linkStyle("/login")}>Login</Link>
            <Link href="/register" style={{ ...linkStyle("/register"), backgroundColor: "#228be6", color: "#fff", padding: "6px 15px", borderRadius: "6px" }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}