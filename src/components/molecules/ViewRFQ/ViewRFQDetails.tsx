import { RFQDetails } from "@/src/types/RFQtype";
import React from "react";
import { RFQlogicIm, RFQlogicEx, RFQmaterial, RFQservices} from "@/src/constants/RFQshowData";
import RFQDatas from "./RFQDatas"; 

interface Props {
  RFQData: RFQDetails;
}

const RFQBasicDetails = ({ RFQData }: Props) => {
console.log(RFQData,"RFQData")
return (
  <>
    <div className="bg-white">
      <div className="border rounded-md mb-7 px-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {RFQData?.logistic_type === "Import" &&
                RFQlogicIm.map((item, index) => (
                  <div key={index}>
                    <RFQDatas RFQData={RFQData} item={item}/>
                  </div>
              ))}
            </div>
            
            {/*RFQ Export*/} 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {RFQData?.logistic_type === "Export" &&
                RFQlogicEx.map((item, index) => (
                  <div key={index}>
                    <RFQDatas RFQData={RFQData} item={item}/>
                  </div>
                ))}
            </div>

          {/*RFQ material*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {RFQData?.rfq_type === "Material Vendor" &&
              RFQmaterial.map((item, index) => (
                <div key={index}>
                  <RFQDatas RFQData={RFQData} item={item}/>
                </div>
              ))}
          </div>

          {/*RFQ service*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
            {RFQData?.rfq_type === "Service Vendor" &&
              RFQservices.map((item, index) => (
                <div key={index}>
                   <RFQDatas RFQData={RFQData} item={item}/>
                </div>
              ))}
          </div>
        </div>    
      </div>
    </>
  );
};

export default RFQBasicDetails;
