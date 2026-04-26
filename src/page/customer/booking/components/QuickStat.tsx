import React from "react";

interface QuickStatProps {
  label: string;
  count: number | string;
  bgColor?: string;
}

const QuickStat: React.FC<QuickStatProps> = ({
  label,
  count,
  bgColor
}) => {
  return (
    <div className={`flex justify-between items-center ${bgColor} py-3 px-4 rounded-xl`}>
      <span className="text-sm font-medium text-[#2d4b4e]">{label}</span>
      {/* Nối chuỗi biến badgeBgClass vào danh sách class mặc định */}
      <span
        className={`bg-[#3e6658] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full`}
      >
        {count}
      </span>
    </div>
  );
};

export default QuickStat;
