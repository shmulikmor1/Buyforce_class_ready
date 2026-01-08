// client/src/pages/admin/products.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { http } from "../../config/http";

const emptyForm = {
  name: "",
  price: 0,
  category: "",
  stock: 0,
  description: "",
  imageUrl: "",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [imgPreviewError, setImgPreviewError] = useState("");

  const isAdmin = useMemo(() => {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    return !!user?.is_admin;
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await http.get("/api/products");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [router, isAdmin]);

  function startCreate() {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setImgPreviewError("");
  }

  function startEdit(p) {
    setMode("edit");
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      price: Number(p.price || 0),
      category: p.category || "",
      stock: Number(p.stock || 0),
      description: p.description || "",
      imageUrl: p.imageUrl || "",
    });
    setError("");
    setImgPreviewError("");
  }

  async function remove(id) {
    if (!confirm("Delete product?")) return;
    try {
      await http.delete(`/api/products/${id}`);
      setItems((prev) => prev.filter((x) => x.id !== id));
      if (editingId === id) startCreate();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete product");
    }
  }

  function normalizeImageUrl(url) {
    const u = (url || "").trim();
    if (!u) return "";
    // אם המשתמש שם "www..." בלי http, נוסיף https
    if (!/^https?:\/\//i.test(u)) return `https://${u}`;
    return u;
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      stock: form.stock === "" ? 0 : Number(form.stock),
      description: form.description || undefined,
      imageUrl: form.imageUrl ? normalizeImageUrl(form.imageUrl) : undefined,
    };

    try {
      let res;
      if (mode === "create") {
        res = await http.post("/api/products", payload);
        const created = res.data;
        setItems((prev) => [created, ...prev]);
      } else {
        res = await http.patch(`/api/products/${editingId}`, payload);
        const updated = res.data;
        setItems((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
      }

      startCreate();
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Save failed";

      // אם השרת מחזיר message כמערך (class-validator), נציג יפה:
      if (Array.isArray(msg)) setError(msg.join(" | "));
      else setError(msg);
    } finally {
      setSaving(false);
    }
  }

  const previewUrl = form.imageUrl ? normalizeImageUrl(form.imageUrl) : "";

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Admin Products</h1>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "1.5rem",
          alignItems: "start",
          marginTop: "1rem",
        }}
      >
        {/* List */}
        <section style={{ border: "1px solid #eee", borderRadius: 6, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ marginTop: 0 }}>Products</h2>
            <button onClick={startCreate} style={{ cursor: "pointer" }}>
              + New
            </button>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {items.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: "0.75rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                {/* תצוגת תמונה */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 6,
                    overflow: "hidden",
                    background: "#fafafa",
                    display: "grid",
                    placeItems: "center",
                    flex: "0 0 auto",
                    border: "1px solid #eee"
                  }}
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span style={{ opacity: 0.6, fontSize: 12 }}>No image</span>
                  )}
                </div>

                {/* פרטי המוצר - מעודכן לשורות נפרדות */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: "4px" }}>{p.name}</div>
                  
                  <div style={{ opacity: 0.8, fontSize: 13, display: "flex", flexDirection: "column", gap: "2px" }}>
                     <div>Category: {p.category}</div>
                    <div>Price: ₪{p.price}</div>
                    <div>Stock: {p.stock}</div>
                  </div>

                  {p.description && (
                    <div style={{ 
                      opacity: 0.7, 
                      fontSize: 12, 
                      marginTop: 6, 
                      lineHeight: "1.4",
                      borderTop: "1px solid #eee",
                      paddingTop: 4 
                    }}>
                      {p.description}
                    </div>
                  )}
                </div>

                {/* כפתורי פעולה */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(p)} style={{ cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => remove(p.id)} style={{ cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section style={{ border: "1px solid #eee", borderRadius: 6, padding: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>
            {mode === "create" ? "Create Product" : "Edit Product"}
          </h2>

          <form onSubmit={submit} style={{ display: "grid", gap: "0.75rem" }}>
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", padding: "0.5rem" }}
                required
              />
            </label>

            <label>
              Price
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={{ width: "100%", padding: "0.5rem" }}
                min={0}
                required
              />
            </label>

            <label>
              Category
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "0.5rem" }}
                required
              />
            </label>

            <label>
              Stock
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                style={{ width: "100%", padding: "0.5rem" }}
                min={0}
              />
            </label>

            <label>
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", minHeight: 80 }}
              />
            </label>

            <label>
              Image URL (must be http/https)
              <input
                value={form.imageUrl}
                onChange={(e) => {
                  setForm({ ...form, imageUrl: e.target.value });
                  setImgPreviewError("");
                }}
                style={{ width: "100%", padding: "0.5rem" }}
                placeholder="https://example.com/image.jpg"
              />
            </label>

            {previewUrl ? (
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "#fafafa",
                      border: "1px solid #ddd",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={() => setImgPreviewError("Image failed to load (bad URL or blocked by CORS)")}
                    />
                  </div>
                  <span style={{ opacity: 0.7, fontSize: 13 }}>Preview</span>
                </div>

                {imgPreviewError ? (
                  <div style={{ color: "red", fontSize: 13 }}>{imgPreviewError}</div>
                ) : null}

                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Saved URL will be: <b>{previewUrl}</b>
                </div>
              </div>
            ) : null}

            <button
              disabled={saving}
              type="submit"
              style={{ padding: "0.6rem", cursor: "pointer" }}
            >
              {saving ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </form>
        </section>
      </div>

      {/* Database Table */}
      <section style={{ marginTop: "4rem", borderTop: "2px solid #eee", paddingTop: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>PRODUCT LIST DATABASE</h2>
        
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Image</th>
              <th style={{ padding: "12px" }}>Category</th>
              <th style={{ padding: "12px" }}>Price</th>
              <th style={{ padding: "12px" }}>Stock</th>
              <th style={{ padding: "12px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{p.name}</td>
                <td style={{ padding: "12px", fontSize: "12px", color: "#666", fontFamily: "monospace" }}>{p.id}</td>
                <td style={{ padding: "12px" }}>
                  <div style={{ width: "40px", height: "40px", background: "#eee", borderRadius: "4px", overflow: "hidden" }}>
                    {p.imageUrl && <img src={p.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.name} />}
                  </div>
                </td>
                <td style={{ padding: "12px" }}>{p.category}</td>
                <td style={{ padding: "12px" }}>₪{p.price}</td>
                <td style={{ padding: "12px" }}>{p.stock}</td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#555", maxWidth: "300px" }}>
                  {p.description || <span style={{ color: "#ccc" }}>No description</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>לא נמצאו מוצרים במאגר.</p>
        )}
      </section>
    </main>
  );
}