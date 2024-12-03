import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircle } from "lucide-react";

const AcceptModal = ({ isOpen, onClose, booking }) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <Dialog.Title
                as="h3"
                className="text-2xl font-medium leading-6 text-gray-900 text-center"
              >
                Booking Accepted
              </Dialog.Title>
              <div className="mt-4">
                <p className="text-lg text-gray-500 text-center">
                  You have successfully accepted the booking from{" "}
                  <span className="font-medium">{booking?.fullname}</span>.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center px-6 py-3 text-lg font-medium text-white bg-[#084556] border border-transparent rounded-md hover:bg-[#073544] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#084556]"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AcceptModal;
