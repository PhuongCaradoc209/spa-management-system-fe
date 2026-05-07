export type TherapistStatus = "AVAILABLE" | "OFF DUTY";

export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  services?: { id: string; name: string }[];
  appointmentCount?: number; // Đã được inject từ Promise.all ở Page
  isAvailable: boolean;
}

const STATUS_STYLES: Record<TherapistStatus, string> = {
  AVAILABLE: "bg-[#d4edda] text-[#276c3b]",
  "OFF DUTY": "bg-[#e9e9e9] text-[#555]",
};

const AVATAR_COLORS = [
  "#6BAE95",
  "#6E9CB8",
  "#E8A87C",
  "#8E84C0",
  "#D48A8A",
  "#5A9A8A",
  "#F4A261",
  "#2A9D8F",
  "#E76F51",
  "#264653",
  "#e07a5f",
  "#81b29a",
  "#f2cc8f",
  "#3d5a80",
  "#98c1d9",
];

const getAvatarColor = (identifier: string) => {
  let hash = 0;
  for (let i = identifier.length - 1; i >= 0; i--) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const TherapistCard = ({
  therapist,
  onClick,
}: {
  therapist: Therapist;
  onClick?: () => void;
}) => {
  const firstInitial = therapist.firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = therapist.lastName?.charAt(0)?.toUpperCase() || "";
  const initials = `${firstInitial}${lastInitial}` || "?";

  const bgColor = getAvatarColor(therapist.id || therapist.firstName);

  const currentStatus: TherapistStatus = therapist.isAvailable
    ? "AVAILABLE"
    : "OFF DUTY";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">
              {therapist.firstName} {therapist.lastName}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {therapist.phone || "No phone number"}
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_STYLES[currentStatus]}`}
        >
          {currentStatus}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {therapist.services?.map((service) => (
          <span
            key={service.id}
            className="text-[11px] bg-[#f0f4f2] text-[#3e6658] px-2.5 py-1 rounded-full font-medium"
          >
            {service.name}
          </span>
        ))}
        {(!therapist.services || therapist.services.length === 0) && (
          <span className="text-[11px] text-gray-400 italic py-1">
            General Therapist
          </span>
        )}
      </div>

      {/* Footer GỌN GÀNG HƠN */}
      <div className="flex items-center justify-end text-xs pt-2 border-t border-gray-50 mt-auto">
        <span className="font-semibold text-[#8c5e2d] bg-[#8c5e2d]/10 px-3 py-1 rounded-lg">
          {therapist.appointmentCount || 0} Appointments
        </span>
      </div>
    </div>
  );
};

export default TherapistCard;
