import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { serviceService, type ServiceList } from "@/services/service.service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import { appointmentService } from "@/services/appointment.service";
import { invoiceService } from "@/services/invoice.service";
import QuickStat from "../customer/booking/components/QuickStat";
import SelectField from "../customer/booking/components/SelectField";
import NavIconButton from "../customer/booking/components/NavIconButton";
import ViewTabButton from "../customer/booking/components/ViewTabButton";
import BookingModal from "../customer/booking/components/BookingModal";
import UnpaidAlert from "../customer/booking/components/UnpaidAlert";
import EventCard from "../customer/booking/components/EventCard";

const BookingPage = () => {
  const calendarRef = useRef<FullCalendar>(null);

  const [activeView, setActiveView] = useState<string>("dayGridMonth");
  const [calendarTitle, setCalendarTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedTherapist, setSelectedTherapist] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");

  // Query lấy danh sách kỹ thuật viên
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

  // Query lấy danh sách dịch vụ
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

  // Query lấy danh sách lịch hẹn
  const { data: bookingList = [] } = useQuery({
    queryKey: ["listBooking"],
    queryFn: () => appointmentService.listAppointments(),
    select: (data: any) => {
      return Array.isArray(data) ? data : data?.appointments || [];
    },
  });

  // Logic kiểm tra nợ (Chuyển từ Modal ra ngoài)
  const { data: invoicesList = [], isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoiceService.listInvoices(),
    select: (res: any) =>
      Array.isArray(res) ? res : res?.invoices || res?.data?.invoices || [],
  });

  const firstUnpaidInvoice = useMemo(() => {
    return invoicesList.find((inv: any) => inv.paymentStatus === "UNPAID");
  }, [invoicesList]);

  const checkoutMutation = useMutation({
    mutationFn: (invoiceId: string) =>
      invoiceService.createCheckoutSession(invoiceId),
    onSuccess: (data: any) => {
      if (data?.url) window.location.href = data.url;
    },
  });

  const calendarEvents = useMemo(() => {
    const appointments = Array.isArray(bookingList) ? bookingList : [];

    return appointments.reduce((acc: any[], appt: any) => {
      if (selectedTherapist !== "all" && appt.staffId !== selectedTherapist) {
        return acc;
      }

      if (selectedService !== "all") {
        const hasService = appt.services?.some(
          (s: any) => s.serviceId === selectedService,
        );
        if (!hasService) return acc;
      }

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

      acc.push({
        id: appt.id,
        title: serviceNames,
        start: appt.scheduledAt.substring(0, 19),
        end: appt.endsAt ? appt.endsAt.substring(0, 19) : undefined,
        extendedProps: {
          therapist: therapistName,
          status:
            appt.status === "PENDING" ? "upcoming" : appt.status?.toLowerCase(),
          notes: appt.notes,
        },
      });

      return acc;
    }, []);
  }, [bookingList, therapistsList, selectedTherapist, selectedService]);

  const { upcomingCount, completedCount, cancelledCount } = useMemo(() => {
    return calendarEvents.reduce(
      (stats, event) => {
        const status = event.extendedProps.status;
        if (status === "upcoming") {
          stats.upcomingCount++;
        } else if (status === "completed" || status === "paid") {
          stats.completedCount++;
        } else if (status === "cancelled") {
          stats.cancelledCount++;
        }
        return stats;
      },
      { upcomingCount: 0, completedCount: 0, cancelledCount: 0 },
    );
  }, [calendarEvents]);

  const handleViewChange = (viewName: string) => {
    setActiveView(viewName);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(viewName);
  };

  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();

  return (
    <div className="pt-32 pb-24 mx-24 lg:mx-32 flex flex-col lg:flex-row gap-6 text-black relative">
      {/* Sidebar - Refine View & Quick Stats */}
      <div className="flex flex-col gap-4 flex-1 rounded-xl p-8 bg-surface-container-low h-fit">
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
            <QuickStat
              label="Cancelled"
              count={cancelledCount}
              bgColor="bg-[#cfcfcf]"
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

      {/* Main Content - Calendar */}
      <div className="flex-4 border border-gray-100 p-6 rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col lg:flex-row justify-between w-full lg:w-auto gap-4">
            <div className="text-2xl font-bold text-teal-900 lg:w-64">
              {calendarTitle}
            </div>
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
          datesSet={(dateInfo) => setCalendarTitle(dateInfo.view.title)}
          events={calendarEvents}
          eventContent={(eventInfo) => <EventCard eventInfo={eventInfo} />}
        />
      </div>

      {/* Modal đặt lịch (Đã dọn dẹp logic hóa đơn) */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicesList={servicesList}
      />

      {/* Unpaid Alert Modal (Chặn người dùng khi có nợ) */}
      {!isInvoicesLoading && firstUnpaidInvoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-fade-in-up">
            <UnpaidAlert
              invoice={firstUnpaidInvoice}
              isPaying={checkoutMutation.isPending}
              onPay={() => checkoutMutation.mutate(firstUnpaidInvoice.id)}
              onClose={() => {
                // Tùy chọn: Có thể đóng modal hoặc chuyển hướng người dùng ra trang khác
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
