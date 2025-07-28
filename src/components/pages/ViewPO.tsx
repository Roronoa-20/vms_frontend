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

    const convertToProxyUrl = (url: string): string => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_END;
        
        if (backendUrl && url.includes(backendUrl)) {
            return url.replace(backendUrl, '/proxy');
        }
        
        return url;
    };

    const convertImageToProxyUrl = (imageSrc: string): string => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_END;
        
        if (backendUrl && imageSrc.includes(backendUrl)) {
            return imageSrc.replace(backendUrl, '');
        }
        
        if (imageSrc.startsWith('/files/') || imageSrc.startsWith('/private/')) {
            return imageSrc;
        }
        
        if (imageSrc.includes('127.0.0.1:8013') || imageSrc.includes('localhost:8013')) {
            const url = new URL(imageSrc);
            return url.pathname;
        }
        
        return imageSrc;
    };

    const getPODetails = async()=>{
        const originalUrl = `${API_END_POINTS?.getPrintFormatData}?po_name=${PRNumber}&po_format_name=${selectedPODropdown}`;
        const proxyUrl = convertToProxyUrl(originalUrl);
        
        console.log("Original URL:", originalUrl);
        console.log("Proxy URL:", proxyUrl);
        
        const response:AxiosResponse = await requestWrapper({url: proxyUrl, method:"GET"})
        if(response?.status == 200){
            setPRDetails(response?.data?.message?.data);
        }
    }

    const delay = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const waitForImageLoad = (img: HTMLImageElement): Promise<void> => {
        return new Promise((resolve) => {
            const originalSrc = img.src;
            const proxySrc = convertImageToProxyUrl(originalSrc);
            
            if (originalSrc !== proxySrc) {
                console.log("Converting image URL:", originalSrc, "->", proxySrc);
                img.src = proxySrc;
                img.crossOrigin = 'anonymous';
            }

            if (img.complete && img.naturalHeight !== 0) {
                resolve();
                return;
            }

            const timeout = setTimeout(() => {
                cleanup();
                console.warn("Image load timeout:", img.src);
                resolve();
            }, 15000);

            const onLoad = () => {
                cleanup();
                console.log("Image loaded successfully:", img.src);
                resolve();
            };

            const onError = () => {
                cleanup();
                console.warn("Image failed to load:", img.src);
                resolve();
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

            const images = input.querySelectorAll("img");
            console.log(`Found ${images.length} images, converting to proxy URLs...`);
            
            images.forEach((img, index) => {
                const originalSrc = img.src;
                const proxySrc = convertImageToProxyUrl(originalSrc);
                
                if (originalSrc !== proxySrc) {
                    console.log(`Image ${index + 1}: ${originalSrc} -> ${proxySrc}`);
                    img.src = proxySrc;
                }
                
                img.crossOrigin = 'anonymous';
                img.setAttribute('crossorigin', 'anonymous');
            });

            await delay(500);
            
            console.log("Waiting for all images to load...");
            const imagePromises = Array.from(images).map((img, index) => {
                console.log(`Waiting for image ${index + 1}: ${img.src}`);
                return waitForImageLoad(img);
            });
            
            await Promise.all(imagePromises);
            console.log("All images processed, generating canvas...");

            await delay(1000);

            const canvas = await html2canvas(input, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                scrollY: -window.scrollY,
                scrollX: 0,
                scale: 2,
                logging: true,
                width: input.scrollWidth,
                height: input.scrollHeight,
                foreignObjectRendering: false,
                imageTimeout: 30000,
                onclone: (clonedDoc) => {
                    console.log("Processing cloned document...");
                    
                    const clonedElement = clonedDoc.querySelector('[data-pdf-content]');
                    if (clonedElement) {
                        clonedElement.style.transform = 'none';
                        clonedElement.style.position = 'relative';
                    }
                    
                    const clonedImages = clonedDoc.querySelectorAll('img');
                    clonedImages.forEach((img, index) => {
                        const originalSrc = img.src;
                        const proxySrc = convertImageToProxyUrl(originalSrc);
                        
                        if (originalSrc !== proxySrc) {
                            console.log(`Cloned image ${index + 1}: ${originalSrc} -> ${proxySrc}`);
                            img.src = proxySrc;
                        }
                        
                        img.crossOrigin = 'anonymous';
                        img.setAttribute('crossorigin', 'anonymous');
                        
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';
                        img.style.display = 'block';
                    });
                }
            });

            console.log("Canvas generated successfully, creating PDF...");

            const imgData = canvas.toDataURL('image/png', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const availableWidth = pdfWidth - (2 * margin);
            const availableHeight = pdfHeight - (2 * margin);
            
            const imgAspectRatio = canvas.width / canvas.height;
            const pdfAspectRatio = availableWidth / availableHeight;
            
            let imgWidth, imgHeight;
            if (imgAspectRatio > pdfAspectRatio) {
                imgWidth = availableWidth;
                imgHeight = availableWidth / imgAspectRatio;
            } else {
                imgHeight = availableHeight;
                imgWidth = availableHeight * imgAspectRatio;
            }

            const xOffset = margin + (availableWidth - imgWidth) / 2;
            const yOffset = margin;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset + position, imgWidth, imgHeight);
            heightLeft -= availableHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', xOffset, yOffset + position, imgWidth, imgHeight);
                heightLeft -= availableHeight;
            }

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
        const originalUrl = `${API_END_POINTS?.POItemsTable}?po_name=${PRNumber}`;
        const proxyUrl = convertToProxyUrl(originalUrl);
        
        const response:AxiosResponse = await requestWrapper({url: proxyUrl, method:"GET"});
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
        const originalUrl = API_END_POINTS?.getPrintFormatDropdown;
        const proxyUrl = convertToProxyUrl(originalUrl);
        
        const response:AxiosResponse = await requestWrapper({url: proxyUrl, method:'GET'});
        if(response?.status == 200){
            setPrintFormatDropdown(response?.data?.message?.data);
        }
    }

    const handlePoItemsSubmit = async()=>{
        const originalUrl = API_END_POINTS?.submitPOItems;
        const proxyUrl = convertToProxyUrl(originalUrl);
        
        const updatedData = {items:POItemsTable,po_name:PRNumber};
        const response:AxiosResponse = await requestWrapper({url: proxyUrl, method:"POST", data:{data:updatedData}});
        if(response?.status == 200){
            alert("submitted successfully");
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6 text-sm text-black font-sans m-5">
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

            <div className="text-left">
                <button onClick={()=>{handleOpen()}} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Early Delivery
                </button>
            </div>

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

            {prDetails && (
                <POPrintFormat 
                    contentRef={contentRef} 
                    prDetails={prDetails} 
                    Heading={selectedPODropdown} 
                />
            )}

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