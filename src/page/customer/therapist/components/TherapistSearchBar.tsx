import { CaretDownIcon, XIcon } from "@phosphor-icons/react";

interface TherapistSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const TherapistSearchBar = ({ value, onChange }: TherapistSearchBarProps) => {
  return (
    <div className="relative w-full">
      <CaretDownIcon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search therapist..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-9 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#3e6658] focus:ring-2 focus:ring-[#3e6658]/10 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
};

export default TherapistSearchBar;
