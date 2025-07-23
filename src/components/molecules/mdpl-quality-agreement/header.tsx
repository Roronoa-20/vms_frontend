import React from 'react'
import Image from 'next/image'

const header = () => {
    return (
        <section className="grid grid-cols-3 items-center">
            <div className="relative w-[130px] h-[100px]">
                <Image
                    src="/meril-logo/meril-diagnostics.svg"
                    alt="Diagnostics logo"
                    fill
                    priority
                    sizes="auto"
                />
            </div>
            <h1 className="text-center text-lg font-semibold text-[10px] md:text-[13px] xl:text-[19px] leading-5">
                Supplier Quality Agreement
            </h1>
        </section>
    )
}

export default header