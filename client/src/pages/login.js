// client/pages/login.js
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "/";
      }

      if (res.data.user?.is_admin) {
        router.push("/home");
      } else {
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error || "Login failed. Check email/password."
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
        width: "100vw",
        margin: 0,
        padding: "2rem",
        fontFamily: "sans-serif",
        
        // הגדרות תמונת הרקע (זהה ל-Register)
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://ishai.co.il/wp-content/uploads/2023/02/BDish_20161009_173921494_21.jpg')",
        backgroundSize: "contain", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem", color: "#000" }}>
        Buyforce Login
      </h1>

      <p style={{ marginBottom: "2.5rem", fontSize: "1.4rem", fontWeight: "bold" }}>
        <Link href="/register" style={{ color: "#0070f3", textDecoration: "underline" }}>
          Don't have an account? Press here to register
        </Link>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "550px", 
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem", 
          textAlign: "right",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "1.6rem", fontWeight: "900" }}>
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: "1.5rem", 
              borderRadius: "10px", 
              border: "3px solid #000", 
              fontSize: "1.4rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "1.6rem", fontWeight: "900" }}>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              padding: "1.5rem", 
              borderRadius: "10px", 
              border: "3px solid #000", 
              fontSize: "1.4rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          />
        </label>

        {error && (
          <div style={{ color: "red", fontSize: "1.3rem", fontWeight: "bold", textAlign: "center", backgroundColor: "white", padding: "10px", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "1.8rem",
            cursor: "pointer",
            backgroundColor: "blue", // כפתור כחול למראה בולט
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "900",
            fontSize: "1.8rem",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
          }}
        >
          {loading ? "מתחבר..." : "התחבר עכשיו"}
        </button>
      </form>
    </main>
  );
}