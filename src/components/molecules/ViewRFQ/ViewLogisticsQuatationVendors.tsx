// import React from 'react'
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/src/components/atoms/table";
// import { Input } from '@/components/ui/input';
// import { QuotationDetail } from '@/src/types/QuatationTypes';
// import { Button } from '@/components/ui/button';
// interface Props {
//     QuatationData: QuotationDetail[];
//     refno?: string;
//     handleVendorSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
// }
// const ViewLogisticsQuatationVendors = ({ QuatationData, handleVendorSearch }: Props) => {
//     return (
//         <div>
//             <div className="flex w-full justify-between py-2 ">
//                 <h1 className='text-lg py-2 font-semibold'>Bidding Brief Details</h1>
//                 <div className="flex gap-4 w-[25%]">
//                     <Input placeholder="Search..." onChange={(e => { handleVendorSearch(e) })} />
//                 </div>
//             </div>
//             <div className="overflow-y-scroll max-h-[55vh]">
//                 <Table className="">
//                     <TableHeader className="text-center">
//                         <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
//                             <TableHead className="">Sr No.</TableHead>
//                             <TableHead className="text-center">Vendor Name</TableHead>
//                             <TableHead className="text-center">Vendor Code</TableHead>
//                             <TableHead className="text-center">Shipment Mode</TableHead>
//                             <TableHead className="text-center">Airline / Vessel Name</TableHead>
//                             <TableHead className="text-center">Rate Per Kg</TableHead>
//                             <TableHead className="text-center">Fuel Surcharge</TableHead>
//                             <TableHead className="text-center">SC</TableHead>
//                             <TableHead className="text-center">XRAY</TableHead>
//                             <TableHead className="text-center">Others Charges in Total</TableHead>
//                             <TableHead className={`text-center`}>Chargeable Weight</TableHead>
//                             <TableHead className="text-center">Total Freight FCR</TableHead>
//                             <TableHead className={`text-center`}>Expected Delivery in No of Days</TableHead>
//                             <TableHead className="text-center">Remarks</TableHead>
//                             <TableHead className={`text-center`}>Action</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody className="text-center bg-white">
//                         {QuatationData.length > 0 ? (
//                             QuatationData?.map((item, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell className="font-medium text-center">{index + 1}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.vendor_name}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.vendor_code}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.mode_of_shipment}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.airlinevessel_name}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.ratekg}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.fuel_surcharge}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.sc}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.xray}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.other_charges_in_total}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.chargeable_weight}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.total_freight}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.expected_delivery_in_no_of_days}</TableCell>
//                                     <TableCell className="text-nowrap text-center">{item?.remarks}</TableCell>
//                                     <TableCell className="text-nowrap text-center"><Button className="bg-white text-black hover:bg-white hover:text-black">View</Button></TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={9} className="text-center text-gray-500 py-4">
//                                     No results found
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>

//                 </Table>
//             </div>
//         </div>
//     )
// }

// export default ViewLogisticsQuatationVendors

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { Input } from '@/components/ui/input';
import { QuotationDetail } from "@/src/types/QuatationTypes";
import { Button } from '@/components/ui/button';
import { AttachmentsDialog } from "../../common/MultipleFileViewDialog";
interface Props {
    QuatationData: QuotationDetail[];
    logistic_type: string;
    handleVendorSearch: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    selectedVendorName: string;
    setSelectedVendorName: (name: string) => void;
}

type QuotationColumnKey = keyof QuotationDetail | "index" | "action" | "select";

interface ColumnConfig {
    label: string;
    key: QuotationColumnKey;
}

