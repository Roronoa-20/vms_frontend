import React from 'react';
import Image from 'next/image';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";


const form3 = () => {
    return (
        <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
            <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }} className='space-y-10' >
                <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">

                    {/* START HEADER SECTION  */}
                    {/* <section className="grid grid-cols-3 items-center">
                            <div className="relative w-[130px] h-[100px]">
                                <Image
                                    src="/images/Meril-Diagnostics.svg"
                                    alt="Diagnostics logo"
                                    fill
                                    priority
                                    sizes="auto"
                                />
                            </div>
                            <h1 className="text-center text-lg font-semibold text-[10px] md:text-[13px] xl:text-[19px] leading-5">
                                Supplier Quality Agreement
                            </h1>
                        </section> */}

                    <Header />
                    {/* Start body  */}
                    <section className='px-8 ml-8 mt-2 space-y-2 z-[50] relative text-justify text-[16px]'>
                        <div className='space-x-3 flex'>
                            <span className='text-bold'>-</span>
                            <span className='leading-relaxed'>Information required by law to be disclosed, but only to the persons and to the is ougo entes the deal perein are ay such vegumen elgare
                                reasonable time to allowthe other partyto contest disclosure as its own expense;
                            </span>
                        </div>
                        <div className='space-x-3 flex '>
                            <span className='text-bold'>-</span>
                            <span className=' '>Information, which the receiving party can show, with written records, was already in its possession before disclosure hereunder;
                            </span>
                        </div>
                        <div className='space-x-3 flex '>
                            <span className='text-bold'>-</span>
                            <span className='text-justify'>
                                Information which was lawfully disclosed to the receiving party by a third party without restrictions; or
                            </span>
                        </div>
                        <div className='space-x-3 flex '>
                            <span className='text-bold'>-</span>
                            <span className=' '>
                                Information which can be shown through written records to have been independently developed by the receiving party without aid, application or use of any confidential information.
                            </span>
                        </div>
                    </section>

                    {/* start General section  */}
                    <section className='ml-8 space-y-2 z-[50] relative text-justify text-[16px]'>
                        <h1 className='font-bold border-b border-black w-fit mt-6'>5. General</h1>
                        <div className='ml-8 space-y-2 text-justify pr-16'>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>a.</span>
                                <span className=' '>
                                    The supplier shall ensure that it registers with local regulatory agencies / authorities & comply with all necessary regulatory requirements as applicable ISO 9001 / ISO 13485 / NABL / CE / WHO / USFDA / GMP certificates etc. as applicable for the products and shall ensure renewal of such regulatory approvals time to time. Supplier shall intimate Meril in case any of the regulatory approvals are renewed, revised or withdrawn
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>b.</span>
                                <span className=' '>
                                    Supplier shall ensure that all activities carried out at all sites, including manufacturing, storage, Quality control, dispatch shall comply with the applicable standards. Rules and regulations.
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>c.</span>
                                <span className=' '>
                                    Meril and the supplier have agreed to specifications of the products (as per the product/raw material). The supplier shall ensure that the products meet the specifications. The supplier shall not change the specifications without notifying Meril of such modification in advance and take Meril’s approval in writing before implementing any such change. Changes shall be communicated with the respective regulatory bodies and approval shall be taken.
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>d.</span>
                                <span className=' '>
                                    Supplier shall release each batch of each product in accordance with supplier’s procedure, as per agreed specification with Meril. In the event of any deviation, supplier shall not make a batch release decision without prior informing to Meril
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>e.</span>
                                <span className=' '>
                                    Each lot of the products supplier by the supplier to Meril shall accompany a “Certificate of Analysis” to the specification agreed between both the parties. All sterile products must be supplied along with the sterilization certificate.
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>f.</span>
                                <span className=' '>
                                    Supplier shall maintain quality records up to the shelf life of the product from the date of manufacturing. After the expiry of the shelf life, supplier shall follow in-house procedure for disposal of records
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>g.</span>
                                <span className=' '>
                                    Supplier shall provide additional document in written communication as requested during any of the Quality/Regulatory audit. In the event that the business relationship is terminated, the supplier shall maintain and provide Meril an access to the appropriate
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* START FOOTER   */}
                    <section className="items-center mt-6">
                        <div className="text-center text-lg font-semibold">Page 3 of 7</div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default form3