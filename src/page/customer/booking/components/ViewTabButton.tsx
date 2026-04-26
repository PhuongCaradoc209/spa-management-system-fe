const ViewTabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${
      isActive
        ? "bg-white shadow-md text-teal-800"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
);

export default ViewTabButton;
