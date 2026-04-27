import { useMemo, useState } from "react";
import {
  StarIcon,
  SortAscendingIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react";
import TherapistCard, { type Therapist } from "./components/TherapistCard";
import TherapistSearchBar from "./components/TherapistSearchBar";
import FilterDropdown from "./components/FilterDropdown";

const MOCK_THERAPISTS: Therapist[] = [
  {
    id: "1",
    firstName: "Elena",
    lastName: "Vance",
    phone: "+1 (555) 012-3456",
    specializations: ["Aromatherapy", "Deep Tissue"],
    rating: 4.9,
    reviewCount: 142,
    appointmentCount: 120,
    status: "AVAILABLE",
    avatarColor: "#6BAE95",
  },
  {
    id: "2",
    firstName: "Marcus",
    lastName: "Thorne",
    phone: "+1 (555) 098-7654",
    specializations: ["Sports Massage", "Hot Stone"],
    rating: 4.8,
    reviewCount: 89,
    appointmentCount: 215,
    status: "IN SESSION",
    avatarColor: "#6E9CB8",
  },
  {
    id: "3",
    firstName: "Hannah",
    lastName: "Price",
    phone: "+1 (555) 443-2211",
    specializations: ["Skin Care", "Aesthetics"],
    rating: 5.0,
    reviewCount: 204,
    appointmentCount: 432,
    status: "OFF DUTY",
    avatarColor: "#E8A87C",
  },
  {
    id: "4",
    firstName: "Julian",
    lastName: "Reed",
    phone: "+1 (555) 321-7654",
    specializations: ["Reflexology", "Swedish"],
    rating: 4.7,
    reviewCount: 65,
    appointmentCount: 98,
    status: "AVAILABLE",
    avatarColor: "#8E84C0",
  },
  {
    id: "5",
    firstName: "Sofia",
    lastName: "Hartman",
    phone: "+1 (555) 210-9988",
    specializations: ["Hot Stone", "Aromatherapy"],
    rating: 4.6,
    reviewCount: 77,
    appointmentCount: 154,
    status: "AVAILABLE",
    avatarColor: "#D48A8A",
  },
  {
    id: "6",
    firstName: "Leo",
    lastName: "Nakamura",
    phone: "+1 (555) 887-3300",
    specializations: ["Deep Tissue", "Sports Massage"],
    rating: 4.9,
    reviewCount: 120,
    appointmentCount: 301,
    status: "IN SESSION",
    avatarColor: "#5A9A8A",
  },
];

const ALL_SPECIALIZATIONS = [
  "All Specializations",
  "Aromatherapy",
  "Deep Tissue",
  "Sports Massage",
  "Hot Stone",
  "Skin Care",
  "Aesthetics",
  "Reflexology",
  "Swedish",
];

const ALL_STATUSES: string[] = [
  "All Status",
  "AVAILABLE",
  "IN SESSION",
  "OFF DUTY",
];

type SortKey = "rating" | "appointments";

// Summary card (sidebar)
const SummaryChip = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div
    className={`flex items-center justify-between rounded-xl px-4 py-3 ${color}`}
  >
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span className="font-bold text-gray-800">{count}</span>
  </div>
);

// Main Page
const TherapistPage = () => {
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All Specializations");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    return MOCK_THERAPISTS.filter((t) => {
      const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(search.toLowerCase()) ||
        t.specializations.some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        );
      const matchSpec =
        specFilter === "All Specializations" ||
        t.specializations.includes(specFilter);
      const matchStatus =
        statusFilter === "All Status" || (t.status as string) === statusFilter;
      return matchSearch && matchSpec && matchStatus;
    }).sort((a, b) =>
      sortKey === "rating"
        ? b.rating - a.rating
        : b.appointmentCount - a.appointmentCount,
    );
  }, [search, specFilter, statusFilter, sortKey]);

  const available = MOCK_THERAPISTS.filter(
    (t) => t.status === "AVAILABLE",
  ).length;
  const inSession = MOCK_THERAPISTS.filter(
    (t) => t.status === "IN SESSION",
  ).length;
  const offDuty = MOCK_THERAPISTS.filter((t) => t.status === "OFF DUTY").length;

  return (
    <div className="pt-32 pb-24 mx-24 lg:mx-32 flex flex-col lg:flex-row gap-6 text-black">
      {/* Sidebar */}
      <aside className="flex flex-col gap-4 w-full lg:w-64 shrink-0 rounded-2xl p-6 bg-surface-container-low h-fit">
        <div>
          <h3 className="font-bold text-[#2d4b4e] mb-3 text-lg">Overview</h3>
          <div className="flex flex-col gap-2">
            <SummaryChip
              label="Available"
              count={available}
              color="bg-[#d4edda]"
            />
            <SummaryChip
              label="In Session"
              count={inSession}
              color="bg-[#cce4f0]"
            />
            <SummaryChip
              label="Off Duty"
              count={offDuty}
              color="bg-[#e9e9e9]"
            />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#2d4b4e] mb-3 text-lg">Sort By</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSortKey("rating")}
              className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                sortKey === "rating"
                  ? "bg-[#3e6658] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <StarIcon
                size={15}
                weight={sortKey === "rating" ? "fill" : "regular"}
              />
              Rating
            </button>
            <button
              onClick={() => setSortKey("appointments")}
              className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                sortKey === "appointments"
                  ? "bg-[#3e6658] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <CalendarBlankIcon
                size={15}
                weight={sortKey === "appointments" ? "fill" : "regular"}
              />
              Appointments
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full">
            <TherapistSearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <FilterDropdown
              label="All Specializations"
              options={ALL_SPECIALIZATIONS}
              value={specFilter}
              onChange={setSpecFilter}
            />
            <FilterDropdown
              label="Status"
              options={ALL_STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium px-1">
              <SortAscendingIcon size={14} />
              <span>{sortKey === "rating" ? "Rating" : "Appointments"} ↓</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <span className="material-symbols-outlined text-5xl">
              person_search
            </span>
            <p className="text-sm font-medium">
              No therapists match your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSpecFilter("All Specializations");
                setStatusFilter("All Status");
              }}
              className="text-xs text-[#3e6658] font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistPage;
