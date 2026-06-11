const Alert = ({ type = 'error', message, onClose }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  if (!message) return null;

  return (
    <div className={`border rounded-lg p-4 mb-4 flex justify-between items-start ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-lg leading-none opacity-70 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
