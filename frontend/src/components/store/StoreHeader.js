'use client';

import { useRouter } from 'next/navigation';

const categories = [
  { key: 'mobile', label: 'Mobiles', bg: '#e8f4fd', svg: '<rect x="5" y="2" width="14" height="20" rx="2" fill="#1e88e5"/><circle cx="12" cy="18" r="1" fill="#fff"/><rect x="8" y="5" width="8" height="9" rx="1" fill="#fff" opacity=".9"/>' },
  { key: 'fashion', label: 'Fashion', bg: '#fce4ec', svg: '<path d="M12 3C10 3 8 4 8 4L4 7l2 2 1-1v10h10V8l1 1 2-2-4-3s-2-1-4-1z" fill="#e91e63"/><path d="M9 4.5C9 4.5 10.5 6 12 6s3-1.5 3-1.5" stroke="#c2185b" stroke-width="1" fill="none"/>' },
  { key: 'electronics', label: 'Electronics', bg: '#e8f5e9', svg: '<rect x="2" y="5" width="16" height="11" rx="1.5" fill="#43a047"/><rect x="7" y="16" width="6" height="2" fill="#26A541"/><rect x="5" y="18" width="10" height="1.5" rx=".5" fill="#26A541"/><rect x="4" y="7" width="12" height="7" rx="1" fill="#fff" opacity=".9"/><circle cx="20" cy="8" r="3" fill="#ff9800"/><path d="M19 8h2M20 7v2" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>' },
  { key: 'home', label: 'Home', bg: '#fff8e1', svg: '<path d="M3 12L12 4l9 8" fill="#ff8f00" stroke="#ef6c00" stroke-width=".5"/><path d="M5 11v8a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-8" fill="#ffb300"/><rect x="9" y="14" width="6" height="5" rx=".5" fill="#fff" opacity=".7"/>' },
  { key: 'appliance', label: 'Appliances', bg: '#f3e5f5', svg: '<rect x="3" y="5" width="18" height="14" rx="2" fill="#8e24aa"/><rect x="5" y="7" width="14" height="10" rx="1" fill="#fff" opacity=".15"/><circle cx="12" cy="12" r="4" stroke="#fff" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="1.5" fill="#fff"/><path d="M12 8v1M12 15v1M8 12h1M15 12h1" stroke="#fff" stroke-width="1" stroke-linecap="round"/>' },
  { key: 'beauty', label: 'Beauty', bg: '#fce4ec', svg: '<ellipse cx="12" cy="9" rx="4" ry="5" fill="#e91e63"/><rect x="10" y="13" width="4" height="6" rx="1" fill="#c2185b"/><path d="M8 7c0-2 1.5-4 4-4s4 2 4 4" fill="#f48fb1"/><ellipse cx="12" cy="9" rx="2.5" ry="3" fill="#f48fb1" opacity=".5"/>' },
  { key: 'toy', label: 'Toys', bg: '#e8f5e9', svg: '<circle cx="8" cy="15" r="4" fill="#43a047"/><circle cx="16" cy="15" r="4" fill="#e53935"/><rect x="7" y="6" width="10" height="6" rx="2" fill="#fb8c00"/><circle cx="10" cy="9" r="1" fill="#fff"/><circle cx="14" cy="9" r="1" fill="#fff"/>' },
  { key: 'bike', label: 'Two Wheelers', bg: '#e3f2fd', svg: '<circle cx="6" cy="16" r="4" stroke="#1e88e5" stroke-width="2" fill="none"/><circle cx="18" cy="16" r="4" stroke="#1e88e5" stroke-width="2" fill="none"/><path d="M6 16l3-6h5l3 6" stroke="#1e88e5" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 10l1-3h2" stroke="#1e88e5" stroke-width="1.5" stroke-linecap="round"/><circle cx="6" cy="16" r="1.5" fill="#1e88e5"/><circle cx="18" cy="16" r="1.5" fill="#1e88e5"/>' },
  { key: 'grocery', label: 'Grocery', bg: '#e8f5e9', svg: '<path d="M6 3h12l-1 9H7L6 3z" fill="#66bb6a"/><path d="M4 3h2l2 12h10l1-12h2" stroke="#43a047" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="9" cy="20" r="1.5" fill="#43a047"/><circle cx="16" cy="20" r="1.5" fill="#43a047"/><path d="M9 9h6M10 12h4" stroke="#fff" stroke-width="1" stroke-linecap="round"/>' },
];

export default function StoreHeader({ onOpenSearch, onCategoryClick, activeCat, cartCount }) {
  const router = useRouter();

  return (
    <header className="fk-header">
      <div className="fk-top">
        <a href="/" className="fk-logo" onClick={(e) => { e.preventDefault(); router.push('/'); }}>
          <span className="explore" style={{ fontSize: '14px', fontWeight: 700, fontStyle: 'normal', color: '#fff' }}>Store</span>
          <span className="explore">Explore <em>Plus</em></span>
        </a>
        <div className="fk-searchbar" onClick={onOpenSearch}>
          <i className="fa fa-search"></i>
          <span>Search for Products, Brands and More</span>
        </div>
        <a href="#" className="fk-cart-icon" onClick={(e) => { e.preventDefault(); router.push('/store/cart'); }}>
          <i className="fa fa-shopping-cart"></i>
          <span className="clabel">Cart</span>
          <span className="cart-badge cart-dge" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>{cartCount}</span>
        </a>
      </div>

      <div className="cat-row">
        <div className="cat-row-inner">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`cat-pill${activeCat === cat.key ? ' active' : ''}`}
              data-cat={cat.key}
              onClick={() => onCategoryClick(cat.key)}
            >
              <div className="cp-img" style={{ background: cat.bg }}>
                <svg viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: cat.svg }} />
              </div>
              <span className="cp-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
