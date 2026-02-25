import { cn } from "@/lib/utils";
import { useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { ButtonVariant } from "./buttonEnum";

interface BookingButtonProps {
  title: string;
  jotFormId: string;
  variant?: ButtonVariant;
  className?: string;
}
export const variantMap: Record<ButtonVariant, string> = {
  solidRed: "bg-ssw-red hover:opacity-80 text-white",
  solidWhite: "text-black hover:opacity-80 border-1 bg-white",
  outlinedWhite: "border-1 hover:bg-white/20 border-white text-white",
};

export const BookingButton = ({
  title,
  jotFormId,
  variant = ButtonVariant.OutlinedWhite,
  className,
}: BookingButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className={cn(
          variantMap[variant],
          className,
          `px-5 py-2 min-h-[42px] font-semibold text-center transition-all items-center text-white rounded-lg whitespace-nowrap uppercase flex`
        )}
      >
        {title}
      </button>

      <Modal open={isOpen} onClose={closeModal} center>
        <iframe
          title="jotform"
          src={`https://www.jotform.com/${jotFormId}`}
          width="100%"
          className="md:p-5 p-4 lg:w-160 lg:h-200 md:w-120 h-160 overflow-hidden"
        />
      </Modal>
    </>
  );
};
