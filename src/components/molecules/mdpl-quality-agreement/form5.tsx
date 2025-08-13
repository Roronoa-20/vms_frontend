import React, { useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQMSForm } from '@/src/hooks/useQMSForm';
import { useSearchParams } from 'next/navigation';

export const Form5 = ({ vendor_onboarding }: { vendor_onboarding: string }) => {
  const params = useSearchParams();
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor_information";
  const { formData, setFormData, handleSaveSignature, handleClearSignature, sigRefs, signaturePreviews, handleTextareaChange, handleDateChange } = useQMSForm(vendor_onboarding, currentTab);
  const [signedDate, setSignedDate] = useState(formData?.signed_date || '');
  const [merilSignedDate, setMerilSignedDate] = useState(formData?.meril_signed_date || '');

  const vendorNameInputValue = formData.mdpl_qa_vendor_name || formData.vendor_name1 || '';

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      signed_date: signedDate,
      meril_signed_date: merilSignedDate,

    }));
  }, [signedDate, merilSignedDate]);

  useEffect(() => {
    const {
      name_of_person,
      designation_of_person,
      signed_date,
      meril_signed_date,
    } = formData;
    const {
      person_signature,
      meril_signature
    } = signaturePreviews;

    const allFieldsPresent = name_of_person && designation_of_person && signed_date && meril_signed_date && person_signature && meril_signature;

    if (allFieldsPresent) {
      const signatureData = {
        name_of_person,
        designation_of_person,
        signed_date,
        meril_signed_date,
        person_signature,
        meril_signature,
      };
      localStorage.setItem("QualityAgreementSignatures", JSON.stringify(signatureData));
      console.log("✅ Stored Signature Info:", signatureData);
    } else {
      console.warn("❌ Missing fields - not saving to localStorage", {
        name_of_person,
        designation_of_person,
        signed_date,
        meril_signed_date,
        person_signature,
        meril_signature
      });
    }
  }, [formData, signaturePreviews]);




  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }} className='space-y-10'>
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">
          <Header />
          <section className='ml-8 space-y-2 z-[50] relative text-justify text-[16px]'>
            <h1 className='font-bold border-b border-black w-fit'>Authorization</h1>
            <div className='space-y-2 text-justify pr-16'>
              <p>
                It is agreed and warranted by the parties that the individuals signing this document on behalf of the
                respective parties are duly authorized to execute such an Agreement. No further proof of authorization is
                or shall be required. A pdf or electronic scan of this agreement shall have the same force and effect as
                an original.
              </p>
              <p>IN WITNESS WHEREOF, the parties hereto have caused these presents to be executed as of the date hereof.</p>
              <div className='grid grid-cols-2 mt-5 border-[1px] border-black font-semibold'>
                {/* Vendor Info */}
                <div className="border-b-[1px] border-black p-1 flex flex-col">
                  <span className='font-normal text-[14px]'>Signed for and on behalf of</span>
                  <input
                    type='text'
                    name='mdpl_qa_vendor_name'
                    placeholder='Supplier name'
                    className='outline-none'
                    value={vendorNameInputValue}
                    readOnly
                  />
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex flex-col">
                  <span className='font-normal text-[14px]'>Signed for and on behalf of</span>
                  <input
                    type='text'
                    name='supplier_company_name'
                    className='outline-none'
                    value="Meril Diagnostics Private Limited"
                    readOnly
                  />
                </div>

                {/* Name */}
                <div className="border-b-[1px] border-black p-1 flex space-x-2 items-center">
                  <Label className="text-[14px]">Name:</Label>
                  <Input
                    type="text"
                    name="name_of_person"
                    className='w-full min-h-auto outline-none'
                    value={formData.name_of_person ?? ''}
                    onChange={(e) => handleTextareaChange(e, ("name_of_person"))}
                  />
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex space-x-2 items-center">
                  <Label className="text-[14px]">Name:</Label>
                  <input
                    type="text"
                    className='w-full min-h-auto outline-none font-semibold'
                    value={'Mr. Ram Kanoje'}
                    readOnly
                  />
                </div>

                {/* Designation */}
                <div className="border-b-[1px] border-black p-1 flex space-x-2">
                  <Label className="text-[14px]">Designation:</Label>
                  <Input
                    type="text"
                    name="designation_of_person"
                    className='w-full min-h-auto outline-none'
                    value={formData.designation_of_person ?? ''}
                    onChange={(e) => handleTextareaChange(e, ("designation_of_person"))}
                  />
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex space-x-2">
                  <Label className="text-[14px]">Designation:</Label>
                  <textarea
                    className='w-full min-h-auto outline-none'
                    readOnly
                    value={'Additional General Manager –\n(Quality Assurance)'}
                  />
                </div>

                {/* Signatures */}
                <div className="border-b-[1px] border-black p-1 flex flex-col">
                  <Label className='p-1 text-[14px]'>Vendor Signature:</Label>
                  <div className="flex flex-col mt-4">
                    {!signaturePreviews["person_signature"] && (
                      <SignatureCanvas
                        ref={sigRefs.person_signature}
                        penColor="black"
                        canvasProps={{ width: 400, height: 150, className: 'border border-gray-300' }}
                      />
                    )}

                    {!signaturePreviews["person_signature"] && (
                      <div className="mt-2 space-x-2">
                        <Button variant="esignbtn" size="esignsize" onClick={(e) => handleSaveSignature(e, ("person_signature"))} className="py-2">
                          Save Signature
                        </Button>
                        <Button variant="clearesignbtn" size="clearesignsize"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClearSignature("person_signature");
                          }}
                          className="py-2">
                          Clear Signature
                        </Button>
                      </div>
                    )}

                    {signaturePreviews["person_signature"] && (
                      <div className="flex items-center mt-2">
                        <img src={signaturePreviews["person_signature"]} alt="Signature Preview" className="w-40 h-20 object-contain" />
                        <Button onClick={() => handleClearSignature("person_signature")} className="ml-2 text-red-500 cursor-pointer">
                          &#x2715;
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex flex-col">
                  <Label className='p-1 text-[14px]'>Signature:</Label>
                  <div className="flex flex-col mt-4">
                    {!signaturePreviews["meril_signature"] && (
                      <SignatureCanvas
                        ref={sigRefs.meril_signature}
                        penColor="black"
                        canvasProps={{ width: 400, height: 150, className: 'border border-gray-300' }}
                      />
                    )}

                    {!signaturePreviews["meril_signature"] && (
                      <div className="mt-2 space-x-2">
                        <Button variant="esignbtn" size="esignsize" onClick={(e) => handleSaveSignature(e, ("meril_signature"))} className="py-2">
                          Save Signature
                        </Button>
                        <Button variant="clearesignbtn" size="clearesignsize"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClearSignature("meril_signature");
                          }}
                          className="py-2">
                          Clear Signature
                        </Button>
                      </div>
                    )}

                    {signaturePreviews["meril_signature"] && (
                      <div className="flex items-center mt-2">
                        <img src={signaturePreviews["meril_signature"]} alt="Signature Preview" className="w-40 h-20 object-contain" />
                        <Button onClick={() => handleClearSignature("meril_signature")} className="ml-2 text-red-500 cursor-pointer">
                          &#x2715;
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="border-black p-1 flex space-x-2 items-center">
                  <Label>Date:</Label>
                  <Input
                    type="date"
                    name="signed_date"
                    className='w-full min-h-auto outline-none'
                    value={formData.signed_date ?? ''}
                    onChange={(e) => handleDateChange("signed_date", e.target.value)}
                  />
                </div>
                <div className="border-l-[1px] border-black p-1 flex space-x-2 items-center">
                  <Label>Date:</Label>
                  <Input
                    type="date"
                    name="meril_signed_date"
                    className='w-full min-h-auto outline-none'
                    value={formData.meril_signed_date ?? ''}
                    onChange={(e) => handleDateChange("meril_signed_date", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
          <Button
            onClick={() => {
              console.log("🔥 Form 5 Data Preview:", formData);
              alert("Check the console! 🔍");
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Preview Form 5 Data
          </Button>

          <section className="items-center">
            <div className="text-center text-lg font-semibold mt-[400px]">Page 5 of 7</div>
          </section>
        </div>
      </div>
    </div>
  );
};
