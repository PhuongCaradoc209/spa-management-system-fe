import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ViewTabButton from "./components/ViewTabButton";
import NavIconButton from "./components/NavIconButton";
import EventCard from "./components/EventCard";
import SelectField from "./components/SelectField";
import QuickStat from "./components/QuickStat";
import { PlusCircleIcon } from "@phosphor-icons/react";
import BookingModal from "./components/BookingModal";
import { serviceService, type ServiceList } from "@/services/service.service";
import { useQuery } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import { appointmentService } from "@/services/appointment.service";

const BookingPage = () => {
  const calendarRef = useRef<FullCalendar>(null);

  const [activeView, setActiveView] = useState<string>("dayGridMonth");
  const [calendarTitle, setCalendarTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // State quản lý Filter
  const [selectedTherapist, setSelectedTherapist] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");

  const { data: therapistsList = [] } = useQuery({
    queryKey: ["therapists"],
    queryFn: () => staffService.listStaff(),
    select: (data: any) => {
      const staff = data?.staff || [];
      return [{ value: "all", label: "All Specialists" }].concat(
        staff.map((s: any) => ({
          value: s.id,
          label: s.firstName + " " + s.lastName,
        })),
      );
    },
  });

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

  const { data: bookingList = [] } = useQuery({
    queryKey: ["listBooking"],
    queryFn: () => appointmentService.listAppointments(),
    select: (data: any) => {
      return Array.isArray(data) ? data : data?.appointments || [];
    },
  });

  const calendarEvents = useMemo(() => {
    // 1. Lấy mảng appointments gốc
    let appointments = Array.isArray(bookingList) ? bookingList : [];

    // 2. Lọc theo Therapist (nếu khác "all")
    if (selectedTherapist !== "all") {
      appointments = appointments.filter(
        (appt: any) => appt.staffId === selectedTherapist,
      );
    }

    // 3. Lọc theo Service (nếu khác "all")
    if (selectedService !== "all") {
      appointments = appointments.filter((appt: any) => {
        return appt.services?.some((s: any) => s.serviceId === selectedService);
      });
    }

    // 4. Map ra định dạng chuẩn của FullCalendar
    return appointments.map((appt: any) => {
      const matchedStaff = therapistsList.find(
        (t: any) => t.value === appt.staffId,
      );
      const therapistName = matchedStaff
        ? matchedStaff.label
        : "Unknown Specialist";

      const serviceNames =
        appt.services
          ?.map((s: any) => s.service?.name)
          .filter(Boolean)
          .join(" + ") || "Appointment";

      return {
        id: appt.id,
        title: serviceNames,
        // Cắt bỏ chữ Z để tránh lỗi lệch múi giờ trên FullCalendar
        start: appt.scheduledAt.substring(0, 19),
        end: appt.endsAt ? appt.endsAt.substring(0, 19) : undefined,
        extendedProps: {
          therapist: therapistName,
          status:
            appt.status === "PENDING" ? "upcoming" : appt.status?.toLowerCase(),
          notes: appt.notes,
        },
      };
    });
  }, [bookingList, therapistsList, selectedTherapist, selectedService]);

  // Tính toán Quick Stats động dựa trên danh sách sự kiện ĐÃ LỌC
  const upcomingCount = calendarEvents.filter(
    (e) => e.extendedProps.status === "upcoming",
  ).length;

  const completedCount = calendarEvents.filter(
    (e) =>
      e.extendedProps.status === "completed" ||
      e.extendedProps.status === "paid", // Bạn có thể điều chỉnh status tùy theo API của bạn
  ).length;

  const handleViewChange = (viewName: string) => {
    setActiveView(viewName);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(viewName);
  };

  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();

  return (
    <div className="pt-32 pb-24 mx-24 lg:mx-32 flex flex-col lg:flex-row gap-6 text-black ">
      <div className="flex flex-col gap-4 flex-1 rounded-xl p-8 bg-surface-container-low ">
        <div>
          <h3 className="font-bold text-[#2d4b4e] mb-4 text-lg">Refine View</h3>
          <div className="flex flex-col gap-4">
            <SelectField
              label="Therapist"
              options={therapistsList}
              value={selectedTherapist}
              onChange={(e: any) =>
                setSelectedTherapist(e.target ? e.target.value : e)
              }
            />

            <SelectField
              label="Service Type"
              options={servicesList}
              value={selectedService}
              onChange={(e: any) =>
                setSelectedService(e.target ? e.target.value : e)
              }
            />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[#2d4b4e] mb-4 text-lg">Quick Stats</h3>
          <div className="flex flex-col gap-3">
            <QuickStat
              label="Upcoming"
              count={upcomingCount}
              bgColor="bg-[#e4eae5]"
            />
            <QuickStat
              label="Completed"
              count={completedCount}
              bgColor="bg-[#ebf0f1]"
            />
          </div>
        </div>
        <div className="mt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#8c5e2d] hover:bg-[#784f25] transition-colors text-white py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <PlusCircleIcon size={24} />
            Book Appointment
          </button>
        </div>
      </div>

      <div className="flex-4 border border-gray-100 p-6 rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col lg:flex-row justify-between w-full lg:w-auto gap-4">
            <div className="text-2xl font-bold text-teal-900 lg:w-64">
              {calendarTitle}
            </div>

            {/* Sử dụng Component cho phần điều hướng */}
            <div className="flex items-center gap-3">
              <NavIconButton onClick={handlePrev}>&lt;</NavIconButton>
              <button
                onClick={handleToday}
                className="hover:text-teal-700 text-gray-500 transition tracking-wide font-bold text-sm"
              >
                TODAY
              </button>
              <NavIconButton onClick={handleNext}>&gt;</NavIconButton>
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-full">
            <ViewTabButton
              label="MONTH"
              isActive={activeView === "dayGridMonth"}
              onClick={() => handleViewChange("dayGridMonth")}
            />
            <ViewTabButton
              label="WEEK"
              isActive={activeView === "timeGridWeek"}
              onClick={() => handleViewChange("timeGridWeek")}
            />
            <ViewTabButton
              label="DAY"
              isActive={activeView === "timeGridDay"}
              onClick={() => handleViewChange("timeGridDay")}
            />
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          height="auto"
          datesSet={(dateInfo) => {
            setCalendarTitle(dateInfo.view.title);
          }}
          events={calendarEvents}
          eventContent={(eventInfo) => {
            return <EventCard eventInfo={eventInfo} />;
          }}
        />
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicesList={servicesList}
      />
    </div>
  );
};

export default BookingPage;
