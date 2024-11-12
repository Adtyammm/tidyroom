// components/InfoModal.js
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

const InfoModal = ({ isOpen, onClose, booking }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="transform transition duration-[100ms] ease-out"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transform transition duration-[100ms] ease-in"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            <Dialog.Panel className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#084556] rounded-2xl shadow-xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-200 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Title */}
              <Dialog.Title
                as="h3"
                className="text-2xl font-bold text-white mb-4 text-center"
              >
                Booking Information
              </Dialog.Title>

              {/* Booking Details */}
              <div className="text-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Username:</span>
                  <span>{booking?.username || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">NIM:</span>
                  <span>{booking?.nim || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Work Hours:</span>
                  <span>{booking?.workHours || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Address:</span>
                  <span>{booking?.address || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className="capitalize">{booking?.status || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Price:</span>
                  <span>{booking?.price || "N/A"} /jam</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#FFD28F] text-black font-semibold rounded-full hover:bg-[#ffbf60] transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InfoModal;
