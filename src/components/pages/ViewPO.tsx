"use client"
import React, { useEffect, useRef, useState } from "react";
import POPrintFormat from "../molecules/POPrintFormat";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import PopUp from "../molecules/PopUp";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../atoms/table";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface POItemsTable {
  name:string,
  product_name:string,
  material_code:string,
  plant:string,
  schedule_date:string,
  quantity:string,
  early_delivery_date:string
  purchase_team_remarks:string,
  requested_for_earlydelivery:boolean
}

interface dropdown {
  name:string,
  print_format_name:string
}

const ViewPO = () => {
    const [prDetails,setPRDetails] = useState();
    const [PRNumber,setPRNumber] = useState<string>("");
    const [POItemsTable,setPOItemsTable] = useState<POItemsTable[]>([]);
    const [isEarlyDeliveryDialog,setIsEarlyDeliveryDialog] = useState<boolean>(false);
    const [printFormatDropdown,setPrintFormatDropdown] = useState<dropdown[]>([])
    const [selectedPODropdown,setSelectedPODropdown] = useState<string>("");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
    
    const contentRef = useRef<HTMLDivElement | null>(null);

    const getPODetails = async()=>{
        const url = `${API_END_POINTS?.getPrintFormatData}?po_name=${PRNumber}&po_format_name=${selectedPODropdown}`;
        const response:AxiosResponse = await requestWrapper({url:url,method:"GET"})
        if(response?.status == 200){
            // console.log(response?.data?.message,"this is response")
            setPRDetails(response?.data?.message?.data);
        }
    }

    // ✅ Fixed: Use Promise-based delay instead of busy-wait
    const delay = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // ✅ Fixed: Better image loading wait function
    const waitForImageLoad = (img: HTMLImageElement): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (img.complete && img.naturalHeight !== 0) {
                resolve();
                return;
            }

            const timeout = setTimeout(() => {
                cleanup();
                console.warn("Image load timeout:", img.src);
                resolve(); // Don't reject, just continue
            }, 10000); // 10 second timeout

            const onLoad = () => {
                cleanup();
                resolve();
            };

            const onError = () => {
                cleanup();
                console.warn("Image failed to load:", img.src);
                resolve(); // Don't reject, just continue
            };

            const cleanup = () => {
                clearTimeout(timeout);
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
            };

            img.addEventListener('load', onLoad);
            img.addEventListener('error', onError);
        });
    };

    // ✅ Fixed: Improved PDF generation with better error handling
    const handleGeneratePdf = async () => {
        if (isGeneratingPDF) {
            console.log("PDF generation already in progress");
            return;
        }

        setIsGeneratingPDF(true);
        
        try {
            const input = contentRef.current;
            if (!input) {
                throw new Error("PDF container not found. Make sure the PO details are loaded.");
            }

            console.log("Starting PDF generation...");

            // ✅ Wait for all images to load with timeout
            const images = input.querySelectorAll("img");
            console.log(`Found ${images.length} images, waiting for them to load...`);
            
            const imagePromises = Array.from(images).map(img => waitForImageLoad(img));
            await Promise.all(imagePromises);
            
            console.log("All images loaded, generating canvas...");

            // ✅ Generate canvas with better options
            const canvas = await html2canvas(input, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                scrollY: -window.scrollY,
                scrollX: 0,
                scale: 2, // Higher quality
                logging: false, // Disable console logs
                width: input.scrollWidth,
                height: input.scrollHeight,
                onclone: (clonedDoc) => {
                    // Fix any styling issues in the cloned document
                    const clonedElement = clonedDoc.querySelector('[data-pdf-content]');
                    if (clonedElement) {
                        clonedElement.style.transform = 'none';
                        clonedElement.style.position = 'relative';
                    }
                }
            });

            console.log("Canvas generated, creating PDF...");

            // ✅ Generate PDF with proper sizing
            const imgData = canvas.toDataURL('image/png', 0.95); // Slight compression
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate proper dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10; // 10mm margin
            const availableWidth = pdfWidth - (2 * margin);
            const availableHeight = pdfHeight - (2 * margin);
            
            const imgAspectRatio = canvas.width / canvas.height;
            const pdfAspectRatio = availableWidth / availableHeight;
            
            let imgWidth, imgHeight;
            if (imgAspectRatio > pdfAspectRatio) {
                // Image is wider than PDF page
                imgWidth = availableWidth;
                imgHeight = availableWidth / imgAspectRatio;
            } else {
                // Image is taller than PDF page
                imgHeight = availableHeight;
                imgWidth = availableHeight * imgAspectRatio;
            }

            // Center the image
            const xOffset = margin + (availableWidth - imgWidth) / 2;
            const yOffset = margin;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(imgData, 'PNG', xOffset, yOffset + position, imgWidth, imgHeight);
            heightLeft -= availableHeight;

            // Additional pages if needed
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', xOffset, yOffset + position, imgWidth, imgHeight);
                heightLeft -= availableHeight;
            }

            // Save with dynamic filename
            const filename = `PO_${PRNumber || 'Document'}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            
            console.log("PDF generated successfully!");
            alert("PDF downloaded successfully!");

        } catch (err) {
            console.error("Error generating PDF:", err);
            alert(`PDF generation failed: ${err.message}`);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleClose = ()=>{
        setIsEarlyDeliveryDialog(false);
    }

    const handleOpen = ()=>{
      fetchPOItems();
      setIsEarlyDeliveryDialog(true);
    }

    const fetchPOItems = async ()=>{
      const url = `${API_END_POINTS?.POItemsTable}?po_name=${PRNumber}`;
      const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
      if(response?.status == 200){
        setPOItemsTable(response?.data?.message?.items)
      }
    }

    const handleTableChange = (index: number, name:string,value:string) => {
        setPOItemsTable((prev) => {
            const updated = [...prev];
            if (updated[index]) {
                updated[index] = { ...updated[index],[name]:value};
            }
            return updated;
        });
    }

    useEffect(()=>{
        getDropdown();
    },[])
    
    const getDropdown = async()=>{
        const url = API_END_POINTS?.getPrintFormatDropdown;
        const response:AxiosResponse = await requestWrapper({url:url,method:'GET'});
        if(response?.status == 200){
            setPrintFormatDropdown(response?.data?.message?.data);
        }
    }

    const handlePoItemsSubmit = async()=>{
        const url = API_END_POINTS?.submitPOItems;
        const updatedData = {items:POItemsTable,po_name:PRNumber};
        const response:AxiosResponse = await requestWrapper({url:url,method:"POST",data:{data:updatedData}});
        if(response?.status == 200){
            alert("submitted successfully");
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6 text-sm text-black font-sans m-5">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-gray-300">
                <input
                    onChange={(e)=>{setPRNumber(e.target.value)}}
                    type="text"
                    placeholder="Enter PO Number"
                    className="w-full md:w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none hover:border-blue-700 transition"
                />
                <div className="flex justify-end gap-5 w-full">
                    <Select onValueChange={(value)=>{setSelectedPODropdown(value)}}>
                        <SelectTrigger className="w-60">
                            <SelectValue placeholder="Select Print Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {printFormatDropdown?.map((item,index)=>(
                                    <SelectItem key={index} value={item?.name}>{item?.print_format_name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <button 
                        onClick={()=>{getPODetails()}} 
                        className="bg-blue-500 text-white px-2 rounded hover:bg-blue-700 transition text-nowrap"
                        disabled={!PRNumber || !selectedPODropdown}
                    >
                        View PO Details
                    </button>
                    <button className="bg-blue-500 text-white px-2 rounded hover:bg-blue-700 transition text-nowrap">
                        View All Changed PO Details
                    </button>
                </div>
            </div>

            {/* Early Delivery Button */}
            <div className="text-left">
                <button onClick={()=>{handleOpen()}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Early Delivery
                </button>
            </div>

            {/* ✅ Fixed: Better download button with loading state */}
            <div className="flex gap-4">
                <Button 
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPDF || !prDetails}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                    {isGeneratingPDF ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Generating PDF...
                        </div>
                    ) : (
                        'Download PDF'
                    )}
                </Button>
                
                {!prDetails && (
                    <p className="text-gray-500 text-sm self-center">
                        Please load PO details first
                    </p>
                )}
            </div>

            {/* ✅ PO Main Section with data attribute for PDF generation */}
            {prDetails && (
                <POPrintFormat 
                    contentRef={contentRef} 
                    prDetails={prDetails} 
                    Heading={selectedPODropdown} 
                />
            )}

            {/* Early Delivery Dialog */}
            {isEarlyDeliveryDialog && (
                <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose}>
                    <h1 className="pl-5">Purchase Inquiry Items</h1>
                    <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
                        <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
                            <TableHeader className="text-center">
                                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                                    <TableHead className="text-center">Product Name</TableHead>
                                    <TableHead className="text-center">Material Code</TableHead>
                                    <TableHead className="text-center">Plant</TableHead>
                                    <TableHead className="text-center">Schedule Date</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-center">Early Delivery Date</TableHead>
                                    <TableHead className="text-center">Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-center">
                                {POItemsTable?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item?.product_name}</TableCell>
                                        <TableCell className='text-center'>{item?.material_code}</TableCell>
                                        <TableCell>{item?.plant}</TableCell>
                                        <TableCell>{item?.schedule_date}</TableCell>  
                                        <TableCell>{item?.quantity}</TableCell>  
                                        <TableCell className={`flex justify-center`}>
                                            <Input 
                                                disabled={item?.requested_for_earlydelivery?true:false} 
                                                type="date" 
                                                name="early_delivery_date" 
                                                onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} 
                                                value={item?.early_delivery_date ?? ""}  
                                                className='w-36 disabled:opacity-100' 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex justify-center`}> 
                                                <Input 
                                                    disabled={item?.requested_for_earlydelivery?true:false} 
                                                    name="purchase_team_remarks" 
                                                    onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} 
                                                    value={item?.purchase_team_remarks ?? ""}  
                                                    className='disabled:opacity-100' 
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Button onClick={()=>{handlePoItemsSubmit()}}>Submit</Button>
                </PopUp> 
            )}
        </div>
    );
};

export default ViewPO;