'use client';

import { useState, useEffect, useRef } from 'react';
import StoreProductCard from './StoreProductCard';

export default function StoreSearch({ visible, onClose, products, wishlist, onWishlistToggle }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(function () { inputRef.current.focus(); }, 80);
      setQuery('');
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    var q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    var res = products.filter(function (p) {
      return (p.name || '').toLowerCase().indexOf(q) > -1;
    });
    setResults(res);
  }, [query, products]);

  if (!visible) return null;

  return (
    <div id="srch-overlay" style={{ display: 'block' }}>
      <div className="srch-top">
        <span className="sb-back" onClick={onClose}>
          <i className="fa fa-arrow-left"></i>
        </span>
        <div className="sb-box">
          <i className="fa fa-search"></i>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, brands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div id="srch-grid">
        {query.trim() && results.length === 0 ? (
          <div className="srch-empty">
            <i className="fa fa-search"></i>
            <p>No results for "{query}"</p>
          </div>
        ) : (
          results.map((p) => (
            <StoreProductCard
              key={p.id}
              product={p}
              isWished={wishlist.indexOf(p.id) > -1}
              onWishlistToggle={onWishlistToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
