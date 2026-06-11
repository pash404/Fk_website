export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadgeClass(status) {
  const map = {
    ACTIVE: 'badge-success',
    INACTIVE: 'badge-danger',
    OUT_OF_STOCK: 'badge-warning',
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-info',
    PROCESSING: 'badge-info',
    SHIPPED: 'badge-info',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger',
    RETURNED: 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
}

export function truncate(str, length = 50) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
