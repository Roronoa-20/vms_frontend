
// To CREATE AND VIEW THE PR FORM CREATED WITHOUT PURCHASE ENQUIRY

"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { AccountAssignmentCategory, ItemCategoryMaster, ProfitCenter, PurchaseGroup, PurchaseOrganisation, PurchaseRequestData, PurchaseRequestDropdown, StorageLocation, ValuationArea, ValuationClass } from '@/src/types/PurchaseRequestType'
import { AlertCircleIcon, CheckCircle2Icon, Edit2Icon } from 'lucide-react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import Cookies from 'js-cookie'
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubItemModal from '../molecules/pr-dialogs/SubItemDialog'
import EditSBItemModal from '../molecules/pr-dialogs/EditSBDialog'
import EditNBItemModal from '../molecules/pr-dialogs/EditNBDilaog'
import { PurchaseRequisitionDataItem, PurchaseRequisitionResponse, SubheadField } from '@/src/types/PurchaseRequisitionType'
import SummaryBlock from '../molecules/pr-dialogs/SummaryBlock'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'
import { Alert, AlertDescription, AlertTitle, AlertFooter } from "@/components/ui/alert"
import { ApproveConfirmationDialog } from '../common/ApproveConfirmationDialog';
import Comment_box from '../molecules/CommentBox'

interface Props {
    Dropdown: PurchaseRequestDropdown["message"]
    PRData: PurchaseRequestData["message"]["data"] | null
    cartId?: string
    pur_req?: string
    prf_name?: string
    PurchaseGroupDropdown: PurchaseGroup[]
    ProfitCenterDropdown: ProfitCenter[]
    PurchaseOrgDropdown: PurchaseOrganisation[]
    company: string
}

export const updateQueryParam = (key: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.toString());
};

