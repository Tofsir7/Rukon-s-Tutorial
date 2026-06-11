const EmptyState = ({ title, message, icon = '📭' }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {message && <p className="text-gray-500 mt-1">{message}</p>}
  </div>
);

export default EmptyState;
