export default function StatsCard({ title, value, icon, color = 'blue', trend, subtitle }) {
  const gradients = {
    blue: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600' },
    green: { bg: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
    purple: { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50 text-purple-600' },
    orange: { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-50 text-orange-600' },
    red: { bg: 'from-red-500 to-red-600', light: 'bg-red-50 text-red-600' },
    teal: { bg: 'from-teal-500 to-teal-600', light: 'bg-teal-50 text-teal-600' },
  };

  const g = gradients[color] || gradients.blue;

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{title}</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">{value}</p>
          {(trend || subtitle) && (
            <p className="text-xs font-medium text-gray-400 mt-1.5">{trend || subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.bg} flex items-center justify-center text-white text-lg shadow-lg ${g.bg.replace('from-', 'shadow-').replace('to-', '/30')} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${g.bg} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full`} />
    </div>
  );
}
