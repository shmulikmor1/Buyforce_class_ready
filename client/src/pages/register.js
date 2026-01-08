// client/pages/register.js
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("test1");
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/users/signup`, {
        username,
        email,
        password,
      });

      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      router.push("/home");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Registration failed. Check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
     style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "sans-serif",
    
    // --- כאן נכנסת התמונה! ---
  backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('https://ishai.co.il/wp-content/uploads/2023/02/BDish_20161009_173921494_21.jpg')",
    backgroundSize: "contain",      // ממלא את כל המסך
    backgroundPosition: "center",  // תמיד ממרכז את נושא התמונה
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"  // אפקט יוקרתי של רקע קבוע
  }}
>
      
      {/* כותרת גדולה יותר */}
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#222" }}>
        Buyforce Register
      </h1>

      <p style={{ marginBottom: "2.5rem", fontSize: "1.2rem" }}>
        <Link href="/login" style={{ color: "blue",fontWeight:"bold", textDecoration: "underline" }}>
          if you have an account press here
        </Link>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "500px", // הגדלתי את רוחב הטופס
          display: "flex",
          flexDirection: "column",
          gap: "2rem", // רווח גדול יותר בין השדות
          textAlign: "right",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "1.4rem", fontWeight: "bold" }}>
          שם משתמש
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              padding: "1.2rem", 
              borderRadius: "8px", 
              border: "2px solid #333", // מסגרת עבה ובולטת יותר
              fontSize: "1.2rem" 
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "1.4rem", fontWeight: "bold" }}>
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: "1.2rem", 
              borderRadius: "8px", 
              border: "2px solid #333", 
              fontSize: "1.2rem" 
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "1.4rem", fontWeight: "bold" }}>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              padding: "1.2rem", 
              borderRadius: "8px", 
              border: "2px solid #333", 
              fontSize: "1.2rem" 
            }}
          />
        </label>

        {error && (
          <div style={{ color: "red", fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "1.5rem",
            cursor: "pointer",
            backgroundColor: "blue", // כפתור שחור למראה "נקי" וחזק
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.5rem", // כפתור גדול מאוד
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "נרשם..." : "הרשם עכשיו"}
        </button>
      </form>
    </main>
  );
}