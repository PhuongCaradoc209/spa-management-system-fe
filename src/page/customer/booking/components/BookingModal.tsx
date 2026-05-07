import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import { appointmentService } from "@/services/appointment.service";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicesList?: { value: string; label: string }[];
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  isAvailable: string;
}

const initialFormState = {
  staffId: "",
  scheduledAt: "",
  serviceIds: [],
  notes: "",
};

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  servicesList,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const queryClient = useQueryClient();
  const handleChange = (field: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const { data: staffOptions = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ["staffs", formData.serviceIds[0]],
    queryFn: () => serviceService.listStaffServices(formData.serviceIds[0]),
    enabled: !!formData.serviceIds[0],
    select: (data: any) => {
      const staffList = data?.staff || [];
      return staffList.map((staff: Staff) => ({
        value: staff.id,
        label: `${staff.firstName} ${staff.lastName}`,
        isAvailable: staff.isAvailable,
      }));
    },
  });

  const bookingMutation = useMutation({
    mutationKey: ["createBooking"],
    mutationFn: (payload: any) => {
      const formattedPayload = {
        ...payload,
        scheduledAt: payload.scheduledAt + ":00.000Z",
      };
      return appointmentService.createAppointment(formattedPayload);
    },
    onSuccess: () => {
      alert("Booking successful!");
      onClose();
      handleResetForm();
      queryClient.invalidateQueries({
        queryKey: ["listBooking", "therapistsList"],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to create booking. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(formData);
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h < 22; h++) {
      const hour = h.toString().padStart(2, "0");
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };
  const TIME_SLOTS = generateTimeSlots();

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              disabled={bookingMutation.isPending}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] bg-white cursor-pointer disabled:bg-gray-100"
              value={formData.serviceIds[0] || ""}
              onChange={(e) => {
                handleChange("serviceIds", [e.target.value]);
                handleChange("staffId", "");
              }}
            >
              {servicesList?.map((srv) => (
                <option key={srv.value} value={srv.value}>
                  {srv.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Schedule */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Schedule <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {/* Ô chọn Ngày */}
              <input
                required
                disabled={bookingMutation.isPending}
                type="date"
                className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] cursor-pointer disabled:bg-gray-100"
                // Lấy phần ngày (YYYY-MM-DD) từ state scheduledAt
                value={
                  formData.scheduledAt ? formData.scheduledAt.split("T")[0] : ""
                }
                onChange={(e) => {
                  const date = e.target.value;
                  const time = formData.scheduledAt
                    ? formData.scheduledAt.split("T")[1]
                    : "09:00"; // Mặc định 09:00 nếu chưa có giờ
                  handleChange("scheduledAt", `${date}T${time}`);
                }}
              />

              {/* Ô chọn Giờ 24h */}
              <select
                required
                disabled={bookingMutation.isPending || !formData.scheduledAt}
                className="w-32 border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] bg-white cursor-pointer disabled:bg-gray-100"
                // Lấy phần giờ (HH:mm) từ state scheduledAt
                value={
                  formData.scheduledAt
                    ? formData.scheduledAt.split("T")[1].substring(0, 5)
                    : ""
                }
                onChange={(e) => {
                  const date = formData.scheduledAt.split("T")[0];
                  const time = e.target.value;
                  handleChange("scheduledAt", `${date}T${time}`);
                }}
              >
                <option value="" disabled>
                  Time
                </option>
                {TIME_SLOTS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Therapist / Staff <span className="text-red-500">*</span>
            </label>
            <select
              required
              disabled={!formData.serviceIds?.length || isStaffLoading}
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
              value={formData.staffId}
              onChange={(e) => handleChange("staffId", e.target.value)}
            >
              <option value="" disabled>
                {isStaffLoading
                  ? "Loading staff..."
                  : formData.serviceIds?.length > 0
                    ? "Select a therapist..."
                    : "Please select a service first"}
              </option>
              {staffOptions?.map((staff: any) => (
                <option key={staff.value} value={staff.value}>
                  {staff.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              disabled={bookingMutation.isPending}
              rows={3}
              placeholder="Any special requests, allergies, or medical conditions?"
              className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] focus:ring-1 focus:ring-[#8c5e2d] resize-none disabled:bg-gray-100"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                handleResetForm();
              }}
              disabled={bookingMutation.isPending}
              className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="px-5 py-2.5 rounded-lg font-bold text-white bg-[#8c5e2d] hover:bg-[#784f25] transition shadow-md flex items-center justify-center min-w-[150px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
