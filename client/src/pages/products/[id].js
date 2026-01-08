import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { http } from "../../config/http";
import NavBar from "../../components/NavBar";

function normalizeImageUrl(url) {
  const u = (url || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) return `https://${u}`;
  return u;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setImgError("");
        const res = await http.get(`/api/products/${id}`);
        setProduct(res.data);
        
        const token = localStorage.getItem("token");
        if (token) {
          const wishlistRes = await http.get('/api/wishlist');
          const inWishlist = wishlistRes.data.some(item => item.productId === id);
          setIsFavorite(inWishlist);
        }
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleVote(shouldBeFavorite) {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      if (shouldBeFavorite && !isFavorite) {
        // לייק - הוספה
        await http.post('/api/wishlist/add', { productId: id });
        setIsFavorite(true);
      } else if (!shouldBeFavorite && isFavorite) {
        // דיסלייק - הסרה
        await http.delete(`/api/wishlist/remove/${id}`);
        setIsFavorite(false);
      }
    } catch (err) {
      alert("שגיאה בעדכון ההעדפות");
    }
  }

  if (loading) return (
    <div style={pageWrapperStyle}>
      <div style={{ textAlign: "center", marginTop: "5rem", fontSize: "1.5rem" }}>טוען מוצר...</div>
    </div>
  );

  if (!product) return (
    <div style={pageWrapperStyle}>
      <div style={{ textAlign: "center", marginTop: "5rem", fontSize: "1.5rem" }}>המוצר לא נמצא</div>
    </div>
  );

  const src = product.imageUrl ? normalizeImageUrl(product.imageUrl) : "";
  const activeGroup = product.groups?.find((g) => g.isActive === true);

  return (
    <div style={pageWrapperStyle}>
      <main style={mainContentStyle}>
        <button onClick={() => router.back()} style={backButtonStyle}> ← חזור </button>

        <div style={productContainerStyle}>
          <div style={imageSectionStyle}>
            {src && !imgError ? (
              <img src={src} alt={product.name} style={mainImageStyle} onError={() => setImgError("שגיאה בטעינת התמונה")} />
            ) : (
              <div style={{ opacity: 0.5 }}>{imgError || "אין תמונה זמינה"}</div>
            )}
          </div>

          <div style={detailsSectionStyle}>
            <h1 style={productTitleStyle}>{product.name}</h1>
            <span style={categoryBadgeStyle}>category: {product.category}</span>
            <div style={priceTagStyle}>₪{product.price}</div>

            {/* מערכת לייק/דיסלייק חדשה */}
            <div style={voteContainerStyle}>
              <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}> do you like the deal?</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => handleVote(true)} 
                  style={voteButtonStyle(isFavorite, 'like')}
                  title="לייק - הוסף למועדפים"
                >
                  👍 {isFavorite ? "" : ""}
                </button>
                <button 
                  onClick={() => handleVote(false)} 
                  style={voteButtonStyle(!isFavorite && product, 'dislike')}
                  title="דיסלייק - הסר מהמועדפים"
                >
                  👎
                </button>
              </div>
            </div>

            {activeGroup && (
              <div style={activeGroupLabelStyle}>
                <span style={{ color: "#555" }}>In active group: </span>
                <span style={activeLinkStyle} onClick={() => router.push("/")}>
                  {activeGroup.name}
                </span>
              </div>
            )}

            <div style={dividerStyle} />
            <p style={descriptionStyle}>{product.description || "מוצר איכותי מבית Buyforce."}</p>
            <div style={infoBoxStyle}><strong>מלאי זמין:</strong> {product.stock} יחידות</div>

            <button onClick={() => router.push("/")} style={actionButtonStyle}>
              חזור לרשימת הקבוצות
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Styles ---
const pageWrapperStyle = { minHeight: "100vh", backgroundColor: "#f4f7f6", direction: "ltr" };
const mainContentStyle = { padding: "2rem 1rem", maxWidth: "1100px", margin: "0 auto" };
const backButtonStyle = { background: "none", border: "none", color: "#228be6", fontWeight: "700", cursor: "pointer", marginBottom: "1rem" };
const productContainerStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2.5rem", backgroundColor: "#fff", padding: "2rem", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" };
const imageSectionStyle = { borderRadius: "15px", overflow: "hidden", backgroundColor: "#f8f9fa", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" };
const mainImageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const detailsSectionStyle = { display: "flex", flexDirection: "column", gap: "1rem" };
const categoryBadgeStyle = { backgroundColor: "#e7f5ff", color: "#228be6", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", width: "fit-content", textTransform: "uppercase" };
const productTitleStyle = { fontSize: "2.5rem", fontWeight: "900", margin: "0", color: "#111" };
const priceTagStyle = { fontSize: "2rem", fontWeight: "700", color: "#228be6" };
const dividerStyle = { height: "1px", backgroundColor: "#eee", margin: "0.5rem 0" };
const descriptionStyle = { fontSize: "1.1rem", lineHeight: "1.6", color: "#555" };
const infoBoxStyle = { backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "8px", fontSize: "0.95rem" };
const actionButtonStyle = { marginTop: "1rem", padding: "15px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "800", cursor: "pointer" };
const activeGroupLabelStyle = { fontSize: "1rem", fontWeight: "600", backgroundColor: "#f0f7ff", padding: "10px 15px", borderRadius: "10px", border: "1px solid #d0e7ff", width: "fit-content", marginTop: "5px" };
const activeLinkStyle = { color: "#228be6", cursor: "pointer", fontWeight: "bold", textDecoration: "underline", marginLeft: "5px" };

const voteContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  backgroundColor: "#fcfcfc",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #f0f0f0",
  width: "fit-content"
};

const voteButtonStyle = (active, type) => ({
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  transition: "all 0.2s ease",
  border: active ? "none" : "1px solid #ddd",
  backgroundColor: active 
    ? (type === 'like' ? "#40c057" : "#fa5252") 
    : "#fff",
  color: active ? "#fff" : "#555",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  boxShadow: active ? "0 4px 10px rgba(0,0,0,0.15)" : "none"
});