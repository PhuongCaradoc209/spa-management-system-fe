import { useState, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import { appointmentService } from "@/services/appointment.service";
import { invoiceService } from "@/services/invoice.service";
import UnpaidAlert from "./UnpaidAlert";
import BookingForm from "./BookingForm";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicesList?: { value: string; label: string }[];
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

  const handleChange = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));
  const handleResetForm = () => setFormData(initialFormState);

  // APIs
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

  const bookingMutation = useMutation({
    mutationKey: ["createBooking"],
    mutationFn: (payload: any) =>
      appointmentService.createAppointment({
        ...payload,
        scheduledAt: payload.scheduledAt + ":00.000Z",
      }),
    onSuccess: () => {
      alert("Booking successful!");
      onClose();
      handleResetForm();
      queryClient.invalidateQueries({
        queryKey: ["listBooking", "therapistsList"],
      });
    },
  });

  const { data: staffOptions = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ["staffs", formData.serviceIds[0]],
    queryFn: () => serviceService.listStaffServices(formData.serviceIds[0]),
    enabled: !!formData.serviceIds[0],
    select: (data: any) =>
      (data?.staff || []).map((staff: any) => ({
        value: staff.id,
        label: `${staff.firstName} ${staff.lastName}`,
        isAvailable: staff.isAvailable,
      })),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={24} />
        </button>

        {isInvoicesLoading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            Checking information...
          </div>
        ) : firstUnpaidInvoice ? (
          <UnpaidAlert
            invoice={firstUnpaidInvoice}
            isPaying={checkoutMutation.isPending}
            onPay={() => checkoutMutation.mutate(firstUnpaidInvoice.id)}
            onClose={onClose}
          />
        ) : (
          <BookingForm
            formData={formData}
            onChange={handleChange}
            onSubmit={(e) => {
              e.preventDefault();
              bookingMutation.mutate(formData);
            }}
            servicesList={servicesList}
            staffOptions={staffOptions}
            isStaffLoading={isStaffLoading}
            isBooking={bookingMutation.isPending}
            onCancel={() => {
              onClose();
              handleResetForm();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BookingModal;
