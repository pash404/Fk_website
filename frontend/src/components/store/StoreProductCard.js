'use client';

export function seedNum(id, min, max) {
  if (!id) return min;
  var n = String(id).split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 7);
  return min + (n % (max - min + 1));
}

export default function StoreProductCard({ product, onWishlistToggle, isWished }) {
  const mrp = Number(product.mrp) || 0;
  const sp = Number(product.sellingPrice) || 0;
  const off = mrp > sp ? Math.round(((mrp - sp) / mrp) * 100) : 0;
  const rat = product.rating
    ? parseFloat(product.rating).toFixed(1)
    : (seedNum(product.id, 38, 49) / 10).toFixed(1);
  const rct = product.rating_count
    ? Number(product.rating_count).toLocaleString('en-IN')
    : seedNum(product.id, 120, 9800).toLocaleString('en-IN');
  const isTop = seedNum(product.id, 0, 4) > 2;
  const isFree = !product.delivery || product.delivery.toLowerCase().indexOf('free') > -1;

  return (
    <a className="prod-card" href={`/product-details.html?productId=${product.id}`} onClick={(e) => { e.preventDefault(); localStorage.setItem('viewProductId', product.id); window.location.href = '/product-details.html'; }}>
      <div className="pc-img">
        {off >= 5 ? <span className="pc-off-badge">{off}% off</span> : null}
        <div
          className="pc-wish"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
        >
          <i
            className={`fa ${isWished ? 'fa-heart' : 'fa-heart-o'}`}
            style={isWished ? { color: '#e53935' } : {}}
          ></i>
        </div>
        <img
          src={product.images?.[0] || 'https://placehold.co/148x148?text=No+Image'}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/148x148?text=No+Image'; }}
        />
      </div>
      <div className="pc-body">
        <div className="pc-name">{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span className="pc-stars">{rat} <i className="fa fa-star"></i></span>
          <span className="pc-rcount">({rct})</span>
          {isTop ? <span className="pc-assured">ASSURED</span> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="pc-price">&#8377;{sp.toLocaleString('en-IN')}</span>
          {mrp > sp ? <span className="pc-mrp">&#8377;{mrp.toLocaleString('en-IN')}</span> : null}
          {off >= 5 ? <span className="pc-poff">{off}% off</span> : null}
        </div>
        <div className="pc-delivery">{isFree ? '✓ Free Delivery' : product.delivery}</div>
      </div>
    </a>
  );
}
