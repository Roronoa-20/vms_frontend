import React from 'react';
import Image from 'next/image';
import Header from "@/src/components/molecules/mdpl-quality-agreement/header";


const form4 = () => {
    return (
        <div className="space-y-[32px] flex flex-col justify-between min-h-[80vh]">
            <div style={{ boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.05)' }} className='space-y-10' >
                <div className="bg-white text-black px-4 pb-8 pt-4 mx-auto border border-gray-300">
                    <Header />
                    {/* start General section  */}
                    <section className='ml-8 space-y-2 z-[50] text-justify text-[16px]'>
                        <div className='ml-8 space-y-2 text-justify pr-16'>
                            <div className='space-x-3 flex pl-6'>
                                <span className=''>
                                    quality records. Supplier shall supply any non-proprietary information needed by Meril for registration of its product where the products are used. The supplier shall assist Meril in replying to the queries from registration authorities which are related to the products.
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>h.</span>
                                <span className=' '>
                                    If a third party is used by supplier to manufacture, package, irradiate, testing or release the product(s) supplier to Meril, supplier shall ensure that the third party has been fully qualified via a qualification process in accordance with supplier’s procedure (if applicable). Supplier shall retain all obligations under this agreement whether a third party is used
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>i.</span>
                                <span className=' '>
                                    If Meril gets any quality related events from its customer which is attributed to the products, Meril Shall forward such complaint to the supplier in case the events has placed at the suppliers end. The supplier shall investigate such complaint and give the investigation report to Meril in reasonable time. The supplier shall co-operate with Meril in establishing the root cause of the complaint and in resolving the issue.
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>j.</span>
                                <span className=' '>
                                    Meril, along with the Notified body (NB) and/or Regulatory Authority (RA) reserve the right to audit the quality management system and/or manufacturing facility of the supplier. The supplier shall allow the Meril’s designated persons; it’s NB and RA to conduct such audits. Meril shall inform the supplier of such audit well in advance and the time of audit shall be decided as per mutual convenience. However, NB and RA may audit with pre-notifications or can conduct as unannounced audit. In either the case, supplier shall immediately notify Meril. Meril shall conduct suppliers audit as per in house procedure. However, Meril shall request additional “for cause” audits to address specific quality concerns. Supplier shall agree to carry out corrective action for non-conformance issues noticed during such audits.
                                </span>
                            </div>
                            <div className='space-x-3 flex'>
                                <span className='text-bold text-center'>k.</span>
                                <span className=' '>
                                    Supplier shall notify Meril promptly of any changes in the ownership of the supplier and any significant changes in supplier’s top management structure.
                                </span>
                            </div>

                        </div>
                    </section>

                    <section className='ml-8 space-y-2 z-[50] text-justify text-[16px]'>
                        <h1 className='font-bold border-b border-black w-fit mt-6'>6. Appendices to the agreement</h1>
                        <div className='space-y-2 text-justify pr-16'>
                            <div className='mt-5 flex flex-col'>
                                <span>
                                    Appendix I – List of the purchased material / activity
                                </span>
                                <span>
                                    Appendix II – Contact person details
                                </span>

                            </div>

                        </div>
                    </section>

                    {/* START FOOTER   */}
                    <section className="items-center">
                        <div className="text-center text-lg font-semibold mt-36">Page 4 of 7</div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default form4