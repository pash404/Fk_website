'use client';

export default function StoreBottomNav({ onOpenSearch, cartCount }) {
  return (
    <nav className="btm-nav">
      <a href="/" className="active" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 4l9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Home
      </a>
      <a href="#" onClick={(e) => { e.preventDefault(); onOpenSearch(); }}>
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Search
      </a>
      <a href="#">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Account
      </a>
      <a href="/store/cart" onClick={(e) => { e.preventDefault(); window.location.href = '/store/cart'; }} style={{ position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
          <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="bnav-badge cart-dge" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>{cartCount}</span>
        Cart
      </a>
    </nav>
  );
}
