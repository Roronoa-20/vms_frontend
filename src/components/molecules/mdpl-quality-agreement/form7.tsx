import React from 'react';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";
import { useQMSForm } from "@/src/hooks/useQMSForm";
import { useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button';

const Form7 = ({ vendor_onboarding }: { vendor_onboarding: string }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor_information";
  const { formData, handleChange } = useQMSForm(vendor_onboarding, currentTab);
  const isQATeamApproved = formData?.qa_team_approved === 1;

  React.useEffect(() => {
    const form7Data = {
      contact_person_1: formData.contact_person_1 || "",
      contact_person_2: formData.contact_person_2 || ""
    };

    localStorage.setItem("Form7Data", JSON.stringify(form7Data));
  }, [formData.contact_person_1, formData.contact_person_2]);




  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }} className='space-y-10'>
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">
          <Header />
          <section className='ml-8 space-y-2 z-[50] text-justify text-[15px]'>
            <div className='space-y-2 text-justify pr-16'>
              <h1 className='text-center font-bold text-[17px]'>Annex II – Contact person details</h1>
              <div className='mt-5'>
                <h1 className='font-semibold text-[18px]'>Meril Diagnostics Pvt. Ltd.</h1>
                <div className='grid grid-cols-2 mt-3 border-[1px] border-black font-semibold'>
                  <div className='border-r-[1px] border-black p-1'>
                    <p>Mr. Punesh Rohit</p>
                    <p className='font-medium'>Additional General Manager (Purchase)<br />
                      <a href="mailto:punesh.rohit@merillife.com" className="underline text-blue-600">
                        punesh.rohit@merillife.com
                      </a><br />
                      Contact No.:  +91 9924019593 </p>
                  </div>
                  <div className='p-1'>
                    <p>Mr. Ram S. Kanoje</p>
                    <p className='font-medium'>Additional General Manager (Quality Assurance)<br />
                      <a href="mailto:ram.kanoje@merillife.com" className="underline text-blue-600">
                        ram.kanoje@merillife.com
                      </a><br />
                      Contact No.: +91 9879916169</p>
                  </div>
                </div>
              </div>
              <div className='mt-5'>
                <h1 className='font-semibold text-[18px]'> [Supplier contact person details] </h1>
                <div className='grid grid-cols-2 mt-3 border-[1px] border-black font-semibold'>
                  <div className='border-r-[1px] border-black p-1'>
                    <textarea
                      className='w-full h-full p-1 outline-none'
                      placeholder='Write here'
                      name="contact_person_1"
                      value={formData.contact_person_1 || ""}
                      onChange={(e) => handleChange("contact_person_1", e.target.value)}
                      disabled={isQATeamApproved}

                    />
                  </div>
                  <div className='p-1'>
                    <textarea
                      className='w-full h-full p-1 outline-none'
                      placeholder='Write here'
                      name="contact_person_2"
                      value={formData.contact_person_2 || ""}
                      onChange={(e) => handleChange("contact_person_2", e.target.value)}
                      disabled={isQATeamApproved}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="items-center">
            <div className="text-center text-lg font-semibold mt-[400px]">Page 7 of 7</div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Form7;
