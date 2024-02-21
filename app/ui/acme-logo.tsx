import { GlobeAltIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div className=" flex flex-row items-center gap-2 leading-none text-white">
      <Image
        className=" mr-5 hidden  md:block"
        src="/vip.jpg"
        width={250}
        height={200}
        alt="logo"
      />
      <Image
        className="mx-auto mr-5 md:hidden"
        src="/vip.jpg"
        width={50}
        height={50}
        alt="logo"
      />
      <div className="flex h-[100%] w-full items-center justify-center">
        <p className=" text-[22px] md:text-[33px]">VIP Express Delivery</p>
      </div>
    </div>
  );
}
