import React from 'react';
import banner from '~/assets/banner/BANNER.webp';
import {Button} from '@headlessui/react';
import {Link} from '@remix-run/react';
interface Props {
  className?: string;
}

const Banner: React.FC<Props> = ({className}) => {
  return (
    <div
      className="relative w-full h-[650px] bg-cover bg-center"
      style={{backgroundImage: `url(${banner})`}}
    >
      <div className="container mx-auto h-full flex items-center ">
        <div className="flex flex-col text-white p-6 text-left max-w-lg">
          <h2 className="leading-10">
            <span className="text-5xl font-bold">
              The Peak <br /> Collection
            </span>
          </h2>
          <div className="mt-2">
            <span>Push your performance with our premium athletic wear</span>
          </div>
          <div>
            <Link to={'/collections'}>
              <Button className="button-wh mt-5">Shop now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
