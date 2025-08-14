import { RFQDetails } from "@/src/types/RFQtype";

export interface iteminterface {
    key: keyof RFQDetails
    label:string | undefined
}
type Props = {
    item:iteminterface
    RFQData:RFQDetails;
}
export default function RFQDatas({item,RFQData}:Props) {
  return (
    <>
      <div className="grid-cols-1 px-2 ">
        <ul>
          <li className="border-b p-1 cursor-pointer text-sm">
            {item?.label ? item?.label : "-"}
            <span className="font-semibold px-1 w-full break-words whitespace-normal">{RFQData[item.key] != null ? String(RFQData[item.key]) : "-"}</span>
          </li>
        </ul>
      </div>
    </>
  );
}
