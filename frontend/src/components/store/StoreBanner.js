'use client';

export default function StoreBanner({ images }) {
  const banners = images && images.length > 0 ? images : [];

  if (banners.length === 0) return null;

  return (
    <div className="banner-section">
      <div id="mainBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3500">
        <div className="carousel-indicators">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#mainBanner"
              data-bs-slide-to={i}
              className={i === 0 ? 'active' : ''}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {banners.map((src, i) => (
            <div key={i} className={`carousel-item${i === 0 ? ' active' : ''}`}>
              <img src={src} alt={`Banner ${i + 1}`} onError={(e) => { e.target.closest('.carousel-item').style.display = 'none'; }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
