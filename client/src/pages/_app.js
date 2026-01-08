// client/src/pages/_app.js
import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

function getAuth() {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // חוסמים רק Routes של Admin
    const isAdminRoute = router.pathname.startsWith("/admin");
    if (!isAdminRoute) return;

    const { token, user } = getAuth();
    if (!token || !user?.is_admin) {
      router.replace("/login");
    }
  }, [router.pathname]);

  // לא מציגים NavBar בדפי auth
  const hideNav =
    router.pathname === "/login" || router.pathname === "/register";

  return (
    <>
      {!hideNav && <NavBar />}
      <Component {...pageProps} />
    </>
  );
}
