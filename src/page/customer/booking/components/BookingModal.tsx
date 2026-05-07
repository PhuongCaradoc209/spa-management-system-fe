import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceType {
  id: string;
  name: string;
}

interface StaffType {
  id: string;
  name: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [selectedService, setSelectedService] = useState("");
  const [schedule, setSchedule] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [notes, setNotes] = useState("");

  // Reset form khi Modal đóng
  //   useEffect(() => {
  //     if (!isOpen) {
  //       setSelectedService("");
  //       setSchedule("");
  //       setSelectedStaff("");
  //       setNotes("");
  //     }
  //   }, [isOpen]);

  //   // Khi Service thay đổi, tự động clear Staff cũ đã chọn
  //   useEffect(() => {
  //     setSelectedStaff("");
  //   }, [selectedService]);

  //   // --- TANSTACK QUERY: FETCH SERVICES ---
  //   const { data: services = [], isLoading: isServicesLoading } = useQuery({
  //     queryKey: ["services"],
  //     queryFn: async () => {
  //       // Sửa lại URL API thực tế của bạn
  //       const response = await axios.get<ServiceType[]>("/api/services");
  //       return response.data;
  //     },
  //     enabled: isOpen, // Chỉ gọi API khi Modal đang mở
  //   });

  //   // --- TANSTACK QUERY: FETCH STAFFS (DEPENDENT QUERY) ---
  //   const { data: staffs = [], isLoading: isStaffLoading } = useQuery({
  //     // Thêm selectedService vào key để tự động gọi lại API khi đổi service
  //     queryKey: ["staffs", selectedService],
  //     queryFn: async () => {
  //       // Sửa lại URL API thực tế của bạn, truyền param serviceId
  //       const response = await axios.get<StaffType[]>("/api/staffs", {
  //         params: { serviceId: selectedService },
  //       });
  //       return response.data;
  //     },
  //     // Quan trọng: Chỉ gọi API khi có selectedService và Modal đang mở
  //     enabled: !!selectedService && isOpen,
  //   });

  //   // --- TANSTACK QUERY: MUTATION SUBMIT BOOKING ---
  //   const bookingMutation = useMutation({
  //     mutationFn: async (newBooking: any) => {
  //       // Sửa lại URL API tạo booking của bạn
  //       const response = await axios.post("/api/bookings", newBooking);
  //       return response.data;
  //     },
  //     onSuccess: () => {
  //       alert("Booking Success!");
  //       // Báo cho Calendar biết để fetch lại dữ liệu (Refresh lịch)
  //       // queryClient.invalidateQueries({ queryKey: ["events"] });
  //       onClose();
  //     },
  //     onError: (error) => {
  //       console.error("Booking failed:", error);
  //       alert("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!");
  //     },
  //   });

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const formData = {
  //       serviceId: selectedService,
  //       schedule,
  //       staffId: selectedStaff,
  //       notes,
  //     };

  //     // Kích hoạt mutation để gọi API
  //     bookingMutation.mutate(formData);
  //   };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          //   disabled={bookingMutation.isPending}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#2d4b4e] mb-6">
          Book New Appointment
        </h2>

        <form
          // onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* 1. Selection Service */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              1. Service Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              //   disabled={isServicesLoading || bookingMutation.isPending}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] bg-white cursor-pointer disabled:bg-gray-100"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {/* <option value="" disabled>
                {isServicesLoading ? "Loading services..." : "Select a service..."}
              </option>
              {services.map((srv) => (
                <option key={srv.id} value={srv.id}>{srv.name}</option>
              ))} */}
            </select>
          </div>

          {/* 2. Schedule */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              2. Schedule <span className="text-red-500">*</span>
            </label>
            <input
              required
              //   disabled={bookingMutation.isPending}
              type="datetime-local"
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] cursor-pointer disabled:bg-gray-100"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>

          {/* 3. Service Staff */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              3. Therapist / Staff <span className="text-red-500">*</span>
            </label>
            <select
              required
              //   disabled={!selectedService || isStaffLoading || bookingMutation.isPending}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              {/* <option value="" disabled>
                {isStaffLoading 
                  ? "Loading staff..." 
                  : (selectedService ? "Select a therapist..." : "Please select a service first")}
              </option>
              {staffs.map((staff) => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))} */}
            </select>
          </div>

          {/* 4. Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              4. Notes
            </label>
            <textarea
              //   disabled={bookingMutation.isPending}
              rows={3}
              placeholder="Any special requests, allergies, or medical conditions?"
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] resize-none disabled:bg-gray-100"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              //   disabled={bookingMutation.isPending}
              className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              //   disabled={bookingMutation.isPending}
              className="px-5 py-2.5 rounded-lg font-bold text-white bg-[#8c5e2d] hover:bg-[#784f25] transition shadow-md flex items-center justify-center min-w-[150px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {/* {bookingMutation.isPending ? "Booking..." : "Confirm Booking"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
