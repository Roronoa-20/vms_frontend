    import React from "react";
    import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    } from "@/components/ui/carousel";
    import Image from "next/image";
    const Slider = () => {
    return (
        // <Carousel
        // opts={{
        //     align: "center",
        //     loop: true,
        //     active:true
        // }}
        // >
        //     <CarouselContent>
        //     <CarouselItem><Image src={"/login-assests/carousal-assests/carousalimage1.webp"} alt=""width={650} height={300} className="object-contain"/></CarouselItem>
        //     <CarouselItem><Image src={"/login-assests/carousal-assests/carousalimage2.webp"} alt=""width={650} height={300} /></CarouselItem>
        //     <CarouselItem><Image src={"/login-assests/carousal-assests/carousalimage3.webp"} alt=""width={650} height={300} /></CarouselItem>
        //     </CarouselContent>
        //     <CarouselPrevious />
        //     <CarouselNext />
        // </Carousel>
        <Image src={"/login-assests/carousal-assests/carousalimage1.webp"} alt="" layout="fill"/>
    );
    };

    export default Slider;
