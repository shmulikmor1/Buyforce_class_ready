// client/src/pages/products/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { http } from "../../config/http";

function normalizeImageUrl(url) {
  const u = (url || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) return `https://${u}`;
  return u;
}

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({}); // { [id]: "error msg" }

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/api/products");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Products</h1>
      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {items.map((p) => {
          const src = p.imageUrl ? normalizeImageUrl(p.imageUrl) : "";
          const err = imgErrors[p.id];

          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
                <div
                  style={{
                    height: 160,
                    background: "#fafafa",
                    display: "grid",
                    placeItems: "center",
                    padding: 8,
                  }}
                >
                  {src && !err ? (
                    <img
                      src={src}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={() =>
                        setImgErrors((prev) => ({
                          ...prev,
                          [p.id]:
                            "Failed to load image (bad URL / blocked hotlink / mixed-content)",
                        }))
                      }
                    />
                  ) : null}

                  {!src ? (
                    <span style={{ opacity: 0.6, fontSize: 13 }}>No image</span>
                  ) : null}

                  {src && err ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "red", fontSize: 12 }}>{err}</div>
                      <div style={{ fontSize: 11, opacity: 0.75, marginTop: 6 }}>
                        URL: {src}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div style={{ padding: "0.85rem" }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ opacity: 0.8, marginTop: 4 }}>
                    ₪{p.price} • {p.category}
                  </div>
                  <div style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>
                    Stock: {p.stock}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
