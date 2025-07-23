
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountAssignmentCategory, Company, CostCenter, Country, Currency, DestinationPort, GLAccountNumber, IncoTerms, ItemCategoryMaster, MaterialCode, MaterialGroupMaster, ModeOfShipment, PackageType, PortCode, PortOfLoading, ProductCategory, ProfitCenter, PurchaseGroup, PurchaseOrganisation, RFQType, StoreLocation, UOMMaster, ValuationArea } from '@/src/types/PurchaseRequestType';
import VendorTable from '../../molecules/rfq/VendorTable';
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import useDebounce from '@/src/hooks/useDebounce';
import { SAPPRData, VendorApiResponse, VendorSelectType } from '@/src/types/RFQtype';
import Pagination from '../../molecules/Pagination';
import PRMaterialsManager, { SelectedMaterial } from './PRMaterialsManager';
interface DropdownData {
  account_assignment_category: AccountAssignmentCategory[];
  item_category_master: ItemCategoryMaster[];
  uom_master: UOMMaster[];
  cost_center: CostCenter[];
  profit_center: ProfitCenter[];
  gl_account_number: GLAccountNumber[];
  material_group_master: MaterialGroupMaster[];
  material_code: MaterialCode[];
  purchase_group: PurchaseGroup[];
  store_location: StoreLocation[];
  valuation_area: ValuationArea[];
  company: Company[];
  product_category: ProductCategory[];
  mode_of_shipment: ModeOfShipment[];
  destination_port: DestinationPort[];
  country_master: Country[];
  port_master: PortCode[];
  port_of_loading: PortOfLoading[];
  incoterm_master: IncoTerms[];
  package_type: PackageType[];
  rfq_type: RFQType[];
  purchase_organisation: PurchaseOrganisation[];
  currency_master: Currency[];
}
type Props = {
  Dropdown: DropdownData;
}

