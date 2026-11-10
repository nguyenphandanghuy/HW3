import React, { useState } from 'react';
import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer';

interface Product {
  id: string;
  title: string;
  priceVnd: number;
  discount: number;
  stock: number;
  image: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', title: 'Gaming Laptop', priceVnd: 24990000, discount: 24, stock: 4, image: '💻' },
  { id: '2', title: 'Wireless Headphones', priceVnd: 1290000, discount: 41, stock: 6, image: '🎧' },
  { id: '3', title: 'Smart Watch', priceVnd: 890000, discount: 40, stock: 2, image: '⌚' },
];

export const FlashSaleEngine: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  // Đếm ngược 5 phút (300.000 ms)
  const [targetTime] = useState(() => Date.now() + 300000);
  const { formattedTime } = usePubgAirdropTimer(targetTime);

  const formatVND = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleBuyNow = (product: Product) => {
    if (product.stock <= 0 || loadingIds[product.id]) return;

    // 1. Khoá nút & Trừ kho Lạc quan (Optimistic UI)
    setLoadingIds((prev) => ({ ...prev, [product.id]: true }));
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, stock: item.stock - 1 } : item
      )
    );

    // 2. Giả lập API call với 30% tỷ lệ bị 409 Conflict
    setTimeout(() => {
      const isConflict = Math.random() < 0.3;

      if (isConflict) {
        // 3. Rollback nếu có lỗi 409
        setProducts((prev) =>
          prev.map((item) =>
            item.id === product.id ? { ...item, stock: item.stock + 1 } : item
          )
        );
        alert(`❌ Error 409 Conflict! ${product.title} was looted by another user! State rolled back.`);
      } else {
        setToast(`Purchased ${product.title}`);
        setTimeout(() => setToast(null), 3000);
      }

      setLoadingIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#0b0e14', color: '#fff', padding: '40px 20px', fontFamily: 'sans-serif', borderRadius: 12, maxWidth: 900, margin: '20px auto' }}>
      
      {/* Notification Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, backgroundColor: '#10B981', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold' }}>
          ✅ {toast}
        </div>
      )}

      {/* Hero Banner */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ color: '#EAB308', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 }}>LIMITED TIME • LIMITED STOCK</div>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Big Deals.<br />Small Quantities.</h1>
        <p style={{ color: '#9CA3AF' }}>Your chance to grab premium products at unbeatable prices.</p>
        
        {/* Anti-Drift Timer Display */}
        <div style={{ backgroundColor: '#161b26', display: 'inline-block', padding: '15px 30px', borderRadius: 12, marginTop: 15, border: '1px solid #2d3748' }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>TIME REMAINING</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{formattedTime}</div>
          <button style={{ backgroundColor: '#EAB308', color: '#000', border: 'none', padding: '6px 16px', borderRadius: 6, fontWeight: 'bold', marginTop: 10 }}>
            Sale in Progress
          </button>
        </div>
      </div>

      {/* Product List */}
      <h3>Today's Hot Deals</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        {products.map((p) => {
          const isSoldOut = p.stock === 0;
          const isLoading = !!loadingIds[p.id];

          return (
            <div key={p.id} style={{ backgroundColor: '#161b26', padding: 20, borderRadius: 12, border: '1px solid #2d3748', opacity: isSoldOut ? 0.6 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ backgroundColor: '#EAB308', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 'bold', fontSize: 12 }}>-{p.discount}%</span>
                <span style={{ fontSize: 12, color: isSoldOut ? '#EF4444' : '#9CA3AF' }}>{isSoldOut ? 'SOLD OUT' : `${p.stock} left`}</span>
              </div>

              <div style={{ fontSize: 50, textAlign: 'center', margin: '10px 0' }}>{p.image}</div>
              <div style={{ color: '#EAB308', fontSize: 10, fontWeight: 'bold' }}>FLASH SALE EXCLUSIVE</div>
              <h4 style={{ margin: '5px 0' }}>{p.title}</h4>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#EAB308', marginBottom: 15 }}>{formatVND(p.priceVnd)}</div>

              <button
                disabled={isSoldOut || isLoading}
                onClick={() => handleBuyNow(p)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 6,
                  border: 'none',
                  fontWeight: 'bold',
                  backgroundColor: isSoldOut ? '#374151' : '#EAB308',
                  color: isSoldOut ? '#9CA3AF' : '#000',
                  cursor: isSoldOut || isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isSoldOut ? 'Sold Out' : isLoading ? 'Processing...' : 'Buy Now →'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};