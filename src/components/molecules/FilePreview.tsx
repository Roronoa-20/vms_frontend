import React from 'react'

interface Props {
    fileName?:string,
    previewLink?:string,
    deleteFile?:()=>void
}


const FilePreview = ({fileName,previewLink,deleteFile}:Props) => {
  return (
    <div className='flex gap-3 p-4 border-2 rounded-xl'>
        <h1>File Name</h1>
        <h1>preview button</h1>
        <h1>delete button</h1>
    </div>
  )
}

export default FilePreview