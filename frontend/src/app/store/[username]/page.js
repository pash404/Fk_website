'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import StoreHeader from '@/components/store/StoreHeader';
import StoreBanner from '@/components/store/StoreBanner';
import StoreProductCard from '@/components/store/StoreProductCard';
import StoreBottomNav from '@/components/store/StoreBottomNav';
import StoreSearch from '@/components/store/StoreSearch';
import StoreToast, { showToast } from '@/components/store/StoreToast';

var catKeywords = {
  mobile: ['mobile','smartphone','phone','iphone','galaxy','redmi','realme','oppo','vivo','oneplus','pixel','samsung','xiaomi','mi ','infinix','techno','nokia'],
  fashion: ['fashion','shirt','t-shirt','tshirt','jeans','dress','shoe','sneaker','wear','clothing','trouser','short','jacket','coat','sweater','hoodie','kurta','saree','lehenga','tracksuit','watch'],
  electronics: ['electronics','headphone','earphone','earbud','speaker','charger','cable','adapter','bluetooth','router','keyboard','mouse','laptop','hard drive','pendrive','monitor'],
  home: ['home','furniture','lamp','decor','cushion','curtain','towel','bed','sofa','table','chair','shelf','mat','clock','showpiece'],
  appliance: ['appliance','fridge','refrigerator','washing','machine','microwave','oven','toaster','mixer','grinder','ac','air conditioner','cooler','fan','iron','kettle','vacuum','chimney','water purifier'],
  beauty: ['beauty','makeup','cream','lotion','shampoo','soap','perfume','deodorant','lipstick','nail','skincare','hair','face wash','sunscreen','body wash'],
  toy: ['toy','game','puzzle','doll','lego','board game','car','remote','action figure','playset'],
  bike: ['bike','bicycle','cycle','helmet','riding','gear','accessories','tyre'],
  grocery: ['grocery','food','snack','oil','rice','wheat','spice','tea','coffee','biscuit','cereal','dry fruit','nuts','honey']
};

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) { return []; }
}
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }
function getCartCount() {
  return getCart().reduce(function (a, i) { return a + (i.qty || 1); }, 0);
}
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('store_wishlist') || '[]'); } catch (e) { return []; }
}
function saveWishlist(w) { localStorage.setItem('store_wishlist', JSON.stringify(w)); }

