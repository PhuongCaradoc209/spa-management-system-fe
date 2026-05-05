import { CaretDownIcon } from "@phosphor-icons/react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps) => {
  const isActive = value !== options[0];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none pl-3 pr-8 py-2.5 rounded-full border text-xs font-semibold cursor-pointer outline-none transition-all ${
          isActive
            ? "border-[#3e6658] bg-[#3e6658] text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-[#3e6658]"
        }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === options[0] ? label : opt}
          </option>
        ))}
      </select>
      <CaretDownIcon
        size={16}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      />
    </div>
  );
};

export default FilterDropdown;
