import { buttonVariants } from "@comps/ui/button";
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
        className={cn(buttonVariants({ variant, size: "medium" }), className)}
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
