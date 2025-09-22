"use client"
import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, FileText } from "lucide-react"
import AttachmentSVG from "@/src/app/svgs/AttachmentMultipleUploadSVG"
import UploadFileIcon from "@/src/app/svgs/UplaodIcon"
import Image from "next/image"

interface MultipleFileUploadProps {
  onNext?: (files: File[]) => void
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  buttonText?: string
  ref?: React.RefObject<HTMLButtonElement | null>
  className?: string
}

export default function MultipleFileUpload({
  onNext,
  buttonText,
  files,
  setFiles,
  ref,
  className,
}: MultipleFileUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [setFiles])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [setFiles])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleNext = useCallback(() => {
    onNext?.(files)
    setIsOpen(false)
  }, [files, onNext])

  const removeFile = useCallback((fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove))
  }, [setFiles])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          ref={ref}
          className={`${className} flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-md shadow-sm cursor-pointer border-[1px] border-blue-400/20 hover:bg-blue-100 transition-colors`}
        >
          {/* <AttachmentSVG /> */}
          {/* <img src={AttachmentSVG} alt="attachment" /> */}
          <Image src={"/attachemntsvg.svg"} alt="attchment-icon" width={20} height={21}/>
          <span className="font-medium text-blue-600">
            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""}` : buttonText}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-[30px] font-normal text-black">
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div
            className="flex-col cursor-pointer px-4 py-2 rounded-md transition-colors text-black flex items-center gap-2 border-2 border-dashed border-[#5291CD]/30"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* <UploadFileIcon /> */}
            <Image src={"/uploadfilesvg.svg"} alt="upload-icon" width={100} height={100}/>
            <span>Drag & Drop Files or</span>
            <label htmlFor="file-upload" className="cursor-pointer text-[#5291CD] underline">
              Choose Files
            </label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </div>

          {files.length > 0 && (
            <ScrollArea className="max-h-[200px] w-full text-black rounded-md border p-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-[#5291CD]" />
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>

        <Button
          className="border border-[#5291CD] text-[#FFF] px-6 bg-[#5291CD] rounded-[20px] font-semibold text-[16px] hover:bg-white hover:text-black"
          disabled={files.length === 0}
          onClick={handleNext}
        >
          Upload {files.length} file{files.length !== 1 ? "s" : ""}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
