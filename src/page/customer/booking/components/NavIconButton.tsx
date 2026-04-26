const NavIconButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 flex justify-center rounded-full hover:bg-gray-200 transition text-gray-600"
  >
    {children}
  </button>
);

export default NavIconButton