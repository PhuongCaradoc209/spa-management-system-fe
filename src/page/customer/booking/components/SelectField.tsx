import React from "react";

// Định nghĩa Props cho component
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[] | { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  ...restProps
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full appearance-none bg-white py-2.5 px-4 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 shadow-sm cursor-pointer"
          {...restProps}
        >
          {options.map((option, index) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return (
              <option key={index} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        {/* Icon mũi tên */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectField;
