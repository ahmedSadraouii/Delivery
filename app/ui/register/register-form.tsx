'use client';
import { useFormState, useFormStatus } from 'react-dom';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../button';
import { useState, useEffect } from 'react';
import BusinessForm from './business-form';
import PersonalForm from './personal-form';

const RegisterForm = () => {
  const [isCompany, setIsSelected] = useState(true);

  return (
    <div>
      <form className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl">Please log in to continue.</h1>
          <div className="w-full">
            <div className="flex w-full justify-between gap-3">
              <Button
                className={`${
                  isCompany ? 'bg-orange-200' : 'bg-orange-400'
                } h-8 w-full `}
                onClick={(e) => {
                  setIsSelected(false);
                  e.preventDefault();
                }}
              >
                Personal
              </Button>
              <Button
                className={`${
                  !isCompany ? 'bg-orange-200' : 'bg-orange-400'
                } h-8 w-full `}
                onClick={(e) => {
                  setIsSelected(true);
                  e.preventDefault();
                }}
              >
                Business
              </Button>
            </div>
            {!isCompany ? <PersonalForm /> : <BusinessForm />}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
