// client/src/components/ProductComments.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useRouter } from "next/router";

// רכיב להצגת תגובות על מוצר והוספת תגובות חדשות
export default function ProductComments({ productId }) {
  const router = useRouter();
// מצב מקומי לרכיב
  const [comments, setComments] = useState([]);
  // תוכן התגובה החדשה
  const [content, setContent] = useState("");
// מצבים לטעינה ושגיאות
  const [loadingList, setLoadingList] = useState(false);
  // מצב לטעינת הוספת תגובה
  const [loadingAdd, setLoadingAdd] = useState(false);
  // מצב לשגיאות
  const [error, setError] = useState("");

  // טעינת תגובות למוצר
  useEffect(() => {
    async function fetchComments() {
      try {
        setLoadingList(true);
        setError("");
        const res = await axios.get(
          `${API_URL}/api/products/${productId}/comments`
        );
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת תגובות");
      } finally {
        setLoadingList(false);
      }
    }

    if (productId) {
      fetchComments();
    }
  }, [productId]);

  // הוספת תגובה חדשה
  async function handleAddComment(e) {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        router.push("/login");
        return;
      }
      // מתחילים בטעינת ההוספה
      setLoadingAdd(true);
   // שולחים את התגובה לשרת
      const res = await axios.post(
        `${API_URL}/api/products/${productId}/comments`,
        { content: content.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment = res.data;

      // מוסיפים לראש הרשימה בלי ריענון מהשרת
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "שגיאה בשליחת תגובה";
      if (Array.isArray(msg)) {
        setError(msg.join(" | "));
      } else {
        setError(String(msg));
      }
    } finally {
      setLoadingAdd(false);
    }
  }

  // עיצוב תאריך לקריאה נוחה
  function formatDate(value) {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString("he-IL");
    } catch {
      return String(value);
    }
  }

  // קבלת תווית משתמש לתגובה
  function getUserLabel(comment) {
    const u = comment.user;
    if (!u) return "משתמש";
    return u.username || u.email || "משתמש";
  }

  // רינדור הרכיב
  return (
    <section
      style={{
        marginTop: "2rem",
        paddingTop: "1rem",
        borderTop: "1px solid #ddd",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>תגובות על המוצר</h2>

      {/* טופס להוספת תגובה */}
      <form
        onSubmit={handleAddComment}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "500px",
          marginBottom: "1rem",
        }}
      >
        <label>
          הוסף תגובה:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "0.5rem", resize: "vertical" }}
          />
        </label>

        {error && (
          <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loadingAdd}
          style={{
            alignSelf: "flex-start",
            padding: "0.4rem 0.8rem",
            cursor: "pointer",
          }}
        >
          {loadingAdd ? "שולח..." : "שלח תגובה"}
        </button>
      </form>

      {/* רשימת תגובות */}
      {loadingList ? (
        <p>טוען תגובות...</p>
      ) : comments.length === 0 ? (
        <p>אין תגובות עדיין. תהיה הראשון להגיב.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
            // רינדור כל תגובה ברשימה
          {comments.map((c) => (
            <li
              key={c.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "4px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#555",
                  marginBottom: "0.25rem",
                }}
              >
                // הצגת תווית המשתמש ותאריך התגובה
                <strong>{getUserLabel(c)}</strong>{" "}
                <span style={{ marginInlineStart: "0.5rem" }}>
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <div>{c.content}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
