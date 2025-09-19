import MaintenancePage from '@/src/components/molecules/maintenance-page'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className="font-sans h-screen overflow-hidden relative bg-white p-10">
    {/* <!-- Header Logos --> */}
    <div className="flex justify-center items-center relative p-4">
      <div className="absolute left-4">
        <Image src="/meril.png" alt="MerilLogo" width="120" height="83" />
      </div>
      <div>
        {/* <Image src="/VishalBSDK5.svg" alt="Logo" width="172" height="65" /> */}
      </div>
    </div>

    {/* <!-- GIF Image --> */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
      <Image
        src="/Website Building of Shopping Sale 2.gif"
        alt="Maintenance"
        width="600"
        height="600"
      />
    </div>

    {/* <!-- Footer Text --> */}
    <div className="absolute bottom-2 left-0 w-full">
      <div
        className="w-[80%] mx-auto text-center text-[24px] text-[#736F6F]"
      >
        In the meantime, if you have any queries, please feel free to reach out
        at <b>+91 7400485764</b>.
      </div>
    </div>

    {/* <!-- Main Content --> */}
    <div
      className="p-4 grid place-items-center w-[80%] mx-auto gap-y-5 text-center"
    >
      <h1 className="text-[48px] font-semibold text-[#67666C] tracking-wide">
        We’ll Be Back Soon
      </h1>
      <span className="text-[#67666C] text-[24px] tracking-wide">
        VMS is currently down for scheduled maintenance.
      </span>
    </div>
  </div>
  )
}

export default page