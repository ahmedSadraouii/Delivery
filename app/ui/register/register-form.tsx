'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { useState } from 'react';
import { FormEvent, ChangeEvent } from 'react'; // Import FormEvent type from React
import Link from 'next/link';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../button';
import { registerUser } from '@/app/lib/actions';
import PopUpComponent from './confirmation-pop-up';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPopUp, setShowPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [formPending, setFormPending] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setFormPending(true); // Set the form to pending when submitting
      const registrationResult = await registerUser(
        formData.email,
        formData.password,
      );

      if (registrationResult === 'success') {
        // Handle successful registration, e.g., redirect to login page
        console.log('Registration successful');
        // Show the pop-up on successful registration
        setEmail(formData.email);
        setShowPopUp(true);
      } else {
        // Handle registration failure
        setErrorMessage(registrationResult);
      }
    } catch (error) {
      // Handle registration error
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred during registration');
    } finally {
      setFormPending(false); // Reset the form pending state after submission
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl">Create Your Account.</h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  placeholder="confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div>
              <h5 className="flex items-center pt-4 text-[14px] ">
                You have an account ?
                <Link key="login" href="/login">
                  <span className="cursor-pointer pl-1 text-[#2190ff]">
                    Sign In
                  </span>
                </Link>
              </h5>
            </div>
          </div>
          <RegisterButton pending={formPending} />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </form>
      {/* Pop-up component */}
      {showPopUp && (
        <PopUpComponent email={email} onClose={() => setShowPopUp(false)} />
      )}
    </>
  );
}
interface RegisterButtonProps {
  pending: boolean;
}

function RegisterButton({ pending }: RegisterButtonProps) {
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
