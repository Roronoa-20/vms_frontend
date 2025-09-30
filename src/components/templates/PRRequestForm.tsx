
"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { CostCenter, GLAccountNumber, MaterialCode, MaterialGroupMaster, ProfitCenter, PurchaseGroup, PurchaseOrganisation, PurchaseRequestData, PurchaseRequestDropdown, StorageLocation, ValuationArea, ValuationClass } from '@/src/types/PurchaseRequestType'
import { Edit2, Edit2Icon, EyeIcon } from 'lucide-react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import Cookies from 'js-cookie'
import { validateRequiredFields } from '@/src/app/utils/pr-validate'
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubItemModal from '../molecules/pr-dialogs/SubItemDialog'
import EditSBItemModal from '../molecules/pr-dialogs/EditSBDialog'
import EditNBItemModal from '../molecules/pr-dialogs/EditNBDilaog'
import { PurchaseRequisitionDataItem, PurchaseRequisitionResponse } from '@/src/types/PurchaseRequisitionType'
import SummaryBlock from '../molecules/pr-dialogs/SummaryBlock'
import { useRouter } from 'next/navigation'
interface Props {
  Dropdown: PurchaseRequestDropdown["message"]
  PRData: PurchaseRequestData["message"]["data"] | null
  cartId?: string
  pur_req?: string
  PurchaseGroupDropdown: PurchaseGroup[]
  StorageLocationDropdown: StorageLocation[]
  ValuationClassDropdown: ValuationClass[]
  ProfitCenterDropdown: ProfitCenter[]
  MaterialGroupDropdown: MaterialGroupMaster[]
  GLAccountDropdwon: GLAccountNumber[]
  CostCenterDropdown: CostCenter[]
  MaterialCodeDropdown: MaterialCode[]
  PurchaseOrgDropdown: PurchaseOrganisation[]
}

export const updateQueryParam = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value); // Add or update the query param
  window.history.pushState({}, '', url.toString());
};

