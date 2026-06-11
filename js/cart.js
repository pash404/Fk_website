var FREE_DLV_THRESHOLD = 499;
var SAVED_COUPON = null;

function getSavedItems() {
  try{ return JSON.parse(localStorage.getItem('savedItems')||'[]'); }catch(e){return [];}
}
function saveSavedItems(arr) {
  localStorage.setItem('savedItems', JSON.stringify(arr));
}

function renderCart() {
  var cart = getCart();
  var container = document.getElementById('cart-items');
  var summary = document.getElementById('cart-summary');
  var emptyEl = document.getElementById('empty-cart');
  var countEl = document.getElementById('cart-page-count');

  if (!container) return;

  if (countEl) countEl.textContent = '(' + getCartCount() + ')';

  if (cart.length === 0) {
    container.innerHTML = '';
    if (summary) summary.style.display = 'none';
    var saved = getSavedItems();
    var itemsCol = document.querySelector('.cart-items-col');
    var summaryCol = document.querySelector('.cart-summary-col');
    if (saved.length > 0) {
      // Cart is empty but user has saved-for-later items.
      // Show a small inline banner instead of the centered empty-cart card.
      if (emptyEl) { emptyEl.classList.remove('empty-shown'); emptyEl.classList.add('empty-hidden'); emptyEl.style.display = 'none'; }
      if (itemsCol) { itemsCol.classList.remove('is-empty'); }
      if (summaryCol) summaryCol.style.display = 'none';
      // Render the banner with move-to-cart info
      var banner = document.getElementById('cart-empty-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'cart-empty-banner';
        banner.style.cssText = 'background:#fff;border-radius:6px;padding:18px 16px;margin-bottom:10px;box-shadow:0 1px 2px rgba(0,0,0,0.06);text-align:center';
        container.parentNode.insertBefore(banner, container.nextSibling);
      }
      banner.style.display = 'block';
      banner.innerHTML = '<div style="font-size:14px;color:#212121;font-weight:500;margin-bottom:4px">Your cart is empty</div>' +
        '<div style="font-size:12.5px;color:#717478">You have ' + saved.length + ' item' + (saved.length>1?'s':'') + ' saved for later below.</div>';
    } else {
      // Cart and saved are both empty -> show full centered empty state
      if (emptyEl) { emptyEl.classList.remove('empty-hidden'); emptyEl.classList.add('empty-shown'); emptyEl.style.display = ''; }
      if (itemsCol) itemsCol.classList.add('is-empty');
      if (summaryCol) summaryCol.style.display = 'none';
      var banner2 = document.getElementById('cart-empty-banner');
      if (banner2) banner2.style.display = 'none';
    }
    updateSummary();
    renderSavedItems();
    return;
  }

  if (emptyEl) { emptyEl.classList.remove('empty-shown'); emptyEl.classList.add('empty-hidden'); emptyEl.style.display = ''; }
  if (summary) summary.style.display = 'block';
  var itemsCol2 = document.querySelector('.cart-items-col');
  if (itemsCol2) itemsCol2.classList.remove('is-empty');
  var summaryCol2 = document.querySelector('.cart-summary-col');
  if (summaryCol2) summaryCol2.style.display = '';
  var banner3 = document.getElementById('cart-empty-banner');
  if (banner3) banner3.style.display = 'none';

  var html = '';
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var mrp = parseFloat(item.mrp);
    var selling = parseFloat(item.selling_price);
    var discount = mrp > selling ? Math.round((mrp - selling) / mrp * 100) : 0;
    var seller = item.seller || 'Martfy Retail';

    html += '<div class="cart-item-card" data-id="' + item.id + '">' +
      '<div class="cart-item-wrap">' +
        '<div class="ci-img-col">' +
          '<a href="product-details.html?productId=' + item.id + '">' +
            '<img src="' + item.img1 + '" alt="' + item.name + '" onerror="this.src=\'https://via.placeholder.com/80\'">' +
          '</a>' +
        '</div>' +
        '<div class="ci-info-col">' +
          '<a class="ci-name" href="product-details.html?productId=' + item.id + '">' + item.name + '</a>' +
          '<div class="ci-seller">Sold by <span>' + seller + '</span></div>' +
          '<div class="ci-price-row">' +
            '<span class="ci-selling">\u20B9' + selling + '</span>' +
            (mrp > selling ? '<span class="ci-mrp">\u20B9' + mrp + '</span>' : '') +
            (discount > 0 ? '<span class="ci-discount">' + discount + '% off</span>' : '') +
          '</div>' +
          '<div class="ci-delivery">Free Delivery</div>' +
          '<div class="ci-actions">' +
            '<div class="ci-qty">' +
              '<button class="cq-btn" onclick="changeQty(\'' + item.id + '\', -1)">-</button>' +
              '<span class="cq-val">' + item.qty + '</span>' +
              '<button class="cq-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
            '</div>' +
            '<button class="ci-remove" onclick="saveForLater(\'' + item.id + '\')" style="font-size:12px;color:#2874f0;font-weight:500;border:none;background:none;cursor:pointer;padding:4px 0">SAVE FOR LATER</button>' +
            '<button class="ci-remove" onclick="removeItem(\'' + item.id + '\')">REMOVE</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  container.innerHTML = html;
  updateSummary();
  renderSavedItems();
}

