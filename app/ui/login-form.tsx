'use client';
import { useFormState, useFormStatus } from 'react-dom';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { signIn } from '@/auth';
import Link from 'next/link';
import PopUpComponent from './register/confirmation-pop-up';
import { AuthError } from 'next-auth';
import { useEffect, useState } from 'react';
import { authenticate } from '../lib/actions';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [showPopUp, setShowPopUp] = useState(false);
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (errorMessage && errorMessage === 'Please confirm your email') {
      setShowPopUp(true);
    }
  }, [errorMessage]);

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    // You can use the NextAuth signIn function with the provider name
    // In this case, the provider name is 'google'
    await signIn('google');
  };

  return (
    <>
      <form action={dispatch} className="space-y-3">
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              <h5 className="font-Poppins pt-4 text-center text-[14px] text-black">
                Or join with
              </h5>
              <div className="my-3 flex items-center justify-center">
                <GlobeAltIcon className="ml-2 w-8 cursor-pointer" />
              </div>
            </div>
            <div>
              <h5 className="flex items-center pt-4 text-[14px] ">
                Don't have any account ?
                <Link key="register" href="/register">
                  <span className="cursor-pointer pl-1 text-[#2190ff]">
                    Register
                  </span>
                </Link>
              </h5>
            </div>
          </div>
          <LoginButton />
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

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
