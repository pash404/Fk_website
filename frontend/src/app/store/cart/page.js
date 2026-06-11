'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) { return []; }
}
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

export default function CartPage() {
  var [cart, setCart] = useState([]);

  useEffect(function () {
    setCart(getCart());
  }, []);

  var total = cart.reduce(function (s, i) { return s + (i.price || 0) * (i.qty || 1); }, 0);

  function removeItem(id) {
    var c = getCart().filter(function (i) { return i.id !== id; });
    saveCart(c);
    setCart(c);
  }

  function changeQty(id, delta) {
    var c = getCart().map(function (i) {
      if (i.id !== id) return i;
      var q = (i.qty || 1) + delta;
      if (q < 1) return null;
      return { ...i, qty: q };
    }).filter(Boolean);
    saveCart(c);
    setCart(c);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f3f6', fontFamily: 'Roboto,Arial,sans-serif' }}>
      <div style={{ background: '#2874f0', color: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: '#fff', fontSize: '18px' }}>
          <i className="fa fa-arrow-left"></i>
        </Link>
        <span style={{ fontSize: '17px', fontWeight: 500 }}>My Cart</span>
        <span style={{ fontSize: '13px', opacity: 0.85, marginLeft: 'auto' }}>{cart.length} items</span>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '14px', padding: '10px 12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: 0 }}>
          {cart.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: '48px 24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', color: '#212121', margin: '16px 0 8px' }}>Your cart is empty!</h3>
              <p style={{ fontSize: '13px', color: '#717478', marginBottom: '20px' }}>Shop now and add items to your cart</p>
              <Link href="/" style={{ display: 'inline-block', padding: '12px 32px', background: '#fb641b', color: '#fff', fontSize: '14px', fontWeight: 600, borderRadius: '4px', textTransform: 'uppercase', textDecoration: 'none' }}>
                Shop Now
              </Link>
            </div>
          ) : (
            cart.map(function (item) {
              return (
                <div key={item.id} style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', marginBottom: '10px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '14px 16px' }}>
                    <div style={{ width: '90px', flexShrink: 0 }}>
                      <img src={item.image || item.images?.[0] || 'https://placehold.co/90x112?text=No+Image'} alt={item.name} style={{ width: '100%', height: '112px', objectFit: 'contain', background: '#fafafa', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '14px', color: '#212121', lineHeight: 1.4 }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>&#8377;{(item.price || item.sellingPrice || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                          <button onClick={function () { changeQty(item.id, -1); }} style={{ width: '30px', height: '30px', border: 'none', background: '#f5f5f5', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>-</button>
                          <span style={{ width: '36px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>{item.qty || 1}</span>
                          <button onClick={function () { changeQty(item.id, 1); }} style={{ width: '30px', height: '30px', border: 'none', background: '#f5f5f5', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>+</button>
                        </div>
                        <button onClick={function () { removeItem(item.id); }} style={{ fontSize: '12px', color: '#717478', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', letterSpacing: '0.3px' }}>REMOVE</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ width: '320px', flexShrink: 0, background: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', position: 'sticky', top: '70px' }}>
            <div style={{ padding: '12px 16px 10px', fontSize: '13px', fontWeight: 600, color: '#717478', borderBottom: '1px solid #f0f0f0', letterSpacing: '0.5px' }}>PRICE DETAILS</div>
            <div style={{ padding: '8px 16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
                <span style={{ color: '#666' }}>Price ({cart.length} items)</span>
                <span style={{ fontWeight: 500, color: '#212121' }}>&#8377;{total.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
                <span style={{ color: '#666' }}>Delivery</span>
                <span style={{ fontWeight: 500, color: '#26A541' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', borderTop: '1px dashed #e0e0e0', marginTop: '4px', paddingTop: '12px', paddingBottom: '12px' }}>
                <span style={{ fontWeight: 600, color: '#212121', fontSize: '15px' }}>Total Amount</span>
                <span style={{ fontWeight: 700, color: '#212121', fontSize: '15px' }}>&#8377;{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div style={{ padding: '0 16px 8px', fontSize: '13px', color: '#26A541', fontWeight: 500 }}>
              You will save &#8377;{total.toLocaleString('en-IN')} on this order
            </div>
            <button style={{ display: 'block', width: 'calc(100% - 32px)', margin: '8px 16px 16px', padding: '14px', background: '#fb641b', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, borderRadius: '4px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.5px' }}>
              PLACE ORDER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