function removeItem(productId) {
  var card = document.querySelector('.cart-item-card[data-id="' + productId + '"]');
  if (card) {
    card.classList.add('cart-item-removing');
    setTimeout(function(){
      var cart = getCart().filter(function(i){ return i.id !== productId; });
      saveCart(cart);
      renderCart();
    }, 280);
  } else {
    var cart = getCart().filter(function(i) { return i.id !== productId; });
    saveCart(cart);
    renderCart();
  }
}

function changeQty(productId, delta) {
  updateQty(productId, delta);
  renderCart();
}

function saveForLater(productId) {
  var card = document.querySelector('.cart-item-card[data-id="' + productId + '"]');
  var doMove = function(){
    var cart = getCart();
    var idx = cart.findIndex(function(i) { return i.id === productId; });
    if (idx > -1) {
      var item = cart[idx];
      var saved = getSavedItems();
      var existing = saved.find(function(i) { return i.id === item.id; });
      if (!existing) {
        item.qty = 1;
        saved.push(item);
        saveSavedItems(saved);
      }
      cart.splice(idx, 1);
      saveCart(cart);
    }
    renderCart();
  };
  if (card) {
    card.classList.add('cart-item-removing');
    setTimeout(doMove, 280);
  } else {
    doMove();
  }
}

function moveToCart(productId) {
  var saved = getSavedItems();
  var idx = saved.findIndex(function(i) { return i.id === productId; });
  if (idx > -1) {
    var item = saved[idx];
    saved.splice(idx, 1);
    saveSavedItems(saved);
    addToCart(item);
  }
  renderCart();
}

function removeSaved(productId) {
  var saved = getSavedItems().filter(function(i) { return i.id !== productId; });
  saveSavedItems(saved);
  renderCart();
}

function renderSavedItems() {
  var saved = getSavedItems();
  var container = document.getElementById('saved-items');
  if (!container) return;
  if (saved.length === 0) { container.style.display = 'none'; return; }
  container.style.display = 'block';
  var html = '<div style="background:#fff;border-radius:4px;margin-top:10px;box-shadow:0 1px 2px rgba(0,0,0,0.08);overflow:hidden">' +
    '<div style="padding:12px 16px;font-size:14px;font-weight:600;color:#212121;border-bottom:1px solid #f0f0f0">Saved For Later (' + saved.length + ')</div>';
  for (var i = 0; i < saved.length; i++) {
    var item = saved[i];
    var sp = parseFloat(item.selling_price);
    html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f5f5f5">' +
      '<img src="' + (item.img1||'https://via.placeholder.com/48') + '" style="width:40px;height:50px;object-fit:contain;background:#fafafa;border-radius:4px;flex-shrink:0" alt="">' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:13px;color:#212121;line-height:1.3;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">' + item.name + '</div>' +
        '<div style="font-size:14px;font-weight:600;color:#212121;margin-top:2px">\u20B9' + sp + '</div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">' +
        '<button onclick="moveToCart(\'' + item.id + '\')" style="padding:6px 14px;background:#2874f0;color:#fff;border:none;border-radius:4px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap">MOVE TO CART</button>' +
        '<button onclick="removeSaved(\'' + item.id + '\')" style="padding:4px 14px;background:none;color:#717478;border:1px solid #e0e0e0;border-radius:4px;font-size:11px;cursor:pointer;white-space:nowrap">REMOVE</button>' +
      '</div>' +
    '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function updateSummary() {
  var cart = getCart();
  var totalMrp = 0;
  var totalDiscount = 0;
  var totalSelling = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var mrp = parseFloat(item.mrp) * item.qty;
    var selling = parseFloat(item.selling_price) * item.qty;
    totalMrp += mrp;
    totalSelling += selling;
    totalDiscount += (mrp - selling);
  }

  var couponDiscount = 0;
  if (SAVED_COUPON) {
    couponDiscount = calcCouponDiscount(SAVED_COUPON, totalSelling);
  }
  var finalTotal = totalSelling - couponDiscount;

  // Delivery progress bar (hidden — delivery is always free)
  var progEl = document.getElementById('dlv-progress');
  if (progEl) progEl.style.display = 'none';

  var itemsLabel = document.getElementById('pr-items-label');
  var totalMrpEl = document.getElementById('total-mrp');
  var discountEl = document.getElementById('total-discount');
  var totalEl = document.getElementById('total-amount');
  var saveEl = document.getElementById('save-msg');
  var chargeEl = document.getElementById('delivery-charge');
  var couponMsg = document.getElementById('coupon-msg');

  if (itemsLabel) itemsLabel.textContent = 'Price (' + getCartCount() + ' items)';
  if (totalMrpEl) totalMrpEl.textContent = '\u20B9' + totalMrp.toLocaleString('en-IN');
  if (discountEl) discountEl.textContent = '-\u20B9' + totalDiscount.toLocaleString('en-IN');
  if (chargeEl) {
    chargeEl.textContent = 'Free';
    chargeEl.style.color = '#26A541';
  }
  if (totalEl) totalEl.textContent = '\u20B9' + finalTotal.toLocaleString('en-IN');
  if (saveEl) saveEl.textContent = totalDiscount > 0 ? 'You will save \u20B9' + totalDiscount.toLocaleString('en-IN') + ' on this order' : '';

  if (couponMsg) {
    if (SAVED_COUPON) {
      couponMsg.style.display = 'block';
      couponMsg.innerHTML = '<i class="fa fa-check-circle"></i> Coupon <b>' + SAVED_COUPON + '</b> applied! You save \u20B9' + couponDiscount;
    } else {
      couponMsg.style.display = 'none';
    }
  }

  var btn = document.querySelector('.place-order-btn');
  if (btn) {
    btn.style.display = cart.length === 0 ? 'none' : 'block';
  }

  // Store final total for checkout
  localStorage.setItem('cartTotal', finalTotal);
}

