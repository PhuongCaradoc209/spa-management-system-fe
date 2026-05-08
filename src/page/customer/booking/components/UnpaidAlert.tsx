import React from "react";

interface UnpaidAlertProps {
  invoice: any;
  isPaying: boolean;
  onPay: () => void;
  onClose: () => void;
}

const UnpaidAlert: React.FC<UnpaidAlertProps> = ({
  invoice,
  isPaying,
  onPay,
  onClose,
}) => {
  return (
    <div className="text-center py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Payment Required
      </h2>
      <p className="text-gray-600 mb-5 text-sm">
        You have an outstanding invoice. Please settle the payment below before
        booking a new appointment.
      </p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm border border-gray-100 shadow-sm">
        <div className="flex justify-between mb-2.5">
          <span className="text-gray-500">Invoice No:</span>
          <span className="font-semibold text-gray-800">
            {invoice?.invoiceNumber}
          </span>
        </div>
        <div className="flex justify-between mb-2.5">
          <span className="text-gray-500">Service:</span>
          <span className="font-semibold text-gray-800 text-right">
            {invoice?.appointment?.services?.[0]?.service?.name ||
              "Spa Service"}
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-500">Date & Time:</span>
          <span className="font-semibold text-gray-800">
            {invoice?.appointment?.scheduledAt
              ? new Date(
                  invoice.appointment.scheduledAt.replace("Z", ""),
                ).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-gray-600 font-medium">Total Amount:</span>
          <span className="font-bold text-red-600 text-base">
            ${invoice?.totalAmt}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onPay}
          disabled={isPaying}
          className="w-full px-5 py-3 rounded-lg font-bold text-white bg-[#635BFF] hover:bg-[#4b45cf] transition shadow-md disabled:opacity-70 flex justify-center items-center"
        >
          {isPaying ? "Generating payment link..." : "Pay Now"}
        </button>
        {/* <button
          onClick={onClose}
          className="w-full px-5 py-3 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
        >
          Maybe Later
        </button> */}
      </div>
    </div>
  );
};

export default UnpaidAlert;
