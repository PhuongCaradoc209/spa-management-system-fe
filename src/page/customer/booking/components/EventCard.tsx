const EventCard = ({ eventInfo }: any) => {
  const { title, extendedProps, start } = eventInfo.event;
  const { therapist, status } = extendedProps;
  const timeString =
    start?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) || "";

  const isCompleted = status === "completed";

  return (
    <div className="py-3 px-1.5 overflow-hidden bg-red-300 m-2 rounded-lg">
      <div className="flex justify-between items-center text-[10px] opacity-70">
        <span className="font-semibold">{timeString}</span>
        <span className="w-2.5 h-2.5 text-[8px] font-bold rounded-full flex justify-center items-center bg-yellow-300 text-black">
          {isCompleted && "✓"}
        </span>
      </div>
      <div className="font-bold text-xs truncate mt-0.5">{title}</div>
      <div className="text-[10px] opacity-70 mt-0.5 truncate">{therapist}</div>
    </div>
  );
};

export default EventCard;
