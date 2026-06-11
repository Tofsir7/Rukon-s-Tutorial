import { getStatusColor } from '../utils/constants';

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}>
    {status}
  </span>
);

export default StatusBadge;
