'use client';
import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { confirmEmail, resentConfirmationEmail } from '@/app/lib/actions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface PopUpProps {
  email: string;
  onClose: () => void;
}

const PopUpComponent: React.FC<PopUpProps> = ({ email, onClose }) => {
  const router = useRouter();
  const [errorText, setErrorText] = useState('');
  const [confirmationError, setConfirmationError] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement | null>(null),
  );

  const focusNextInput = (index: number) => {
    if (inputRefs[index + 1]?.current) {
      inputRefs[index + 1].current.focus();
    }
  };

  const focusPrevInput = (index: number) => {
    if (inputRefs[index - 1]?.current) {
      inputRefs[index - 1].current.focus();
    }
  };
  const handleTokenSubmit = async () => {
    // Join the values from all input fields to form the complete token
    const token = inputRefs.map((ref) => ref.current?.value || '').join('');
    // Call the confirmEmail function from actions.tsx
    const confirmationResult = await confirmEmail(email, token);

    if (confirmationResult) {
      onClose();
      router.push('/login');
      alert('email confirmed press login');
    } else {
      console.log('first');
      setConfirmationError(false);
      // Handle confirmation failure
      setErrorText('Wrong confirmation Code.');
    }
  };
  const handleResendEmail = async () => {
    const confirmationResult = await resentConfirmationEmail(email);

    if (confirmationResult) {
      alert('Confirmation resent confirmed successfully');
    } else {
      setErrorText('Please try again.');
    }
  };
  useEffect(() => {
    confirmationSuccess
      ? toast.warning('Email confirmed successfully')
      : toast.warning('Verify the code');
  }, [confirmationSuccess, confirmationError]);

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-orange-500 p-4 shadow-lg">
          <div>
            <h2 className="mb-4 text-center text-2xl text-white">
              Enter Confirmation Code
            </h2>
            <p
              onClick={handleResendEmail}
              className="cursor-pointer px-4  py-2 text-center text-blue-400 "
            >
              Resend Email
            </p>
          </div>
          <div className="mb-4 flex items-center justify-center space-x-2">
            {inputRefs.map((ref, index) => (
              <input
                key={index}
                ref={ref}
                type="text"
                maxLength={1}
                className={`h-12 w-12 rounded text-center text-2xl font-bold ${
                  confirmationError ? 'border-red-500' : 'bg-white'
                }`}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    focusNextInput(index);
                  } else {
                    focusPrevInput(index);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && e.target.value.length === 0) {
                    focusPrevInput(index);
                  }
                }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleTokenSubmit}
              className="rounded bg-white px-4 py-2 text-orange-500 hover:bg-orange-400 focus:outline-none"
            >
              Submit
            </button>
            {errorText && (
              <div className="ml-2 text-sm text-white">{errorText}</div>
            )}
            <button
              onClick={onClose}
              className="rounded bg-white px-4 py-2 text-orange-500 hover:bg-orange-400 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PopUpComponent;
