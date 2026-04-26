import { useRef, useState } from "react";
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

const myEvents = [
  {
    id: "1",
    title: "Aromatherapy Massage",
    start: "2026-04-26T11:00:00",
    end: "2026-04-26T12:30:00",
    extendedProps: {
      therapist: "Elena Vance",
      status: "upcoming",
    },
  },
  {
    id: "2",
    title: "Aromatherapy Massage",
    start: "2026-04-26T13:00:00",
    end: "2026-04-26T14:30:00",
    extendedProps: {
      therapist: "Elena Vance",
      status: "upcoming",
    },
  },
  {
    id: "3",
    title: "Aromatherapy Massage",
    start: "2026-04-26T15:00:00",
    end: "2026-04-26T16:30:00",
    extendedProps: {
      therapist: "Elena Vance",
      status: "upcoming",
    },
  },
];

const BookingPage = () => {
  const calendarRef = useRef<FullCalendar>(null);

  const [activeView, setActiveView] = useState<string>("dayGridMonth");
  const [calendarTitle, setCalendarTitle] = useState<string>("");
  // const [selectedTherapist, setSelectedTherapist] = useState<string>("All Specialists");
  // const [selectedService, setSelectedService] = useState<string>("All Services");

  // const { data: therapistsList = [] } = useQuery({
  //   queryKey: ["therapists"],
  //   queryFn: fetchTherapists,
  // });

  // const { data: servicesList = [] } = useQuery({
  //   queryKey: ["services"],
  //   queryFn: fetchServices,
  // });

  // const { data: calendarEvents = [], isFetching: isEventsLoading } = useQuery({
  //   queryKey: ["events", selectedTherapist, selectedService],
  //   queryFn: () => fetchEvents(selectedTherapist, selectedService),
  //   placeholderData: (previousData) => previousData,
  // });

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
              options={["All Specialists", "Elena Vance", "Marcus Thorne"]}
            />

            <SelectField
              label="Service Type"
              options={["All Services", "Massage", "Facial"]}
            />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[#2d4b4e] mb-4 text-lg">Quick Stats</h3>
          <div className="flex flex-col gap-3">
            <QuickStat label="Upcoming" count={2} bgColor="bg-[#e4eae5]" />
            <QuickStat label="Completed" count={14} bgColor="bg-[#ebf0f1]" />
          </div>
        </div>
        <div className="mt-2">
          <button className="w-full bg-[#8c5e2d] hover:bg-[#784f25] transition-colors text-white py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-md">
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
            <div className="flex items-center  gap-3">
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
          events={myEvents}
          eventContent={(eventInfo) => {
            return <EventCard eventInfo={eventInfo} />;
          }}
        />
      </div>
    </div>
  );
};

export default BookingPage;
