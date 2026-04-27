import { StarIcon } from "@phosphor-icons/react";

export type TherapistStatus = "AVAILABLE" | "IN SESSION" | "OFF DUTY";

export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  appointmentCount: number;
  status: TherapistStatus;
  avatarColor: string;
}

const STATUS_STYLES: Record<TherapistStatus, string> = {
  AVAILABLE: "bg-[#d4edda] text-[#276c3b]",
  "IN SESSION": "bg-[#cce4f0] text-[#1a5c82]",
  "OFF DUTY": "bg-[#e9e9e9] text-[#555]",
};

const TherapistCard = ({
  therapist,
  onClick,
}: {
  therapist: Therapist;
  onClick?: () => void;
}) => {
  const initials = `${therapist.firstName[0]}${therapist.lastName[0]}`;

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
            style={{ backgroundColor: therapist.avatarColor }}
          >
            {initials}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">
              {therapist.firstName} {therapist.lastName}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {therapist.phone}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_STYLES[therapist.status]}`}
        >
          {therapist.status}
        </span>
      </div>

      {/* Specializations */}
      <div className="flex flex-wrap gap-1.5">
        {therapist.specializations.map((spec) => (
          <span
            key={spec}
            className="text-[11px] bg-[#f0f4f2] text-[#3e6658] px-2.5 py-1 rounded-full font-medium"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
        <div className="flex items-center gap-1 font-semibold text-gray-700">
          <StarIcon size={14} weight="fill" className="text-amber-400" />
          <span>{therapist.rating.toFixed(1)}</span>
          <span className="text-gray-400 font-normal">
            ({therapist.reviewCount})
          </span>
        </div>
        <span>{therapist.appointmentCount} appts</span>
      </div>
    </div>
  );
};

export default TherapistCard;
