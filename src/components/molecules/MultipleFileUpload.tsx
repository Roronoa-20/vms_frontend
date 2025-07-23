"use client"
import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, FileText } from "lucide-react"
import AttachmentSVG from "@/public/app/svgs/attachment.svg"
import UploadFileIcon from "@/public/app/svgs/uploadFileIcon.svg"

interface SimpleFileUploadProps {
  onNext?: () => void
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileList | null>>
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  buttonText?: string
  ref?: React.RefObject<HTMLButtonElement | null>
  className?: string
}

export default function SimpleFileUpload({
  onNext,
  buttonText,
  files,
  setUploadedFiles,
  setFiles,
  ref,
  className,
}: SimpleFileUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file change (from file input)
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles) {
        const newFileArray = Array.from(selectedFiles)
        setUploadedFiles((prevUploadedFiles) => {
          const prevFilesArray = prevUploadedFiles ? Array.from(prevUploadedFiles) : []
          const mergedFilesArray = [...prevFilesArray, ...newFileArray]
          const dataTransfer = new DataTransfer()
          mergedFilesArray.forEach((file) => dataTransfer.items.add(file))
          return dataTransfer.files
        })
        setFiles((prevFiles) => [...prevFiles, ...newFileArray])
      }
    },
    [setUploadedFiles, setFiles],
  )

  // Handle file drop event
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const droppedFiles = e.dataTransfer.files
      if (droppedFiles) {
        const newFileArray = Array.from(droppedFiles)
        setUploadedFiles((prevUploadedFiles) => {
          const prevFilesArray = prevUploadedFiles ? Array.from(prevUploadedFiles) : []
          const mergedFilesArray = [...prevFilesArray, ...newFileArray]
          const dataTransfer = new DataTransfer()
          mergedFilesArray.forEach((file) => dataTransfer.items.add(file))
          return dataTransfer.files
        })
        setFiles((prevFiles) => [...prevFiles, ...newFileArray])
      }
    },
    [setUploadedFiles, setFiles],
  )

  // Handle file drag over event (required for drop to work)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleNext = useCallback(() => {
    onNext?.()
    setIsOpen(false)
  }, [files, onNext])

  const removeFile = useCallback(
    (fileToRemove: File) => {
      setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove))
      setUploadedFiles((prevFiles) => {
        if (!prevFiles) return prevFiles
        const filesArray = Array.from(prevFiles)
        const updatedFiles = filesArray.filter((file) => file !== fileToRemove)
        return updatedFiles as unknown as FileList
      })
    },
    [setFiles, setUploadedFiles],
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          ref={ref}
          className={`${className} flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-md shadow-sm cursor-pointer border-[1px] border-blue-400/20 hover:bg-blue-100 transition-colors`}
        >
          <AttachmentSVG />
          <span className="font-medium text-blue-600">
            {files?.length > 0 ? `${files?.length} file${files?.length > 1 ? "s" : ""} ` : buttonText}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-[30px] font-normal font-['Poppins'] text-black">
            Upload Document
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div
            className="flex-col cursor-pointer px-4 py-2 rounded-md transition-colors text-black flex items-center gap-2 border-2 border-dashed border-blue-400/30"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadFileIcon />
            <span>Drag & Drop Files or</span>
            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 underline">
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
          {files?.length > 0 && (
            <ScrollArea className="max-h-[200px] w-full text-black rounded-md border p-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
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
          className="border border-blue-600 text-[#FFF] px-6 bg-blue-600 hover:bg-blue-700 text-[16px]"
          disabled={files?.length === 0}
          onClick={handleNext}
        >
          Upload {files?.length} file{files?.length !== 1 ? "s" : ""}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