const ViewLogisticsQuatationVendors = ({
    QuatationData,
    logistic_type,
    handleVendorSearch,
    selectedVendorName,
    setSelectedVendorName
}: Props) => {
    const exportColumns: ColumnConfig[] = [
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "RefNo", key: "name" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Shipment Mode", key: "mode_of_shipment" },
        { label: "Airline / Vessel Name", key: "airlinevessel_name" },
        { label: "Rate Per Kg", key: "ratekg" },
        { label: "Fuel Surcharge", key: "fuel_surcharge" },
        { label: "SC", key: "sc" },
        { label: "XRAY", key: "xray" },
        { label: "Others Charges in Total", key: "other_charges_in_total" },
        { label: "Chargeable Weight", key: "chargeable_weight" },
        { label: "Total Freight FCR", key: "total_freight" },
        { label: "Expected Delivery in No of Days", key: "expected_delivery_in_no_of_days" },
        { label: "Remarks", key: "remarks" },
        { label: "Attachments", key: "attachments" },
        { label: "Action", key: "action" },
    ];

    const importColumns: ColumnConfig[] = [
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "RefNo", key: "name" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Shipment Mode", key: "mode_of_shipment" },
        { label: "AirLine Name", key: "airlinevessel_name" },
        { label: "Weight", key: "destination_port" },
        { label: "Rate Per Kg", key: "ratekg" },
        { label: "FSC", key: "fuel_surcharge" },
        { label: "SC", key: "sc" },
        { label: "XRAY", key: "xray" },
        { label: "Pick Up Charge", key: "pickuporigin" },
        { label: "Ex Works Charges FCR", key: "ex_works" },
        { label: "Freight FCR", key: "total_freight" },
        { label: "Currency Type From", key: "from_currency" },
        { label: "Currency Type To", key: "to_currency" },
        { label: "XCR", key: "exchange_rate" },
        { label: "Sum Freight INR", key: "total_freightinr" },
        { label: "DC", key: "destination_charge" },
        { label: "Shipping Charges", key: "shipping_line_charge" },
        { label: "CFS Charges", key: "cfs_charge" },
        { label: "Landing Price", key: "total_landing_price" },
        { label: "Transit Days", key: "transit_days" },
        { label: "Remarks", key: "remarks" },
        { label: "Attachments", key: "attachments" },
        { label: "Action", key: "action" },
    ];

    const columns = logistic_type === "Export" ? exportColumns : importColumns;
    const getValueByKey = (
        item: QuotationDetail,
        key: QuotationColumnKey,
        index: number
    ): React.ReactNode => {
        if (key === "select") return null;
        if (key === "index") return index + 1;
        if (key === "action") return null;

        if (key === "attachments") {
            return <AttachmentsDialog attachments={item.attachments ?? []} />;
        }
        const value = item[key as keyof QuotationDetail];
        // Prevent non-primitive types like arrays or objects from being returned directly
        if (Array.isArray(value) || typeof value === "object") {
            return "-";
        }
        return value ?? "-";
    };
console.log(selectedVendorName,"selectedVendorName")
    console.log(logistic_type, "logistic_typelogistic_typelogistic_typelogistic_typelogistic_type")
    return (
        <div>
            <div className="flex w-full justify-between py-2 ">
                <h1 className="text-lg py-2 font-semibold">Bidding Brief Details</h1>
                <div className="flex gap-4 w-[25%]">
                    <Input placeholder="Search..." onChange={handleVendorSearch} />
                </div>
            </div>
            <div className="overflow-y-scroll max-h-[90vh]">
                <Table>
                    <TableHeader className="text-center hover:none">
                        <TableRow className="bg-[#DDE8FE]  hover:bg-[#DDE8FE] text-[#2568EF] text-[14px]">
                            {columns.map((col, idx) => (
                                <TableHead key={idx} className="text-center">{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center bg-white">
                        {QuatationData.length > 0 ? (
                            QuatationData.map((item, index) => (
                                <TableRow key={index}>
                                    {columns.map((col, idx) => {
                                        if (col.key === "select") {
                                            return (
                                                <TableCell key={idx} className="text-center">
                                                    <input
                                                        type="radio"
                                                        name="vendor-selection"
                                                        checked={item.name === selectedVendorName}
                                                       onChange={() => setSelectedVendorName(item.name)}
                                                        className="h-4 w-4"
                                                    />
                                                </TableCell>
                                            );
                                        }
                                        if (col.key === "action") {
                                            return (
                                                <TableCell key={idx} className="text-center">
                                                    <Button className="bg-white text-black hover:bg-white hover:text-black">
                                                        View
                                                    </Button>
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell key={idx} className={`text-center ${col.key === "name" ? "text-nowrap" : ""}`}>
                                                {getValueByKey(item, col.key, index)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
export default ViewLogisticsQuatationVendors