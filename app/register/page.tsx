import React from 'react';
import AcmeLogo from '@/app/ui/acme-logo';
import RegisterForm from '../ui/register/register-form';

const Register = () => {
  return (
    <main className="flex items-center justify-center pt-11 md:h-full">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-[55px] md:max-w-[700px]">
        <div className="md:h-19 flex h-20 w-full items-end rounded-lg bg-orange-500 p-3">
          <div className="flex h-[100%] w-full items-center justify-center">
            <p className=" whitespace-nowrap text-[22px] text-white md:text-[33px]">
              VIP Express Delivery
            </p>
          </div>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
};

export default Register;