/* ---- Coupon ---- */
var COUPONS = [
  { code: 'FLIP50', desc: '50% off on Fashion & Accessories', minOrder: 499, discountPct: 0.5, maxDiscount: 500 },
  { code: 'TECH200', desc: 'Flat ₹200 off on Electronics', minOrder: 999, discountFlat: 200 },
  { code: 'NEW100', desc: '₹100 off for first-time shoppers', minOrder: 299, discountFlat: 100 },
  { code: 'BANK5', desc: '5% Unlimited Cashback', minOrder: 0, discountPct: 0.05, maxDiscount: 750 }
];

function calcCouponDiscount(code, totalSelling) {
  for (var i = 0; i < COUPONS.length; i++) {
    if (COUPONS[i].code === code) {
      var c = COUPONS[i];
      if (totalSelling < c.minOrder) return 0;
      if (c.discountPct) {
        var d = Math.round(totalSelling * c.discountPct);
        if (c.maxDiscount && d > c.maxDiscount) d = c.maxDiscount;
        return d;
      }
      return c.discountFlat || 0;
    }
  }
  return 0;
}

function initCoupon() {
  var applyBtn = document.getElementById('coupon-apply');
  var input = document.getElementById('coupon-input');
  if (!applyBtn || !input) return;
  applyBtn.addEventListener('click', function() {
    var code = input.value.trim().toUpperCase();
    var shakeEl = function(el){
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    };
    if (!code) { alert('Enter a coupon code'); shakeEl(input); return; }
    btnLoading(applyBtn, true, 'Applying...');
    setTimeout(function(){
      var cart = getCart();
      var totalSelling = 0;
      for (var i = 0; i < cart.length; i++) {
        totalSelling += parseFloat(cart[i].selling_price) * cart[i].qty;
      }
      var disc = calcCouponDiscount(code, totalSelling);
      if (disc === 0) {
        btnLoading(applyBtn, false, 'Apply');
        alert('Invalid coupon code or minimum order not met. Try: FLIP50, TECH200, NEW100, BANK5');
        shakeEl(input);
        return;
      }
      SAVED_COUPON = code;
      localStorage.setItem('appliedCoupon', JSON.stringify({ code: code, discount: disc }));
      updateSummary();
      input.value = '';
      var msg = document.getElementById('coupon-msg');
      if (msg) { msg.style.display = 'block'; msg.innerHTML = '<i class="fa fa-check-circle"></i> Coupon <b>' + code + '</b> applied!'; }
      btnLoading(applyBtn, false, 'Apply');
    }, 600);
  });
}

function placeOrder(btn) {
  btnLoading(btn, true, 'Redirecting...');
  setTimeout(function(){ window.location.href = 'select-address.html'; }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
  renderCart();
  initCoupon();
});
