// 'use client'
// import React from "react";
// import { Button } from "../../atoms/button";
// import { Label } from "../../atoms/label";
// import { useSearchParams } from "next/navigation";
// import { useQMSForm } from '@/src/hooks/useQMSForm';

// export const ProductionForm = ({ vendor_onboarding }: { vendor_onboarding: string; }) => {
//     const params = useSearchParams();
//     const currentTab = params.get("tabtype")?.toLowerCase() || "production";
//     const { formData, handleCheckboxChange, handleBack, handleSubmit } = useQMSForm(vendor_onboarding, currentTab);

//     return (
//         <div>
//             <div className='bg-white p-2 rounded-[8px]'>

//                 <div className="text-[20px] font-semibold border-b border-slate-500 pb-1">
//                     Quality Agreement
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 items-center">
//                     <div className="flex flex-col">
//                         <Label className="mb-1">Select Document Type</Label>
//                         <Select value={selectedOption} onValueChange={handleDropdownChange}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select an option">{selectedOption || "Select an option"}</SelectValue>
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="-Select-">-Select-</SelectItem>
//                                 {Object.keys(fileMappings).map((key) => (
//                                     <SelectItem key={key} value={key}>{key}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {selectedOption && (
//                         <div className="flex flex-col">
//                             <Label className="mb-1">Download File Format:</Label>
//                             <div className="relative">
//                                 <Input
//                                     type="text"
//                                     value={fileMappings[selectedOption]?.fileName}
//                                     readOnly
//                                     className="cursor-pointer pr-10"
//                                     onClick={() => {
//                                         const fileUrl = `/document-format/${fileMappings[selectedOption]?.fileName}`;
//                                         const link = document.createElement("a");
//                                         link.href = fileUrl;
//                                         link.download = fileMappings[selectedOption]?.fileName;
//                                         document.body.appendChild(link);
//                                         link.click();
//                                         document.body.removeChild(link);
//                                     }}
//                                 />
//                                 <a
//                                     href={`/document-format/${fileMappings[selectedOption]?.fileName}`}
//                                     download
//                                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
//                                 >
//                                     <FaDownload size={18} />
//                                 </a>
//                             </div>
//                         </div>
//                     )}

//                     {selectedOption && (
//                         <div className="flex flex-col">
//                             <Label className="mb-1">Upload File</Label>
//                             <div className="items-center flex">
//                                 {fileSelected ? (
//                                     <>
//                                         <Label className="font-bold cursor-pointer text-green-500">
//                                             {fileName}
//                                         </Label>
//                                         <span className="cursor-pointer text-red-500 ml-2" onClick={clearFileSelection}>
//                                             &#x2715;
//                                         </span>
//                                     </>
//                                 ) : (
//                                     <Input
//                                         type="file"
//                                         ref={formRef}
//                                         onChange={handleFileUpload}
//                                         className="text-blue-600 underline cursor-pointer placeholder: pl-1 pt-2"
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex justify-start">
//                     <Button type="button" variant="nextbtn" size="nextbtnsize" onClick={handleAdd}>
//                         Add
//                     </Button>
//                 </div>

//                 {tableData.length > 0 && (
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Sr.No.</TableHead>
//                                 <TableHead>Document Type</TableHead>
//                                 <TableHead>File Name</TableHead>
//                                 <TableHead>Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {tableData.map((row, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell>{index + 1}</TableCell>
//                                     <TableCell>{row.option}</TableCell>
//                                     <TableCell>{row.fileName}</TableCell>
//                                     <TableCell>
//                                         <Button onClick={() => handleDelete(index)} variant="uploadbtn" className="cursor-pointer text-red-500" size="uploadbtnsize">
//                                             <FontAwesomeIcon icon={faTrashAlt} />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 )}
//                 <div className="flex justify-end space-x-5 items-center pt-[20px]">
//                     <Button variant="backbtn" className="py-2.5" size="backbtnsize" onClick={() => props.setActiveTab('supplemental')}>
//                         Back
//                     </Button>

//                     <Button
//                         variant="nextbtn"
//                         size="nextbtnsize"
//                         className="py-2.5"
//                         onClick={handleSubmit}
//                     >
//                         Submit
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }