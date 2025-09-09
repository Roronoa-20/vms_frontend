import React from 'react';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";

const form1 = () => {

  return (
    <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
      <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }}>
        <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">

          <Header />
          <section className='px-8 mt-6 space-y-2 z-[50] text-justify text-[16px]'>
            <div className='ml-4 space-y-3'>
              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>b.</span>
                <span className=' '>
                  Meril and Supplier are responsible as defined in the responsibilities set forth in for the steps involved in the Manufacture of each Product.
                </span>
              </div>

              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>c.</span>
                <span className=' '>
                  To the extent that there is conflict between, or ambiguity relating to, this agreement and the manufacturing agreement, provisions of manufacturing agreement shall prevail.
                </span>
              </div>

              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>d.</span>
                <span className=' '>
                  Whenever this Agreement refers to a number of days, unless otherwise specified, such number refers to calendar days.
                </span>
              </div>

              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>e.</span>
                <span className=' '>
                  The appendices (as amended from time to time by agreement of the parties in writing) form part of this agreement and have the same force and effect as if expressly set out in the body of agreement. Any reference to the agreement includes the appendices.
                </span>
              </div>

            </div>
          </section>

          <section className='px-8 mt-6 space-y-2 z-[50] text-justify text-[16px]'>
            <h1 className='font-bold border-b border-black w-fit'>4. Terms and Termination</h1>
            <div className='ml-4 space-y-3'>
              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>a.</span>
                <span className=' '>
                  This agreement shall come into effect on the effective date and shall remain in full force and effect for 05 years, unless terminated in advance. Meril shall be responsible for ensuring that this agreement is reviewed, renewed and amended with the suppliers. Such renewal shall be mutually agreed by the parties. This Agreement shall co-exist with corresponding commercial agreement executed between parties.
                </span>
              </div>

              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>b.</span>
                <span className=' '>
                  either party may terminate this agreement at any time upon written notice;<br />
                  <div className='ml-4 text-justify'>
                    (i) Should the other party fail to observe one or more of its obligations hereunder, provided that the agreement shall not be terminated if the party in default has cured the default within (30 days) after receipt of the notice describing the default; or
                  </div>  <br />
                  <div className='ml-4'>

                    (ii) If either party becomes the subject of a voluntary or involuntary petition of bankruptcy, insolvency, receivership, general assignment for the benefits of creditors, liquidation or the lie
                  </div>
                </span>
              </div>

              <div className='space-x-3 flex'>
                <span className='text-bold text-center'>c.</span>
                <span className=' '>
                  Termination or expiration of this agreement shall not affect the rights and obligations of either party that may have accrued prior to the date of termination or expiration.
                </span>
              </div>
            </div>
          </section>

          <section className="mt-6 px-8 text-[16px]">
            <h2 className="text-lg font-bold border-b-[1px] border-black w-fit">5. Confidentiality:</h2>
            <p className=" mt-2 text-justify">
              Both parties agree, during the term of this agreement and for a period of 05 years thereafter, to keep confidential and not disclose to any third party any and all confidential information of a scientific, technical or commercial nature of the other party. Notwithstanding the foregoing confidential information shall also include information which would appear to be confidential (by its contents and/or the circumstances and/or the manner in which it is disclosed) to a person having the skills to understand the information. Confidential information shall not include.
            </p>
            <div className='space-x-3 flex text-justify ml-8 mt-3'>
              <span className='text-bold'>-</span>
              <span className=''>Information required by law to be disclosed, but only to the persons and to the is ougo entes the deal perein are ay such vegumen elgare
                reasonable time to allowthe other partyto contest disclosure as its own expense;
              </span>
            </div>
          </section>

          <section className="mt-6 px-8 items-center text-center">
            <h2 className="text-lg font-bold">2 of 7</h2>

          </section>

        </div>

      </div>
    </div>
  )
}

export default form1;