import type { EventContentArg } from "@fullcalendar/core";

interface EventCardProps {
  eventInfo: EventContentArg;
}

// 1. Danh sách bảng màu "Deep & Pastel" phù hợp làm nền cho chữ trắng.
// Mình chọn các tông màu đậm, trầm ấm để text trắng bên trong nổi bật và sắc nét.
const CARD_PALETTE = [
  "#2d4b4e",
  "#3e6658",
  "#784f25",
  "#8c5e2d",
  "#4a3f5f",
  "#5f3f4a",
  "#3f4f5f",
  "#5a6b5a",
];

const getStableColorFromString = (identifier: string) => {
  let hash = 0;
  for (let i = identifier.length - 1; i >= 0; i--) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % CARD_PALETTE.length;
  return CARD_PALETTE[index];
};

const EventCard = ({ eventInfo }: EventCardProps) => {
  const { title, extendedProps, start, id } = eventInfo.event;
  const { therapist, status } = extendedProps;

  // Định dạng giờ
  const timeString =
    start?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) || "";

  const bgColor = getStableColorFromString(id || title);
  const isCompleted = status === "completed" || status === "paid";
  const isPending = status === "upcoming";

  let statusDotClass = "";
  if (isPending) {
    statusDotClass = "bg-yellow-300";
  } else if (isCompleted) {
    statusDotClass = "bg-emerald-300";
  } else {
    statusDotClass = "bg-gray-400";
  }

  return (
    <div
      className="p-3 overflow-hidden m-2 rounded-xl text-white shadow-inner flex flex-col gap-1.5 border border-black/5"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header (Giờ + Dấu tích) */}
      <div className="flex justify-between items-center text-[11px] opacity-80">
        <span className="font-bold tracking-tight">{timeString}</span>
        {/* Render Chấm trạng thái động */}
        <span
          className={`w-2 h-2 text-[9px] font-bold rounded-full flex justify-center items-center text-gray-800 ${statusDotClass}`}
        >
          {isCompleted && "✓"}
        </span>
      </div>

      {/* Tên dịch vụ (Title) */}
      <div className="font-extrabold text-[13px] leading-tight truncate">
        {title}
      </div>

      {/* Tên Therapist */}
      <div className="text-[11px] opacity-80 truncate font-semibold">
        {therapist}
      </div>
    </div>
  );
};

export default EventCard;