const NewPRRequestForm = ({ company, Dropdown, PRData, cartId, pur_req, PurchaseGroupDropdown, ProfitCenterDropdown, PurchaseOrgDropdown, prf_name }: Props) => {
    const user = Cookies.get("user_id");
    console.log(PRData, "kjnmjnhghjngfghbfgvbnhfdgvb")
    const { designation } = useAuth();
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<PurchaseRequestData["message"]["data"] | null>(PRData ? { ...PRData, requisitioner: PRData?.requisitioner } : null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [expandedRowNames, setExpandedRowNames] = useState<string[]>([]);
    const [editRow, setEditRow] = useState<PurchaseRequisitionDataItem>()
    const [editSubItemRow, setEditSubItemRow] = useState<SubheadField | null>(null)
    const [mainItems, setMainItems] = useState<PurchaseRequisitionResponse>()
    const [isSubItemModalOpen, setIsSubItemModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isNBEditModalOpen, setNBEditModalOpen] = useState(false)
    const [editAction, setEditAction] = useState(false)
    const [selectedMainItemId, setSelectedMainItemId] = useState<string>("")
    const [accountAssigmentDropdown, setAccountAssignmentDropdown] = useState<AccountAssignmentCategory[]>([])
    const [itemCategoryDropdown, setitemCategoryDropdown] = useState<ItemCategoryMaster[]>([])
    const [currentValue, setCurrentValue] = useState<number>(10);

    const [sendEmailDialog, setSendEmailDialog] = useState<boolean>(false);

    const [comment, setComment] = useState<string>("");

    const deleteSubItem = async (subItemId: string) => {
        console.log(subItemId, "subItemId", pur_req, "pur_req")
        const url = `${API_END_POINTS?.PrSubHeadDeleteRow}?name=${pur_req}&row_id=${subItemId}`;
        const response: AxiosResponse = await requestWrapper({ url: url, method: "POST" });
        if (response?.status == 200) {
            fetchTableData(pur_req ?? "")
            alert("Deleted successfull");
        } else {
            alert("error");
        }
    }

    const toggleMainItemExpansion = (row_name: string) => {
        setExpandedRowNames(prev =>
            prev.includes(row_name)
                ? prev.filter(name => name !== row_name)
                : [...prev, row_name]
        );
    };

    const openSubItemModal = (mainItemId: string, subhead_fields: SubheadField[]) => {
        const lastValue = subhead_fields?.length ? Number(subhead_fields.at(-1)?.item_number_of_purchase_requisition_subhead ?? 0) : 0;
        const nextValue: number = lastValue > 0 ? lastValue + 10 : 10;
        setCurrentValue(nextValue);
        setSelectedMainItemId(mainItemId);
        setIsSubItemModalOpen(true);
    };

    const handleFieldChange = useCallback(
        (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
        ) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }) as PurchaseRequestData["message"]["data"]);
            if (value.trim() !== "") {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        },
        []
    );

    const handleSelectChange = useCallback(
        (value: any, name: string) => {

            setFormData((prev) => ({ ...prev, [name]: value }) as PurchaseRequestData["message"]["data"]);
            if (value !== "") {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        },
        []
    );

    const handleSubmit = async () => {
        if (!(mainItems?.docname)) {
            alert("Not able to Submit , PR Request No. Required")
            return
        }
        const url = `${API_END_POINTS?.SubmitPR}?name=${pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}`;
        const response: AxiosResponse = await requestWrapper({ url: url, method: "POST" });
        if (response?.status == 200) {
            alert("Submit Successfull");
            router.push("/dashboard")
        } else {
            alert("error");
        }
    };

    const handleApprove = async () => {
        if (!(mainItems?.docname)) {
            alert("Not able to Submit , PR Request No. Required")
            return
        }
        const url = `${API_END_POINTS?.approvePR}?name=${pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}&approve=1`;
        const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { "data": { "name": `${pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}`, "approve": 1 } } });
        if (response?.status == 200) {
            alert("Submit Successfull");
            router.push("/dashboard")
        } else {
            alert("error");
        }
    };

    const fetchTableData = async (pur_req: string, prf_name?: string) => {
        console.log(pur_req, "pur_req in table code");
        try {
            let url = "";
            if (pur_req) {
                url = `${API_END_POINTS?.fetchPRTableData}?name=${pur_req}`;
            } else {
                url = `${API_END_POINTS?.fetchPRFDoctypeData}?prf_name=${prf_name}`;
            }
            const response: AxiosResponse = await requestWrapper({ url, method: "GET", });
            if (response?.status === 200) {
                console.log(response, "response of table data------------------------------------------");
                setMainItems(response.data.message);
            } else {
                alert("Error fetching PR data");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while fetching PR data.");
        }
    };


    const handleNext = async () => {
        try {
            const url = API_END_POINTS.createPR;
            const response: AxiosResponse = await requestWrapper({ url, data: { data: { ...formData, requisitioner: user } }, method: "POST" });

            if (response?.status === 200) {
                const purReqName = response.data.message.name;
                updateQueryParam("pur_req", purReqName);
                fetchTableData(purReqName, "");
                alert("Submitted Successfully");
            } else {
                alert("Error");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };


    const handleModel = (purchase_requisition_type?: string) => purchase_requisition_type === "SB" ? setEditModalOpen(true) : setNBEditModalOpen(true);

    const fetchAccountAssigmentData = async (pur_req_type: string) => {
        const url = `${API_END_POINTS.fetchAccountAssignmentData}?pur_req_type=${pur_req_type}&company=${company}`;
        try {
            const response: AxiosResponse = await requestWrapper({ url, method: "GET" });
            if (response?.status === 200 && response?.data?.message) {
                console.log("Account Assignment API success:", response);
                setAccountAssignmentDropdown(response.data.message.account_assignment_category_head ?? []);
                setitemCategoryDropdown(response.data.message.item_category_head ?? []);
            } else {
                console.warn("Account Assignment API returned unexpected response", response);
            }
        } catch (error) {
            console.error("Account Assignment API failed silently", error);
        }
    };

    const handleEmailToPurchaseTeam = async () => {
        const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.prToPurchaseTeam, params: { name: pur_req, enquirer_remarks: comment }, method: "POST" });
        if (response?.status == 200) {
            alert("Email sent to purchase team successfully");
            handleClose();
            router.push("/dashboard")
            return;
        }
    }

    const handleClose = () => {
        setSendEmailDialog(false);
    };

    useEffect(() => {
        if (pur_req || prf_name) {
            fetchTableData(pur_req ?? "", prf_name ?? "");
        }
        if (PRData?.purchase_requisition_type) {
            fetchAccountAssigmentData(PRData?.purchase_requisition_type ?? "");
        }
    }, [pur_req, prf_name, PRData?.purchase_requisition_type]);

    console.log(mainItems, "pr drardtafdtf")

    return (
        <div className="flex flex-col bg-white rounded-lg max-h-[80vh] w-full">
            <div className="grid grid-cols-3 gap-6 p-3">
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Purchase Request Type <span className="text-red-600 ml-1">*</span>
                    </h1>
                    <Select
                        onValueChange={(value) => { handleSelectChange(value, "purchase_requisition_type") }}
                        value={formData?.purchase_requisition_type ? formData?.purchase_requisition_type : mainItems?.purchase_requisition_type ?? ""}
                        disabled={mainItems?.docname ? true : false}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Dropdown?.purchase_requisition_type?.map((item, index) => (
                                    <SelectItem key={index} value={item?.name}>{item?.purchase_requisition_type_code} - {item?.description}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Company Code Area <span className="text-red-600 ml-1">*</span>
                    </h1>
                    <Select
                        value={formData?.company ? formData?.company : mainItems?.Company[0].name ?? ""}
                        onValueChange={(value) => { handleSelectChange(value, "company") }}
                        disabled={mainItems?.docname ? true : false}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Dropdown?.company?.map((item, index) => (
                                    <SelectItem key={index} value={item?.name}>{item?.company_name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Plant <span className="text-red-600 ml-1">*</span>
                    </h1>
                    <Select value={formData?.plant ? formData?.plant : mainItems?.plant[0].name ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant") }} disabled={mainItems?.docname ? true : false}>
                        <SelectTrigger className={`${errors?.plant ? `border border-red-600` : ``}`}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Dropdown?.plant?.map((item, index) => (
                                    <SelectItem key={index} value={item?.name}>{item?.plant_name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner <span className="text-red-600 ml-1">*</span></h1>
                    <Input placeholder="" name='requisitioner' onChange={(e) => { handleFieldChange(e) }} value={mainItems?.Requisitioner ?? user ?? ""} disabled />
                </div> */}
                <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                        Purchase Group <span className="text-red-600 ml-1">*</span>
                    </h1>
                    <Select onValueChange={(value) => { handleSelectChange(value, "purchase_group") }} value={formData?.purchase_group ? formData?.purchase_group : mainItems?.['Purchase Group'] ?? ""} disabled={mainItems?.docname ? true : false}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Dropdown?.purchase_group?.map((item, index) => (
                                    <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {cartId && <div className="col-span-1">
                    <h1 className="text-[12px] font-normal text-[#626973] pb-3">Cart Id</h1>
                    <Input placeholder="" name='requisitioner' value={formData?.cart_id ?? ""} disabled />
                </div>}
            </div>
            {!(mainItems?.docname && mainItems?.docname) && <div className={`flex justify-end p-2`}><Button type='button' className='py-2' variant={"nextbtn"} size={"nextbtnsize"} onClick={() => handleNext()}>Next</Button></div>}

            {(mainItems?.sap_status == "Failed" || mainItems?.sap_status == "Success" || mainItems?.sap_status == "RELEASED") &&
                <div className='p-2'>
                    {mainItems?.sap_status == "Failed" ?
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle className='pl-1'>SAP Error!!!</AlertTitle>
                            <AlertDescription>
                                Error: {mainItems?.sap_response}
                            </AlertDescription>
                            <AlertFooter className='mt-2 text-sm italic'>
                                Kindly review and Re-Submit the Request.
                            </AlertFooter>
                        </Alert>
                        :
                        <Alert variant="success">
                            <CheckCircle2Icon />
                            <AlertTitle>Success! </AlertTitle>
                            <AlertDescription>
                                {mainItems?.sap_response}
                            </AlertDescription>
                        </Alert>
                    }
                </div>
            }
            {mainItems && mainItems?.docname && (
                <Card className='m-2 p-2'>
                    <CardHeader>
                        <section className='flex justify-between'>
                            <div>
                                <CardTitle className="flex items-center gap-2">Purchase Request Items</CardTitle>
                                <CardDescription>
                                    Manage your main items and sub-items. Click the arrow to expand and see sub-items.
                                </CardDescription>
                            </div>
                            {mainItems?.sap_status == "Failed" || mainItems?.sap_status == "" && (
                                <div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleModel()}
                                        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New
                                    </Button>
                                </div>
                            )}
                        </section>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mainItems && mainItems?.data.map((mainItem) => (
                                <div key={mainItem?.row_name} className="border rounded-lg shadow-sm">
                                    <Collapsible
                                        open={expandedRowNames.includes(mainItem.row_name)}
                                        onOpenChange={() => toggleMainItemExpansion(mainItem.row_name)}
                                    >
                                        {/* Main Item Header */}
                                        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="p-1">
                                                        {expandedRowNames.includes(mainItem.row_name) ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <div>
                                                    <div className="font-semibold text-lg">
                                                        {mainItem?.product_full_name_head && mainItem?.product_name_head
                                                            ? `${mainItem.product_full_name_head} (${mainItem.product_name_head})`
                                                            : mainItem?.short_text_head}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {/* Item No: {mainItem?.item_number_of_purchase_requisition_head} | Category: {mainItem?.category} */}
                                                        Item No: {mainItem?.item_number_of_purchase_requisition_head}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {mainItem?.purchase_requisition_type === "SB" && (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                            {mainItem?.subhead_fields.length} sub-items
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline">
                                                        {mainItem?.purchase_requisition_type}
                                                    </Badge>
                                                    {/* <Badge variant="outline">${mainItem?.estimatedPrice}</Badge> */}
                                                    {mainItem?.purchase_requisition_type && mainItem?.short_text_head && (
                                                        <Badge className="bg-orange-100 text-orange-900 border border-orange-300">
                                                            {mainItem.short_text_head}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {mainItems?.sap_status == "Failed" && (
                                                <div className="flex items-center gap-2">
                                                    {((!mainItems?.mail_sent_to_purchase_team) || (designation === "Purchase Team" && !mainItems?.form_is_submitted)) && (
                                                        <>
                                                            {mainItem?.purchase_requisition_type === "SB" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openSubItemModal(mainItem?.row_name, mainItem?.subhead_fields)}
                                                                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                    Add Sub Item
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    handleModel(mainItem?.purchase_requisition_type ? mainItem?.purchase_requisition_type : "SB");
                                                                    setEditRow(mainItem);
                                                                }}
                                                                className=""
                                                            >
                                                                <Edit2Icon className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Expanded Content - Main Item Details + Sub Items Table */}
                                        <CollapsibleContent>
                                            <div className="p-4 bg-white">
                                                <SummaryBlock mainItem={mainItem} />
                                                {/* Sub Items Section */}
                                                {mainItem.purchase_requisition_type == "SB" && <div className="mt-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-semibold text-lg">Sub Items ({mainItem?.subhead_fields.length})</h4>
                                                        {mainItems?.sap_status !== "Failed" && ((!mainItems?.mail_sent_to_purchase_team) || (designation === "Purchase Team" && !mainItems?.form_is_submitted)) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openSubItemModal(mainItem?.row_name, mainItem?.subhead_fields)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add Sub Item
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {mainItem?.subhead_fields?.length > 0 ? (
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="overflow-x-auto relative">
                                                                <Table>
                                                                    <TableHeader className='text-nowrap'>
                                                                        <TableRow className="bg-gray-50">
                                                                            <TableHead className="w-[100px]">Sr No.</TableHead>
                                                                            <TableHead className="text-center">Item No. of PR</TableHead>
                                                                            <TableHead className="text-center">Service Number</TableHead>
                                                                            <TableHead className="text-center">Short Text</TableHead>
                                                                            <TableHead className="text-center">Quantity</TableHead>
                                                                            <TableHead className="text-center">UOM</TableHead>
                                                                            <TableHead className="text-center">Gross Price</TableHead>
                                                                            <TableHead className="text-center">Currency</TableHead>
                                                                            <TableHead className="text-center">Service Type</TableHead>
                                                                            <TableHead className="text-center">Net Value</TableHead>
                                                                            <TableHead className="text-center">Cost Center</TableHead>
                                                                            <TableHead className="text-center">GL Account Number</TableHead>
                                                                            {!mainItems?.form_is_submitted && (
                                                                                <TableHead className="text-center sticky right-0 bg-gray-50 z-30">
                                                                                    Actions
                                                                                </TableHead>
                                                                            )}
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {mainItem?.subhead_fields.map((subItem, index) => (
                                                                            <TableRow key={subItem.row_name} className="hover:bg-gray-50">
                                                                                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.item_number_of_purchase_requisition_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.service_number_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.short_text_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.quantity_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.uom_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.gross_price_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.currency_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.service_type_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center">{subItem?.net_value_subhead || "N/A"}</TableCell>
                                                                                <TableCell className="text-center text-nowrap">{subItem?.cost_center_subhead_desc || "N/A"}</TableCell>
                                                                                <TableCell className="text-center text-nowrap">{subItem?.gl_account_number_subhead_desc || "N/A"}</TableCell>
                                                                                {/* Sticky Actions Cell */}
                                                                                {mainItems?.sap_status === "Success" && ((!mainItems?.mail_sent_to_purchase_team) || (designation === "Purchase Team" && !mainItems?.form_is_submitted)) &&
                                                                                    <TableCell className="text-center sticky right-0 bg-white z-20">
                                                                                        <div className='flex gap-2'>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                    setEditSubItemRow(subItem);
                                                                                                    setIsSubItemModalOpen(true);
                                                                                                    setEditAction(true)
                                                                                                }}
                                                                                            >
                                                                                                <Edit2Icon className="w-4 h-4" />
                                                                                            </Button>
                                                                                            <Button
                                                                                                variant="destructive"
                                                                                                size="sm"
                                                                                                onClick={() => deleteSubItem(subItem.row_name)}
                                                                                            >
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                            </Button>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                }
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        (mainItem?.purchase_requisition_type === "SB") && (mainItems?.sap_status === "Success") &&
                                                        ((!mainItems?.mail_sent_to_purchase_team) || (designation === "Purchase Team" && !mainItems?.form_is_submitted)) && (
                                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                                                <p className="text-gray-500 mb-4">No sub-items added yet</p>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => openSubItemModal(mainItem?.row_name, mainItem?.subhead_fields)}
                                                                    className="flex items-center gap-2 mx-auto"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                    Add First Sub Item
                                                                </Button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
            {isSubItemModalOpen &&
                <SubItemModal
                    isOpen={isSubItemModalOpen}
                    onClose={() => { setIsSubItemModalOpen(false); setEditSubItemRow(null); setEditAction(false) }}
                    fetchTableData={fetchTableData}
                    Dropdown={Dropdown}
                    pur_req={pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}
                    selectedMainItemId={selectedMainItemId}
                    currentItemNumber={currentValue}
                    defaultData={editSubItemRow ?? null}
                    editAction={editAction}
                    company={formData?.company ? formData?.company : ""}
                />
            }

            {isEditModalOpen &&
                <EditSBItemModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    fetchTableData={fetchTableData}
                    Dropdown={Dropdown}
                    accountAssigmentDropdown={accountAssigmentDropdown}
                    itemCategoryDropdown={itemCategoryDropdown}
                    defaultData={editRow}
                    PurchaseGroupDropdown={PurchaseGroupDropdown}
                    PurchaseOrgDropdown={PurchaseOrgDropdown}
                    pur_req={pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}
                    company={formData?.company ? formData?.company : ""}
                    plant={formData?.company ? formData?.company : ""}
                />
            }

            {isNBEditModalOpen &&
                <EditNBItemModal
                    isOpen={isNBEditModalOpen}
                    onClose={() => setNBEditModalOpen(false)}
                    fetchTableData={fetchTableData}
                    Dropdown={Dropdown}
                    itemCategoryDropdown={itemCategoryDropdown}
                    accountAssigmentDropdown={accountAssigmentDropdown}
                    PurchaseGroupDropdown={PurchaseGroupDropdown}
                    ProfitCenterDropdown={ProfitCenterDropdown}
                    pur_req={pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}
                    defaultData={editRow}
                    plant={formData?.plant ? formData?.plant : ''}
                    company={formData?.company ? formData?.company : ""}
                    purchase_group={formData?.purchase_group ? formData?.purchase_group : ""}
                    disabled={false}
                />
            }

            {mainItems?.docname && (
                <div className="flex justify-end py-6 gap-4 mr-3">
                    {(!mainItems?.mail_sent_to_purchase_team) && (designation === "Enquirer") ? (
                        <>
                            {(mainItems?.sap_status == "Failed") && (
                                <Button
                                    className="py-2.5"
                                    variant={"nextbtn"}
                                    size={"nextbtnsize"}
                                    onClick={() => { setSendEmailDialog(true) }}>Send Email To Purchase Team</Button>
                            )}
                            {(mainItems?.sap_status == "Failed" || mainItems?.sap_status == "Pending") && (
                                <Button
                                    type="button"
                                    className="py-2.5"
                                    variant={"nextbtn"}
                                    size={"nextbtnsize"}
                                    onClick={() => handleSubmit()}
                                >
                                    Submit
                                </Button>
                            )}
                        </>
                    ) : (
                        (mainItems?.sap_status == "Failed") && (designation === "Purchase Team" && !mainItems?.form_is_submitted) && (mainItems?.mail_sent_to_purchase_team) && (
                            <Button
                                type="button"
                                className="py-2.5"
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                onClick={() => setOpen(true)}
                            >
                                Final Submit
                            </Button>
                        )
                    )}
                </div>
            )}

            <ApproveConfirmationDialog
                open={open}
                onClose={() => setOpen(false)}
                title={"Are You Sure?"}
                buttontext={"Submit"}
                dialogTitle={"Confirm Submit"}
                handleSubmit={handleApprove}
            />

            {
                sendEmailDialog && (
                    <div className="absolute z-50 flex pt-10 items-center justify-center inset-0 bg-black bg-opacity-50">
                        <Comment_box handleClose={handleClose} Submitbutton={handleEmailToPurchaseTeam} handleComment={setComment} />
                    </div>
                )
            }
        </div>
    )
}

export default NewPRRequestForm