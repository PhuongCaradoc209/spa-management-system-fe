import { useMemo, useState } from "react";
import { SortAscending, SortDescending } from "@phosphor-icons/react";
import TherapistCard from "./components/TherapistCard";
import TherapistSearchBar from "./components/TherapistSearchBar";
import FilterDropdown from "./components/FilterDropdown";
import { useQueries, useQuery } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import { appointmentService } from "@/services/appointment.service";
import { serviceService, type ServiceList } from "@/services/service.service";

const ALL_STATUSES: string[] = ["All Status", "AVAILABLE", "OFF DUTY"];

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

const TherapistPage = () => {
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All Services");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const { data: servicesList = [] } = useQuery({
    queryKey: ["listservices"],
    queryFn: () => serviceService.listServices(),
    select: (data: ServiceList[] | { services: ServiceList[] }) => {
      const services = Array.isArray(data) ? data : data?.services || [];
      const formattedOptions = services.map((service) => ({
        value: service.id,
        label: service.name,
      }));
      return [{ value: "all", label: "All Services" }, ...formattedOptions];
    },
  });

  const { data: staffList = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ["therapistsList"],
    queryFn: async () => {
      const response: any = await staffService.listStaff();
      return response?.staff || [];
    },
  });

  const countQueries = useQueries({
    queries: staffList.map((staff: any) => ({
      queryKey: ["appointmentCount", staff.id],
      queryFn: () => appointmentService.getAppointmentsByStaff(staff.id),
      enabled: !!staff.id,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const therapistsList = useMemo(() => {
    return staffList.map((staff: any, index: number) => {
      const countQuery = countQueries[index];
      const count = (countQuery?.data as any)?.total || 0;
      return {
        ...staff,
        appointmentCount: count,
        isCountLoading: countQuery?.isLoading,
      };
    });
  }, [staffList, countQueries]);

  const filtered = useMemo(() => {
    return therapistsList
      .filter((t: any) => {
        const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();

        const matchSearch =
          fullName.includes(search.toLowerCase()) ||
          t.services?.some((s: any) =>
            s.name.toLowerCase().includes(search.toLowerCase()),
          );

        const matchSpec =
          specFilter === "All Services" ||
          t.services?.some((s: any) => s.name === specFilter);

        const mappedStatus = t.isAvailable ? "AVAILABLE" : "OFF DUTY";
        const matchStatus =
          statusFilter === "All Status" || mappedStatus === statusFilter;

        return matchSearch && matchSpec && matchStatus;
      })
      .sort((a: any, b: any) => {
        const countA = a.appointmentCount || 0;
        const countB = b.appointmentCount || 0;
        return sortOrder === "desc" ? countB - countA : countA - countB;
      });
  }, [search, specFilter, statusFilter, sortOrder, therapistsList]);

  const available = therapistsList.filter((t: any) => t.isAvailable).length;
  const offDuty = therapistsList.filter((t: any) => !t.isAvailable).length;

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
              label="Off Duty"
              count={offDuty}
              color="bg-[#e9e9e9]"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full">
            <TherapistSearchBar value={search} onChange={setSearch} />
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <FilterDropdown
              label="All Services"
              options={servicesList.map((s) => s.label)} // Map lấy tên dịch vụ từ API
              value={specFilter}
              onChange={setSpecFilter}
            />

            <FilterDropdown
              label="Status"
              options={ALL_STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="flex items-center gap-2 text-sm font-medium text-[#3e6658] bg-[#f0f4f2] hover:bg-[#e0e8e4] px-4 py-2.5 rounded-xl transition-colors border border-transparent focus:border-[#3e6658]"
              title="Sort by Appointments"
            >
              {sortOrder === "desc" ? (
                <SortDescending size={18} />
              ) : (
                <SortAscending size={18} />
              )}
              <span>{sortOrder === "desc" ? "Most Appts" : "Least Appts"}</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        {isStaffLoading ? (
          <div className="py-24 text-center text-gray-500 font-medium">
            Loading therapists...
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((therapist: any) => (
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
                setSpecFilter("All Services"); // SỬA: Đổi về mặc định
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
