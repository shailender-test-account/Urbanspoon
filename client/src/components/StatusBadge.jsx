const styles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function StatusBadge({ status }) {
  return <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
}
