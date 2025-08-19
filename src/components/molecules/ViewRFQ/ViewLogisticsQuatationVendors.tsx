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
import { AttachmentsDialog } from "../../common/MultipleFileViewDialog";
import { RFQDetails } from "@/src/types/RFQtype";
import { Badge } from '@/components/ui/badge';
import ViewQuotationServiceItems from "./ViewServiceQuotationItems";
import ViewQuotationMaterialItems from "./ViewQuotationMaterialItems";
interface Props {
    RFQData: RFQDetails;
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
    setSelectedVendorName,
    RFQData
}: Props) => {
    const exportColumns: ColumnConfig[] = [
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "Rank", key: "rank" },
        { label: "RefNo", key: "name" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Status", key: "status" },
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
    ];

    const importColumns: ColumnConfig[] = [
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "Rank", key: "rank" },
        { label: "RefNo", key: "name" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Status", key: "status" },
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
    ];

    const materialColumns: ColumnConfig[] = [
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "Rank", key: "rank" },
        { label: "RefNo", key: "name" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Status", key: "status" },
        { label: "Payment Terms", key: "payment_terms" },
        { label: "View Items", key: "quotation_item_list" },
        { label: "Attachments", key: "attachments" },
    ];
    const serviceColumns: ColumnConfig[] = [
        { label: "Select", key: "select" },
        { label: "Sr No.", key: "index" },
        { label: "Rank", key: "rank" },
        { label: "RefNo", key: "name" },
        { label: "Vendor Name", key: "vendor_name" },
        { label: "Vendor Code", key: "vendor_code" },
        { label: "Email", key: "office_email_primary" },
        { label: "Status", key: "status" },
        { label: "Payment Terms", key: "payment_terms" },
        { label: "View Items", key: "quotation_item_list" },
        { label: "Attachments", key: "attachments" },
    ];

    // const columns = logistic_type === "Export" ? exportColumns : importColumns;
    const columns = RFQData?.rfq_type === "Material Vendor" ? materialColumns : RFQData?.rfq_type === "Service Vendor" ? serviceColumns : logistic_type === "Export" ? exportColumns : importColumns;
    const getValueByKey = (
        item: QuotationDetail,
        key: QuotationColumnKey,
        index: number
    ): React.ReactNode => {
        if (key === "select") return null;
        if (key === "index") return index + 1;

        if (key === "attachments") {
            return <AttachmentsDialog attachments={item.attachments ?? []} />;
        }
        if (key === "quotation_item_list" && RFQData?.rfq_type === "Material Vendor") {
            return <ViewQuotationMaterialItems items={item.quotation_item_list ?? []} />;
        }
        if (key === "quotation_item_list" && RFQData?.rfq_type === "Service Vendor") {
            return <ViewQuotationServiceItems items={item.quotation_item_list ?? []} />;
        }

        if (key === "status") {
            const status = item.status?.toLowerCase(); // normalize case
            let colorClass = "bg-gray-200 text-gray-800";

            if (status === "approved") {
                colorClass = "bg-green-100 text-green-700";
            } else if (status === "lost") {
                colorClass = "bg-red-100 text-red-700";
            }

            return (
                <Badge className={colorClass} variant="outline">
                    {item.status}
                </Badge>
            );
        }

        const value = item[key as keyof QuotationDetail];
        if (Array.isArray(value) || typeof value === "object") {
            return "-";
        }
        return value ?? "-";
    };

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
                                                        disabled={RFQData?.status === "Approved"}
                                                    />
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