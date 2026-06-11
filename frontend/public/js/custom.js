function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  let cart = getCart();
  let existing = cart.find(function(item) { return item.id === product.id; });
  if (existing) {
    existing.qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }
  saveCart(cart);
}

function updateQty(productId, delta) {
  let cart = getCart();
  let item = cart.find(function(i) { return i.id === productId; });
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(function(i) { return i.id !== productId; });
    }
  }
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce(function(sum, item) { return sum + item.qty; }, 0);
}

function updateCartBadge() {
  var count = getCartCount();
  var badges = document.querySelectorAll('.cart-badge');
  for (var i = 0; i < badges.length; i++) {
    var prev = parseInt(badges[i].textContent, 10) || 0;
    badges[i].textContent = count;
    badges[i].style.display = count > 0 ? 'flex' : 'none';
    if (count > prev) {
      badges[i].classList.remove('bump');
      void badges[i].offsetWidth;
      badges[i].classList.add('bump');
    }
  }
}

function getStore() {
  var s = getUrlParam('store') || localStorage.getItem('currentStore') || '';
  if (s) localStorage.setItem('currentStore', s);
  return s;
}

function fetchProducts() {
  var store = getStore();
  var url = '/api/public/products';
  if (store) url += '?store=' + encodeURIComponent(store);
  return fetch(url)
    .then(function(response) { return response.json(); })
    .catch(function(error) {
      console.error('Error fetching products:', error);
      return [];
    });
}

function getUrlParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/* ---- Unified toast (with optional icon) ---- */
var __toastTimer = null;
function showToast(msg, icon) {
  // If page defines its own showToast, use that instead
  if (typeof window.__customShowToast === 'function' && arguments.callee !== window.__customShowToast) {
    return window.__customShowToast(msg, icon);
  }
  var el = document.getElementById('fk-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fk-toast';
    el.className = 'fk-toast';
    document.body.appendChild(el);
  }
  if (icon) {
    el.innerHTML = '<span class="t-icon">' + icon + '</span><span class="t-msg">' + msg + '</span>';
  } else {
    el.innerHTML = '<span class="t-msg">' + msg + '</span>';
  }
  el.classList.add('on');
  if (__toastTimer) clearTimeout(__toastTimer);
  __toastTimer = setTimeout(function(){ el.classList.remove('on'); }, 2200);
}

/* ---- Button loading spinner ---- */
function btnLoading(btn, on, label) {
  if (!btn) return;
  if (on) {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span> ' + (label || 'Please wait...');
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.label || label || 'Submit';
  }
}

/* ---- Frontend protection (right-click, F12, Ctrl+U, Ctrl+S, devtools) ---- */
!function(){document.addEventListener('contextmenu',function(e){e.preventDefault()}),document.addEventListener('keydown',function(e){if(e.key==='F12'||e.keyCode===123)return e.preventDefault(),!1;if(e.ctrlKey&&(e.key==='u'||e.key==='U'))return e.preventDefault(),!1;if(e.ctrlKey&&(e.key==='s'||e.key==='S'))return e.preventDefault(),!1;if(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='i'))return e.preventDefault(),!1;if(e.ctrlKey&&e.shiftKey&&(e.key==='J'||e.key==='j'))return e.preventDefault(),!1;if(e.ctrlKey&&e.shiftKey&&(e.key==='C'||e.key==='c'))return e.preventDefault(),!1})}();

document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
});
