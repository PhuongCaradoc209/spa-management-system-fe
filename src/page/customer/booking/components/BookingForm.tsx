import React from "react";

interface BookingFormProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  servicesList?: { value: string; label: string }[];
  staffOptions: { value: string; label: string; isAvailable: string }[];
  isStaffLoading: boolean;
  isBooking: boolean;
  onCancel: () => void;
}

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h < 22; h++) {
    const hour = h.toString().padStart(2, "0");
    slots.push(`${hour}:00`, `${hour}:30`);
  }
  return slots;
})();

const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  onChange,
  onSubmit,
  servicesList,
  staffOptions,
  isStaffLoading,
  isBooking,
  onCancel,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#2d4b4e] mb-6">
        Book New Appointment
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            required
            disabled={isBooking}
            className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] bg-white cursor-pointer"
            value={formData.serviceIds[0] || ""}
            onChange={(e) => {
              onChange("serviceIds", [e.target.value]);
              onChange("staffId", "");
            }}
          >
            {servicesList?.map((srv) => (
              <option key={srv.value} value={srv.value}>
                {srv.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Schedule <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              required
              disabled={isBooking}
              type="date"
              className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] cursor-pointer"
              value={
                formData.scheduledAt ? formData.scheduledAt.split("T")[0] : ""
              }
              onChange={(e) => {
                const date = e.target.value;
                const time = formData.scheduledAt
                  ? formData.scheduledAt.split("T")[1]
                  : "09:00";
                onChange("scheduledAt", `${date}T${time}`);
              }}
            />
            <select
              required
              disabled={isBooking || !formData.scheduledAt}
              className="w-32 border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] bg-white cursor-pointer"
              value={
                formData.scheduledAt
                  ? formData.scheduledAt.split("T")[1].substring(0, 5)
                  : ""
              }
              onChange={(e) => {
                const date = formData.scheduledAt.split("T")[0];
                onChange("scheduledAt", `${date}T${e.target.value}`);
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
            className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] bg-white cursor-pointer disabled:bg-gray-100"
            value={formData.staffId}
            onChange={(e) => onChange("staffId", e.target.value)}
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Notes</label>
          <textarea
            disabled={isBooking}
            rows={3}
            placeholder="Any special requests, allergies, or medical conditions?"
            className="border border-gray-300 rounded-lg p-3 outline-none focus:border-[#8c5e2d] resize-none"
            value={formData.notes}
            onChange={(e) => onChange("notes", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            disabled={isBooking}
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBooking}
            className="px-5 py-2.5 rounded-lg font-bold text-white bg-[#8c5e2d] hover:bg-[#784f25] disabled:opacity-70 min-w-[150px]"
          >
            {isBooking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </>
  );
};

export default BookingForm;