const MaterialRFQ = ({ Dropdown }: Props) => {
  const [formData, setFormData] = useState<Record<string, string | null>>({ rfq_type: "Material Vendor" });
  const [vendorSearchName, setVendorSearchName] = useState('')
  const [currentVendorPage, setVendorCurrentPage] = useState<number>(1);
  const [VendorList, setVendorList] = useState<VendorApiResponse>();
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<VendorSelectType>(
    {
      vendors: []
    }
  );
  const [availablePRs, setAvailablePRs] = useState<SAPPRData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
  const debouncedDoctorSearchName = useDebounce(vendorSearchName, 500);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  useEffect(() => {
    const fetchVendorTableData = async (rfq_type: string) => {
      console.log(rfq_type, "rfq_type in table code")
      const url = `${API_END_POINTS?.fetchVendorListBasedOnRFQType}?rfq_type=${rfq_type}&page_no=${currentVendorPage}&vendor_name=${debouncedDoctorSearchName}`
      const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
      if (response?.status == 200) {
        setVendorList(response.data.message)
        console.log(response, "response of vendor table data")
      } else {
        alert("error");
      }
    }
    fetchVendorTableData(formData?.rfq_type ? formData?.rfq_type : "Material Vendor");
  }, [currentVendorPage, debouncedDoctorSearchName]);

  useEffect(() => {
    const fetchPRDropdown = async (rfq_type: string) => {
      console.log(rfq_type, "rfq_type in table code")
      const url = `${API_END_POINTS?.fetchPRDropdown}?rfq_type=${rfq_type}`
      const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
      if (response?.status == 200) {
        setAvailablePRs(response.data.message.pr_numbers)
        console.log(response, "response of pr dropdown")
      } else {
        alert("error");
      }
    }
    fetchPRDropdown(formData?.rfq_type ? formData?.rfq_type : "Material Vendor");
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleVendorSearch = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendorCurrentPage(1)
    setVendorSearchName(e.target.value);
  }
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderInput = (name: string, label: string, type = 'text') => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label}
        {/* {errors[name] && <span className="text-red-600 ml-1">*</span>} */}
      </h1>
      <Input
        name={name}
        type={type}
        // className={errors[name] ? 'border-red-600' : 'border-neutral-200'}
        className={'border-neutral-200'}
        value={formData[name] || ''}
        onChange={handleFieldChange}
      />
    </div>
  );

  const renderFileInput = (name: string, label: string) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label}
      </h1>
      <Input
        name={name}
        type="file"
        className="border-neutral-200"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFiles((prev) => ({ ...prev, [name]: file }));
        }}
      />
    </div>
  );


  const renderSelect = <T,>(
    name: string,
    label: string,
    options: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string,
    isDisabled?: boolean,
  ) => (
    <div className="col-span-1">
      <h1 className="text-[12px] font-normal text-[#626973] pb-3">
        {label}
        {/* {errors[name as keyof typeof errors] && (
                    <span className="text-red-600 ml-1">*</span>
                )} */}
      </h1>
      <Select
        value={formData[name] ?? ""}
        onValueChange={(value) => handleSelectChange(value, name)}
        disabled={isDisabled}
      >
        {/* className={errors[name as keyof typeof errors] ? 'border border-red-600' : ''} */}
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((item, idx) => (
              <SelectItem key={idx} value={getValue(item)}>
                {getLabel(item)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
  const handleSubmit = async () => {
    console.log(selectedMaterials,"selectedMaterials")
    console.log({ ...formData, vendors: selectedRows.vendors, pr_items: selectedMaterials }, "submit data")
    const formdata = new FormData();
    const fullData = {
      ...formData,
      vendors: selectedRows.vendors,
      pr_items: selectedMaterials,
      // non_onboarded_vendors: nonOnboardedVendors, 
    };

    console.log(fullData, "submit data ------------------------------");

    // Append JSON data as a string under key 'data'
    formdata.append('data', JSON.stringify(fullData));

    // Append file only if exists
    if (files && files['file']) {
      formdata.append('file', files['file']);
    }
    const url = `${API_END_POINTS?.CreateMaterialRFQ}`;
    const response: AxiosResponse = await requestWrapper({ url: url, data:formdata, method: "POST" });
    if (response?.status == 200) {
      console.log(response,"response")
      alert("Submit Successfull");
    } else {
      alert("error");
    }
  }
  console.log(availablePRs, "availablePRs availablePRs availablePRs availablePRs----------------------")
  // const handleSelectionChange = (materials: string[]) => {
  //   setSelectedMaterials(materials)
  //   fetchPRItems(materials)
  // }

  const setPRItems = async (materials: SelectedMaterial[]) => {
    setSelectedMaterials(materials)
    // const url = `${API_END_POINTS?.fetchPRItems}`
    // const response: AxiosResponse = await requestWrapper({ url: url, data:{data:{ pr_numbers: materials }}, method: "POST" });
    // if (response?.status == 200) {
    //   // setAvailablePRs(response.data.message.pr_numbers)
    //   console.log(response, "items data-----------------")
    // } else {
    //   alert("error");
    // }
  }

  // const handleSubmit = async () => {
  //   setIsSubmitting(true)
  //   setSubmitResult(null)

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 2000))

  //     // Here you would send selectedMaterials to your API
  //     console.log("Submitting materials:", selectedMaterials)

  //     setSubmitResult("success")
  //   } catch (error) {
  //     setSubmitResult("error")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  console.log(selectedMaterials, "materials")
  return (
    <div className='bg-white h-full w-full pb-6'>
      <h1 className='font-bold text-[24px] p-5'>RFQ Data for Material</h1>

      <div className="w-full mx-auto space-y-6 p-5">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Purchase Request Management</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {selectedMaterials.length} items selected
              {updatedCount > 0 && <span className="ml-2 text-orange-600">({updatedCount} updated)</span>}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={selectedMaterials.length === 0 || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div> */}

        {/* PR Materials Manager Component */}
        <PRMaterialsManager
          prNumbers={availablePRs}
          // materials={mockMaterials}
          onSelectionChange={setPRItems}
          title="Select Materials for Processing"
        />

        {/* Selected Materials Summary */}
        {/* {selectedMaterials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Selected Materials Summary
                <Badge variant="secondary">{selectedMaterials.length} items</Badge>
                {updatedCount > 0 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {updatedCount} updated
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedMaterials.length}</div>
                    <div className="text-sm text-muted-foreground">Total Selected</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{originalCount}</div>
                    <div className="text-sm text-muted-foreground">Original Items</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{updatedCount}</div>
                    <div className="text-sm text-muted-foreground">Updated Items</div>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Status</TableHead>
                        <TableHead>PR Number</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Plant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMaterials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell>
                            {material.isUpdated ? (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Updated
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Original
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{material.prNumber}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{material.itemCode}</TableCell>
                          <TableCell>{material.itemDescription}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span
                                className={
                                  material.quantity !== material.originalQuantity ? "text-orange-600 font-semibold" : ""
                                }
                              >
                                {material.quantity} {material.uom}
                              </span>
                              {material.quantity !== material.originalQuantity && (
                                <span className="text-xs text-muted-foreground">(was: {material.originalQuantity})</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span
                                className={
                                  material.deliveryDate !== material.originalDeliveryDate
                                    ? "text-orange-600 font-semibold"
                                    : ""
                                }
                              >
                                {material.deliveryDate}
                              </span>
                              {material.deliveryDate !== material.originalDeliveryDate && (
                                <span className="text-xs text-muted-foreground">
                                  (was: {material.originalDeliveryDate})
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{material.plant}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Submit Result */}
        {/* {submitResult && (
          <Card
            className={
              submitResult === "success"
                ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                : "border-red-200 bg-red-50 dark:bg-red-950/20"
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                {submitResult === "success" ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-semibold">
                      Successfully submitted {selectedMaterials.length} materials!
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-semibold">Failed to submit materials. Please try again.</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
      <div className="grid grid-cols-3 gap-6 p-5">
        {/* {renderInput('rfq_type', 'RFQ Type')} */}
        {renderSelect(
          'rfq_type',
          'RFQ Type',
          Dropdown?.rfq_type,
          (item) => item.name,
          (item) => `${item.vendor_type_name}`,
          true
        )}
        {renderInput('rfq_date', 'RFQ Date', 'date')}
        {renderSelect(
          'company_name',
          'Company Name',
          Dropdown?.company,
          (item) => item.name,
          (item) => `${item.company_name}`
        )}
        {renderSelect(
          'purchase_organisation',
          'Purchasing Organization',
          Dropdown?.purchase_organisation,
          (item) => item.name,
          (item) => `${item.name}`
        )}
        {renderSelect(
          'purchase_group',
          'Purchase Group',
          Dropdown?.purchase_group,
          (item) => item.name,
          (item) => `${item.purchase_group_name}`
        )}
        {renderSelect(
          'currency',
          'Select Currency',
          Dropdown?.currency_master,
          (item) => item.name,
          (item) => `${item.currency_name}`
        )}
      </div>
      <h1 className='text-[24px] font-normal pt-5 px-5'>Administrative Fields</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('collection_no', 'Collection No.')}
        {renderInput('quotation_deadline', 'Quotation Deadline', 'date')}
        {renderInput('requestor_name', 'Requestor Name')}
        {renderFileInput('file', 'Upload Document')}
      </div>

      <h1 className='text-[24px] font-normal pt-5 px-5'>Deadline Monitoring</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {renderInput('first_remainder', '1st Reminder', 'date')}
        {renderInput('second_remainder', '2nd Reminder', 'date')}
        {renderInput('third_remainder', '3rd Reminder', 'date')}
      </div>

      <VendorTable VendorList={VendorList?.data ? VendorList?.data : []} loading={loading} setSelectedRows={setSelectedRows} selectedRows={selectedRows} handleVendorSearch={handleVendorSearch} />
      <div className='px-4'>
        <Pagination currentPage={currentVendorPage} setCurrentPage={setVendorCurrentPage} record_per_page={VendorList?.data.length ? VendorList?.data.length : 0} total_event_list={VendorList?.total_count ? VendorList?.total_count : 0} />
      </div>
      <div className='flex justify-end pt-10 px-4'>
        <Button type='button' className='flex bg-blue-400 hover:bg-blue-400 px-10 font-medium' onClick={() => { handleSubmit() }}>Submit RFQ</Button>
      </div>
    </div>
  )
}

export default MaterialRFQ
