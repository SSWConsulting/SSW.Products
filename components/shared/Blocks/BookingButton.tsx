import { useState } from 'react';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { ButtonVariant } from './buttonEnum';


interface BookingButtonProps {
  title: string;
  jotFormId: string
  variant?: ButtonVariant
}

export const BookingButton = ({ title, jotFormId, variant = ButtonVariant.OutlinedWhite }: BookingButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div>
      <button
        onClick={openModal}
        className={`px-5 py-2 ${variant} font-semibold text-center items-center text-white rounded-lg hover:opacity-80 whitespace-nowrap`}
      >
        {title}
      </button>


      <Modal open={isOpen} onClose={closeModal} center>
        <iframe
        title="jotform"
        src={`https://form.jotform.com/${jotFormId}`}
        width="100%"
        className='md:p-5 p-4 lg:w-[40rem] lg:h-[50rem] md:w-[30rem] h-[40rem] overflow-hidden'
        />
      </Modal>
    </div>
  );
};