const   PRRequestForm = ({ Dropdown, PRData, cartId, pur_req, PurchaseGroupDropdown, StorageLocationDropdown, ValuationClassDropdown, ProfitCenterDropdown, MaterialGroupDropdown, GLAccountDropdwon, CostCenterDropdown, MaterialCodeDropdown, PurchaseOrgDropdown }: Props) => {
  const user = Cookies.get("user_id");
  const [formData, setFormData] = useState<PurchaseRequestData["message"]["data"] | null>(PRData ? { ...PRData, requisitioner: PRData?.requisitioner, cart_id: cartId ? cartId : "" } : null);
  const [requiredField, setRequiredField] = useState(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedRowNames, setExpandedRowNames] = useState<string[]>([]);
  const [editRow, setEditRow] = useState<PurchaseRequisitionDataItem>()
  const [mainItems, setMainItems] = useState<PurchaseRequisitionResponse>()
  const [isSubItemModalOpen, setIsSubItemModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isNBEditModalOpen, setNBEditModalOpen] = useState(false)
  const [selectedMainItemId, setSelectedMainItemId] = useState<string>("")
  const [purchase_request_no, setPurchaseReqNo] = useState<string>("")
  const router= useRouter()
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
        ? prev.filter(name => name !== row_name) // collapse if already expanded
        : [...prev, row_name] // expand otherwise
    );
  };

  const openSubItemModal = (mainItemId: string) => {
    setSelectedMainItemId(mainItemId)
    setIsSubItemModalOpen(true)
  }

  const handleFieldChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }) as PurchaseRequestData["message"]["data"]);
      // Clear error for the field
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
      // Clear error for the field
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

  // const handleCompanyChange = async (value: string) => {
  //   try {
  //     const Data = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.handle_req_field_pr.filter_master_field?company=${value}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: 'include',
  //       }
  //     );
  //     if (Data.ok) {
  //       const data = await Data.json();
  //       setFilterDropdown(data?.message)
  //       console.log(data, "datadatadatadatadatadata  response")
  //     }

  //   } catch (error) {
  //     console.log(error, "something went wrong");
  //   }
  // }

  const handleSubmit = async () => {
    if (!(mainItems?.docname)) {
      alert("Not able to Submit , PR Request No. Required")
      return
    }
    const url = `${API_END_POINTS?.SubmitPR}?name=${pur_req? pur_req: mainItems?.docname? mainItems?.docname :""}`;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST" });
    if (response?.status == 200) {
      alert("Submit Successfull");
      router.push("/dashboard")
    } else {
      alert("error");
    }
  }

  const fetchTableData = async (pur_req: string) => {
    console.log(pur_req, "pur_req in table code")
    const url = `${API_END_POINTS?.fetchPRTableData}?name=${pur_req}`
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      console.log(response, "response of table data")
      setMainItems(response.data.message)
    } else {
      alert("error");
    }
  }

  const handleNext = async () => {
    const url = API_END_POINTS?.createPR;
    const response: AxiosResponse = await requestWrapper({ url: url, data: { ...formData }, method: "POST" });
    if (response?.status == 200) {
      console.log(response.data.message.name, "reposne dxcfgvbhjnkmjhgvfcdxcfvgbh")
      updateQueryParam("pur_req", response.data.message.name)
      fetchTableData(response.data.message.name)
      alert("submission successfull");
    } else {
      alert("error");
    }
  }

  const handleModel = (purchase_requisition_type: string) => purchase_requisition_type === "SB" ? setEditModalOpen(true) : setNBEditModalOpen(true);

  const fetchRequiredData = async (company: string, pur_type: string, acct_cate: string) => {
    console.log(company, pur_type, acct_cate)
    try {
      const Data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.handle_req_field_pr.filter_req_fields?company=${company}&pur_type=${pur_type}&acct_cate=${acct_cate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        }
      );
      if (Data.ok) {
        const data = await Data.json();
        setRequiredField(data?.message)
        console.log(data, "data in required")
      }
    } catch (error) {
      console.log(error, "something went wrong");
    }
  };
  // useEffect(() => {
  //   fetchRequiredData(formData?.company, formData?.purchase_requisition_type, singleTableRow?.account_assignment_category);
  // }, [formData?.company, formData?.purchase_requisition_type, singleTableRow?.account_assignment_category])

  useEffect(() => {
    if (pur_req) {
      fetchTableData(pur_req);
    }
  }, [pur_req])

  console.log(!(pur_req),"pur_req")
  console.log(mainItems)
  console.log(mainItems?.docname && mainItems?.docname,"mainItems?.docname && mainItems?.docname")
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Request Type <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select
            onValueChange={(value) => { handleSelectChange(value, "purchase_requisition_type") }}
            value={formData?.purchase_requisition_type ?? ""}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_requisition_type?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Code Area <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select
            value={formData?.company ?? ""}
            onValueChange={(value) => { handleSelectChange(value, "company") }}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Plant <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant") }} disabled>
            <SelectTrigger className={`${errors?.plant
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.plant?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.plant_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner <span className="text-red-600 ml-1">*</span></h1>
          <Input placeholder="" name='requisitioner' onChange={(e) => { handleFieldChange(e) }} value={formData?.requisitioner ?? user ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "purchase_group") }} value={formData?.purchase_group ?? ""} disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_group?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Cart Id</h1>
          <Input placeholder="" name='requisitioner' value={formData?.cart_id ?? ""} disabled />
        </div>
      </div>
      {!(mainItems?.docname && mainItems?.docname)  && <div className={`flex justify-end p-4`}><Button type='button' className='bg-blue-400 hover:bg-blue-400' onClick={() => handleNext()}>Next</Button></div>}


      {mainItems && mainItems?.data?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Purchase Request Items</CardTitle>
            <CardDescription>
              Manage your main items and sub-items. Click the arrow to expand and see sub-items.
            </CardDescription>
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
                          <div className="font-semibold text-lg">{mainItem?.product_name_head}</div>
                          <div className="text-sm text-muted-foreground">
                            {/* Item No: {mainItem?.item_number_of_purchase_requisition_head} | Category: {mainItem?.category} */}
                            Item No: {mainItem?.item_number_of_purchase_requisition_head}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {mainItem?.subhead_fields.length} sub-items
                          </Badge>
                          <Badge variant="outline">
                            {mainItem?.purchase_requisition_type}
                          </Badge>
                          {/* <Badge variant="outline">${mainItem?.estimatedPrice}</Badge> */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(mainItem?.purchase_requisition_type == "SB" && mainItems?.['Form Status'] != "Submitted") && <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openSubItemModal(mainItem?.row_name)}
                          className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200"
                        >
                          <Plus className="w-4 h-4" />
                          Add Sub Item
                        </Button>}
                        {mainItems?.['Form Status'] != "Submitted" && <Button
                          // variant="destructive"
                          size="sm"
                          onClick={() => { handleModel(mainItem?.purchase_requisition_type ? mainItem?.purchase_requisition_type : "SB"); setEditRow(mainItem) }}
                          className=""
                        >
                          <Edit2Icon className="w-4 h-4" />
                        </Button>}
                      </div>
                    </div>

                    {/* Expanded Content - Main Item Details + Sub Items Table */}
                    <CollapsibleContent>
                      <div className="p-4 bg-white">
                        <SummaryBlock mainItem={mainItem} />
                        {/* Sub Items Section */}
                        {mainItem.purchase_requisition_type == "SB" && <div className="mt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-lg">Sub Items ({mainItem?.subhead_fields.length})</h4>
                            {mainItems?.['Form Status'] != "Submitted" && <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSubItemModal(mainItem?.row_name)}
                              className="flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Sub Item
                            </Button>}
                          </div>

                          {mainItem?.subhead_fields?.length > 0 ? (
                            <div className="border rounded-lg overflow-hidden">
                              <div className="overflow-x-auto relative">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-gray-50">
                                      <TableHead className="w-[100px]">Sr No.</TableHead>
                                      <TableHead className="text-center">Item Number of Purchase Requisition</TableHead>
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
                                      <TableHead className="text-center sticky right-0 bg-gray-50 z-30">
                                        Actions
                                      </TableHead>
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
                                        <TableCell className="text-center">{subItem?.cost_center_subhead || "N/A"}</TableCell>
                                        <TableCell className="text-center">{subItem?.gl_account_number_subhead || "N/A"}</TableCell>
                                        {/* Sticky Actions Cell */}
                                        {mainItems?.['Form Status'] != "Submitted" && <TableCell className="text-center sticky right-0 bg-white z-20">
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteSubItem(subItem.row_name)}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </TableCell>}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          ) 
                          : 
                          (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <p className="text-gray-500 mb-4">No sub-items added yet</p>
                              <Button
                                variant="outline"
                                onClick={() => openSubItemModal(mainItem?.row_name)}
                                className="flex items-center gap-2 mx-auto"
                              >
                                <Plus className="w-4 h-4" />
                                Add First Sub Item
                              </Button>
                            </div>
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
          onClose={() => setIsSubItemModalOpen(false)}
          fetchTableData={fetchTableData}
          Dropdown={Dropdown}
          pur_req={pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}
          selectedMainItemId={selectedMainItemId}
        />}

      {isEditModalOpen &&
        <EditSBItemModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          fetchTableData={fetchTableData}
          Dropdown={Dropdown}
          defaultData={editRow}
          PurchaseGroupDropdown={PurchaseGroupDropdown}
          StorageLocationDropdown={StorageLocationDropdown}
          ValuationClassDropdown={ValuationClassDropdown}
          PurchaseOrgDropdown={PurchaseOrgDropdown}
          MaterialGroupDropdown={MaterialGroupDropdown}
          pur_req={pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}
        />}

      {isNBEditModalOpen && <EditNBItemModal
        isOpen={isNBEditModalOpen}
        onClose={() => setNBEditModalOpen(false)}
        fetchTableData={fetchTableData}
        Dropdown={Dropdown}
        PurchaseGroupDropdown={PurchaseGroupDropdown}
        StorageLocationDropdown={StorageLocationDropdown}
        ValuationClassDropdown={ValuationClassDropdown}
        ProfitCenterDropdown={ProfitCenterDropdown}
        MaterialGroupDropdown={MaterialGroupDropdown}
        GLAccountDropdwon={GLAccountDropdwon}
        CostCenterDropdown={CostCenterDropdown}
        MaterialCodeDropdown={MaterialCodeDropdown}
        pur_req={pur_req ? pur_req : mainItems?.docname ? mainItems?.docname : ""}
        defaultData={editRow}
      />}

      {(mainItems?.['Form Status'] != "Submitted" && mainItems?.docname) && <div className={`flex justify-end py-6`}><Button type='button' className='bg-blue-400 hover:bg-blue-400 px-6 font-medium' onClick={() => { handleSubmit() }}>Submit</Button></div>}
    </div>
  )
}

export default PRRequestForm