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
  const { formData, setFormData, handleSaveSignature, handleClearSignature, sigRefs, signaturePreviews, setSignaturePreviews, handleTextareaChange, handleDateChange } = useQMSForm(vendor_onboarding, currentTab);
  const [signedDate, setSignedDate] = useState(formData?.signed_date || '');
  const [merilSignedDate, setMerilSignedDate] = useState(formData?.meril_signed_date || '');

  const leftSigField = "person_signature";
  const rightSigField = "meril_signature";

  const vendorNameInputValue = formData.mdpl_qa_vendor_name || formData.vendor_name1 || '';

  const renderSignature = (field: string) => {
    const isSigned = signaturePreviews[field];

    return !isSigned ? (
      <>
        <SignatureCanvas
          ref={sigRefs[field as keyof typeof sigRefs]}
          penColor="black"
          canvasProps={{
            width: 400,
            height: 150,
            className: 'border border-gray-300 rounded-[8px]'
          }}
        />
        <div className="mt-2 space-x-2">
          <Button
            type="button"
            onClick={(e) => handleSaveSignature(e,field as keyof typeof sigRefs)}
            className="py-2"
            variant="esignbtn"
            size="esignsize"
          >
            Save Signature
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              handleClearSignature(field as keyof typeof sigRefs);
              setSignaturePreviews(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
              });
            }}
            className="py-2"
            variant="clearesignbtn"
            size="clearesignsize"
          >
            Clear Signature
          </Button>
        </div>
      </>
    ) : (
      <div className="flex flex-col mt-2 items-start">
        <img
          src={signaturePreviews[field]}
          alt="Signature Preview"
          className="w-[400px] h-[150px] object-contain border border-gray-300 rounded-[8px]"
        />
        <div className="mt-2">
          <Button
            type="button"
            onClick={() => {
              handleClearSignature(field as keyof typeof sigRefs);
              setSignaturePreviews(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
              });
            }}
            className="text-red bg-white hover:bg-white border border-gray-300 rounded px-2 py-1"
          >
            ❌ Clear
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      signed_date: signedDate,
      meril_signed_date: merilSignedDate,

    }));
  }, [signedDate, merilSignedDate]);

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
                  <Label className='p-1 text-[14px]'>Signature:</Label>
                  {renderSignature(leftSigField)}
                </div>
                <div className="border-b-[1px] border-l-[1px] border-black p-1 flex flex-col">
                  <Label className='p-1 text-[14px]'>Signature:</Label>
                  {renderSignature(rightSigField)}
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
          <section className="items-center">
            <div className="text-center text-lg font-semibold mt-[400px]">Page 5 of 7</div>
          </section>
        </div>
      </div>
    </div>
  );
};
