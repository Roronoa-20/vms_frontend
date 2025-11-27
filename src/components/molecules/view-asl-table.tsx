// "use client";
// import React from "react";
// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/src/components/atoms/table";
// //import { Button } from "@/components/ui/button";
// import { QMSOnboardingRecord } from "@/src/types/QAdashboardtypes";
// import { Input } from "@/src/components/atoms/input"; 

// type Props = {
//   tableData: QMSOnboardingRecord[];
//   currentPage?: number;
//   record_per_page?: number;
// };

// const ViewASl = ({
//   tableData,
//   currentPage = 1,
//   record_per_page = 5,
// }: Props) => {
//     const [fromDate, setFromDate] = useState<string>("");
//     const [toDate, setToDate] = useState<string>("");
//   return (
//     <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-3">
//         <h1 className="text-[20px] text-[#03111F] font-semibold">
//           Approved Supplier List
//         </h1>

//         <div className="flex flex-wrap items-center gap-3">
//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium text-gray-700">From:</label>
//             <Input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="h-8 w-[150px] border-gray-300"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium text-gray-700">To:</label>
//             <Input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="h-8 w-[150px] border-gray-300"
//             />
//           </div>
//         </div>
//       </div>
      
//       <Table>
//         <TableHeader className="text-center">
//           <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
//             <TableHead className="w-[100px]">Sr No.</TableHead>
//             <TableHead className="text-center">Supplier Code</TableHead>
//             <TableHead className="text-center">Supplier</TableHead>
//             <TableHead className="text-center">Material / Services</TableHead>
//             <TableHead className="text-center">Critical</TableHead>
//             <TableHead className="text-center">Address</TableHead>
//             <TableHead className="text-center">Contact Person</TableHead>
//             <TableHead className="text-center">Contact No.</TableHead>
//             <TableHead className="text-center">URL / E-Mail</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody className="text-center">
//           {tableData?.length > 0 ? (
//             tableData.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell className="font-medium">
//                   {(currentPage - 1) * record_per_page + index + 1}
//                 </TableCell>
//                 <TableCell></TableCell>
//                 <TableCell></TableCell>
//                 <TableCell></TableCell>
//                 <TableCell>
//                   <div
//                     className={`px-2 py-3 rounded-xl uppercase ${
//                       item?.onboarding_form_status === "Pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : item?.onboarding_form_status === "Approved"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {item?.onboarding_form_status}
//                   </div>
//                 </TableCell>
//                 <TableCell></TableCell>
//                 <TableCell></TableCell>
//                 <TableCell></TableCell>
//                 <TableCell></TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={9} className="text-center text-gray-500 py-4">
//                 No results found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default ViewASl;