export default function StorePage() {
  var { username } = useParams();
  var [store, setStore] = useState(null);
  var [products, setProducts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [activeCat, setActiveCat] = useState('');
  var [searchOpen, setSearchOpen] = useState(false);
  var [wishlist, setWishlist] = useState([]);
  var [cartCount, setCartCount] = useState(0);
  var [timerStr, setTimerStr] = useState('--:--:--');

  useEffect(function () {
    setWishlist(getWishlist());
    setCartCount(getCartCount());
  }, []);

  useEffect(function () {
    if (!username) return;
    setLoading(true);
    setError(null);

    Promise.all([
      api.get('/public/store/' + username),
      api.get('/public/store/' + username + '/products'),
      api.get('/public/store/' + username + '/upi'),
    ])
      .then(function ([storeRes, productsRes]) {
        setStore(storeRes.data);
        setProducts(productsRes.data);
      })
      .catch(function (err) {
        setError(err.message || 'Store not found');
      })
      .finally(function () {
        setLoading(false);
      });
  }, [username]);

  useEffect(function () {
    var end = new Date();
    end.setHours(23, 59, 59, 0);
    function tick() {
      var d = Math.max(0, end - new Date());
      var h = Math.floor(d / 3600000);
      var m = Math.floor((d % 3600000) / 60000);
      var s = Math.floor((d % 60000) / 1000);
      setTimerStr(
        ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2)
      );
    }
    tick();
    var int = setInterval(tick, 1000);
    return function () { clearInterval(int); };
  }, []);

  var handleWishlistToggle = useCallback(function (pid) {
    setWishlist(function (prev) {
      var idx = prev.indexOf(pid);
      if (idx > -1) {
        var copy = prev.slice();
        copy.splice(idx, 1);
        saveWishlist(copy);
        showToast('Removed from wishlist');
        return copy;
      } else {
        saveWishlist(prev.concat([pid]));
        showToast('Saved to wishlist!');
        return prev.concat([pid]);
      }
    });
  }, []);

  var handleCategoryClick = useCallback(function (cat) {
    setActiveCat(function (prev) {
      if (prev === cat) return '';
      return cat;
    });
  }, []);

  var filteredProducts = products;
  if (activeCat) {
    var keywords = catKeywords[activeCat] || [activeCat];
    filteredProducts = products.filter(function (p) {
      var name = (p.name || '').toLowerCase();
      return keywords.some(function (k) { return name.indexOf(k) > -1; });
    });
    if (filteredProducts.length === 0) filteredProducts = products;
  }

  if (loading) {
    return (
      <>
        <div className="fk-header">
          <div className="fk-top">
            <div className="fk-logo"><span className="explore" style={{ fontSize: '14px', fontWeight: 700, fontStyle: 'normal', color: '#fff' }}>Store</span><span className="explore">Explore <em>Plus</em></span></div>
            <div className="fk-searchbar"><i className="fa fa-search"></i><span>Search for Products, Brands and More</span></div>
            <div className="fk-cart-icon"><i className="fa fa-shopping-cart"></i><span className="clabel">Cart</span></div>
          </div>
        </div>
        <div className="fk-section" style={{ marginTop: '0' }}>
          <div className="fk-section-head">
            <span className="sh-title">Deals of the Day</span>
          </div>
          <div className="prod-grid">
            {[1, 2, 3, 4].map(function (i) {
              return (
                <div key={i} className="skel-card">
                  <div className="skel skel-img"></div>
                  <div className="skel-body">
                    <div className="skel skel-line w80"></div>
                    <div className="skel skel-line w60"></div>
                    <div className="skel skel-line w45"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <StoreBottomNav onOpenSearch={function () {}} cartCount={0} />
      </>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6', gap: '12px', padding: '20px', fontFamily: 'Roboto,Arial,sans-serif' }}>
        <div style={{ fontSize: '64px', opacity: 0.5 }}>🏪</div>
        <h2 style={{ fontSize: '20px', color: '#212121', margin: 0 }}>Store not found</h2>
        <p style={{ fontSize: '14px', color: '#717478', margin: 0 }}>{error}</p>
        <a href="/" style={{ marginTop: '12px', color: '#2874f0', fontWeight: 500, textDecoration: 'none' }}>Go Home</a>
      </div>
    );
  }

  return (
    <>
      <StoreHeader
        onOpenSearch={function () { setSearchOpen(true); }}
        onCategoryClick={handleCategoryClick}
        activeCat={activeCat}
        cartCount={cartCount}
      />

      <StoreBanner
        images={[
          '/fk-images/banner1.jpg',
          '/fk-images/banner2.jpg',
          '/fk-images/banner3.jpg',
        ]}
      />

      <div className="store-info-bar">
        <div className="si-logo">
          {store?.logo ? (
            <img src={store.logo} alt={store.storeName} />
          ) : (
            (store?.storeName || 'S').charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="si-name">{store?.storeName || '@' + username}</div>
          <div className="si-user">@{username}</div>
        </div>
      </div>

      <div className="fk-section">
        <div className="fk-section-head">
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <span className="sh-title">Deals of the Day</span>
            <span className="sh-timer"><i className="fa fa-clock-o"></i>&nbsp;{timerStr}</span>
          </div>
          <span
            className="sh-viewall"
            onClick={function () { setActiveCat(''); }}
          >
            View All &rsaquo;
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#717478', fontSize: '14px' }}>
            <i className="fa fa-inbox" style={{ fontSize: '38px', color: '#e0e0e0', display: 'block', marginBottom: '10px' }}></i>
            <p>No products yet</p>
          </div>
        ) : (
          <div className="prod-grid">
            {filteredProducts.map(function (p) {
              return (
                <StoreProductCard
                  key={p.id}
                  product={p}
                  isWished={wishlist.indexOf(p.id) > -1}
                  onWishlistToggle={handleWishlistToggle}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="promo-strip">
        <img src="/fk-images/add.jpg" alt="Promo" onError={function (e) { e.target.parentElement.style.display = 'none'; }} />
      </div>

      <StoreSearch
        visible={searchOpen}
        onClose={function () { setSearchOpen(false); }}
        products={products}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
      />

      <StoreToast />
      <StoreBottomNav onOpenSearch={function () { setSearchOpen(true); }} cartCount={cartCount} />
    </>
  );
}
