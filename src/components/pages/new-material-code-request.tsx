// import cookie from "cookie";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import VendorRegistrationSchemas from "@/src/schemas/vendorRegistrationSchema";
// import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding/material-onboarding-form";
// import { VendorRegistrationProps, MaterialRequest } from "@/src/types/newmaterialcodetypes";

// export async function getServerSideProps(context: any) {
//   const { req, query } = context;
//   const cookies = cookie.parse(req.headers.cookie || "");
//   const sid = cookies.sid;
//   const FullName = cookies.full_name || null;
//   const useremail = cookies.email || null;

//   const headers = { "Content-Type": "application/json", Cookie: `sid=${sid}` };
//   const { name, material_name } = query;

//   const fetchJSON = async (url: string) => {
//     const res = await fetch(url, { headers });
//     return res.json();
//   };

//   // Fetch multiple APIs in parallel
//   const [materialOnboardingDetailsJson, MaterialDetailsJSON, MaterialCodeJSON, MaterialTypeJSON] =
//     await Promise.all([
//       fetchJSON(
//         `${process.env.NEXT_PUBLIC_API_METHOD_URL}/vms_app.api.material_onboarding_api.material_onboarding.get_material_onboarding_details?name=${name}&material_name=${material_name}`
//       ),
//       fetchJSON(
//         `${process.env.NEXT_PUBLIC_API_METHOD_URL}/vms_app.api.material_code_apis.get_all_material_code.get_all_material_descriptions_and_codes`
//       ),
//       fetchJSON(
//         `${process.env.NEXT_PUBLIC_API_METHOD_URL}/vms_app.api.material_code_apis.get_all_material_code.get_all_material_codes`
//       ),
//       fetchJSON(
//         `${process.env.NEXT_PUBLIC_API_METHOD_URL}/vms_app.api.material_type_apis.get_all_material_type.get_all_material_type_master_details`
//       ),
//     ]);

//   // Fetch ERP master data in parallel
//   const urls = [
//     `User?fields=["*"]&filters=[["email","=","${useremail}"]]`,
//     `Employee Master?fields=["*"]&filters=[["email","=","${useremail}"]]`,
//     `Company Master?fields=["name","company_name","short_form","company_code"]`,
//     `Plant Master?fields=["*"]&limit_page_length=999`,
//     `Division Master?fields=["*"]&limit_page_length=999`,
//     `Industry Master?fields=["*"]&limit_page_length=999`,
//     `UOM Master?fields=["*"]&limit_page_length=999`,
//     `MRP Type Master?fields=["*"]&limit_page_length=999`,
//     `Valuation Class Master?fields=["*"]&limit_page_length=999`,
//     `Procurement Type Master?fields=["*"]&limit_page_length=999`,
//     `Valuation Category?fields=["*"]&limit_page_length=999`,
//     `Material Group?fields=["*"]&limit_page_length=999`,
//     `Profit Center Master?fields=["*"]&limit_page_length=999`,
//     `Price Control Master?fields=["*"]&limit_page_length=999`,
//     `Availability Check Master?fields=["*"]&limit_page_length=999`,
//     `Material Type Master?fields=["*"]&limit_page_length=999`,
//     `MRP Controller Master?fields=["*"]&limit_page_length=999`,
//     `Storage Location Master?fields=["*"]&limit_page_length=999`,
//     `Class Type Master?fields=["*"]&limit_page_length=999`,
//     `Purchase Group Master?fields=["*"]&limit_page_length=999`,
//     `Serial Number Profile Master?fields=["*"]&limit_page_length=999`,
//     `Inspection Type Master?fields=["*"]&limit_page_length=999`,
//     `Material Category Master?fields=["*"]&limit_page_length=999`,
//   ];

//   const responses = await Promise.all(
//     urls.map((url) => fetch(`${process.env.NEXT_PUBLIC_API_RESOURCE_URL}/${url}`, { headers }))
//   );

//   const [
//     UserDetailsJSON,
//     EmployeeDetailsJSON,
//     companyName,
//     PlantCode,
//     DivisiondetailsJSon,
//     IndustryDetailsJson,
//     UnitDetailsJSON,
//     MRPTypeJSON,
//     ValuationClassJson,
//     ProcurementTypeJSOn,
//     ValuatnCategoryJSON,
//     MaterialGroupJson,
//     ProfitCenterJson,
//     PriceControlJson,
//     AvailabilityCheckJson,
//     MaterialTypeMasterJson,
//     MRPControllerJson,
//     StorageJson,
//     ClassTypeJson,
//     PurchaseGroupJson,
//     SerialProfileJson,
//     InspectionTypeJson,
//     MaterialCategoryJson,
//   ] = await Promise.all(responses.map((res) => res.json()));

//   return {
//     props: {
//       sid,
//       companyName,
//       MaterialDetailsJSON,
//       PlantCode,
//       FullName,
//       useremail,
//       UserDetailsJSON,
//       EmployeeDetailsJSON,
//       DivisiondetailsJSon,
//       IndustryDetailsJson,
//       UnitDetailsJSON,
//       MRPTypeJSON,
//       ValuationClassJson,
//       ProcurementTypeJSOn,
//       ValuatnCategoryJSON,
//       MaterialGroupJson,
//       ProfitCenterJson,
//       PriceControlJson,
//       AvailabilityCheckJson,
//       MaterialTypeJSON,
//       MaterialTypeMasterJson,
//       MRPControllerJson,
//       StorageJson,
//       ClassTypeJson,
//       PurchaseGroupJson,
//       SerialProfileJson,
//       InspectionTypeJson,
//       MaterialCategoryJson,
//       MaterialCodeJSON,
//       materialOnboardingDetailsJson,
//     } as VendorRegistrationProps,
//   };
// }

// export default function MaaterialRegistration(props: VendorRegistrationProps) {
//   const router = useRouter();
//   const form = useForm({
//     resolver: zodResolver(VendorRegistrationSchemas),
//   });

//   const [materialRequestList, setMaterialRequestList] = useState<MaterialRequest[]>([]);
//   const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");

//   const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     router.push("/material-onboarding-table").then(() => window.location.reload());
//   };

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Your submit logic here, similar to original
//   };

//   const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Your update logic here, similar to original
//   };

//   return (

//       <div className="pt-[6%] pl-[1%] pr-[1%] bg-slate-300">
//         <MaterialOnboardingForm
//           form={form}
//           onCancel={onCancel}
//           onSubmit={onSubmit}
//           onUpdate={onUpdate}
//           materialRequestList={materialRequestList}
//           setMaterialRequestList={setMaterialRequestList}
//           materialCompanyCode={materialCompanyCode}
//           setMaterialCompanyCode={setMaterialCompanyCode}
//           {...props}
//         />
//       </div>
//   );
// }
