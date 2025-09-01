import React, { useEffect } from 'react';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button';

const form1 = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
  console.log("Vendor Master Data--->", vendor_onboarding);
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
  const { formData, setFormData } = useQMSForm(vendor_onboarding, currentTab);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = React.useState(today);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mdpl_qa_date: selectedDate,
    }));
  }, [selectedDate]);

  useEffect(() => {
  if (formData.vendor_title && formData.vendor_name1 && selectedDate) {
    const agreementData = {
      vendor_title: formData.vendor_title,
      vendor_name1: formData.vendor_name1,
      mdpl_qa_date: selectedDate,
    };

    localStorage.setItem("QualityAgreementInfo", JSON.stringify(agreementData));
    console.log("🧾 Stored Quality Agreement Info:", agreementData);
  }
}, [formData.vendor_title, formData.vendor_name1, selectedDate]);



  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }}>
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">

          <Header />

          <section className="text-sm leading-relaxed space-y-1 px-8 text-justify">
            <p className='text-[16px]'>
              This Quality Agreement has entered on{" "}
              <input
                type='date'
                name='date'
                className='font-bold border-b-2 border-black focus:outline-none p-0 leading-tight appearance-none'
                defaultValue={today}
                onChange={(e) => setSelectedDate(e.target.value)}
              />{" "}
              between Meril Diagnostics Pvt. Ltd.,
              having its registered office at 2nd Floor, D1-D3, Meril Park, Survey No. 135/2/B & 174/2, Muktanand Marg, Chala, Vapi – 396191, Gujarat, India (hereinafter referred to as “Meril”) represented by Mr. Ram Kanoje (Additional General Manager – Quality Assurance)
            </p>
            <p className='text-center mt-0 text-[16px]'>
              And
            </p>
            <p className='text-[16px]'>
              <span className='font-bold underline'>{formData.vendor_title} {formData.vendor_name1}</span><span className='text-[14px]'> (Hereinafter referred as “Supplier”)</span><br></br>
              Whereas, the parties have entered into the quality agreement pursuant to which supplier has agreed to manufacture/supply raw material/packing materials for Meril accordingly. Whereas, the parties wish to set terms and conditions on which they will assure the quality of products to be manufactured/supplied by the supplier.
            </p>
          </section>

          <section className="mt-6 px-8">
            <h2 className="text-lg font-bold leading-none my-0 border-b-[1px] border-black w-fit">1. Definitions:</h2>
            <span className='my-0 pl-1 text-[16px]'>Unless otherwise specially provided in this agreement, the following terms shall have the following meanings.</span>

            <ul className=" list-inside text-[16px] space-y-2 mt-2">

              <li>
                <span className="font-bold">“Agreement”</span> means this quality agreement including all appendices.
              </li>
              <li>
                <span className="font-bold">“Certificate of Analysis”</span> means a certificate containing the information and signatures set forth in the Documentation requirements.
              </li>
              <li>
                <span className="font-bold">“Manufacturer”</span> means any of the following activities: processing, packaging, labeling, storage, and distribution involved in the supply of the product.
              </li>
              <li>
                <span className="font-bold">“Parties”</span> means Meril and supplier.
              </li>
              <li>
                <span className="font-bold">“Complaint”</span> means any complaint concerning the finished product made by Meril’s customer or regulatory authority.
              </li>
              <li>
                <span className="font-bold">“Regulatory Authority”</span> means the regulatory body of any respective country.
              </li>
            </ul>
          </section>

          <section className="mt-6 px-8">
            <h2 className="text-lg font-bold border-b-[1px] border-black w-fit">2. Purpose:</h2>
            <p className="text-[16px]">
              The purpose of this agreement is to define the obligations and responsibilities of Meril and supplier relating to the quality and regulatory requirements of the manufacturer and the supply to Meril of each product in accordance with standard specifications, applicable laws, and regulations.
            </p>
          </section>

          <section className='px-8 mt-6 space-y-2 z-[50] text-justify text-[15px]'>
            <h1 className='font-bold border-b border-black w-fit'>3. Construction and Interpretation:</h1>
            <div className='ml-4 space-y-2'>
              <div className='space-x-3 flex'>
                <span className='text-bold text-center text-[16px]'>a.</span>
                <span className='text-[16px]'>
                  The construction and interpretation of this Agreement shall be governed in accordance with the Indian Law and the parties hereby submit to the jurisdiction of the courts of Gujarat, India. Excluding any conflicts or choice of law rule or principle that might otherwise refer construction or interpretation of this Agreement to the substantive law of another jurisdiction.</span>
              </div>
            </div>
          </section>
          {/* <Button
            onClick={() => {
              console.log("🔥 Form 5 Data Preview:", formData);
              alert("Check the console! 🔍");
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Preview Form 5 Data
          </Button> */}
          <section className="mt-6 px-8 items-center text-center">
            <h2 className="text-lg font-bold">1 of 7</h2>

          </section>
        </div>

      </div>
    </div>
  )
}

export default form1;