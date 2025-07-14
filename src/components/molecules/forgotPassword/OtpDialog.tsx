import React from 'react'
import { Input } from '../../atoms/input'
import { Button } from '../../atoms/button'
import { useState } from 'react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import requestWrapper from '@/src/services/apiCall'
import { AxiosResponse } from 'axios'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'

interface Props {
    setIsOtpDialog:Dispatch<SetStateAction<boolean>>;
    setIsPasswordDialog:Dispatch<SetStateAction<boolean>>;
    authorization:string
    user:string
}

const OtpDialog = ({setIsOtpDialog,setIsPasswordDialog,authorization,user}:Props) => {
    const [otp,setOtp] = useState<string | "">("")
    const handleClose = ()=>{
      setIsOtpDialog(false);
      setIsPasswordDialog(false);
    }
    const outsideClickRef = useOutsideClick<HTMLDivElement>(handleClose)
    const handleEmailApi = async ()=>{
        const url = API_END_POINTS?.verifyOtp;
        const response: AxiosResponse = await requestWrapper({
            url: url,
            method: "POST",
            data: { data: {otp:otp,user:user} },
            headers:{Authorization:authorization}
          });
          if(response?.status == 200){
            setIsOtpDialog(prev=>!prev);
            setIsPasswordDialog(prev=>!prev);
            setOtp("")
          }
    }

  return (
    <div  className="absolute z-50 flex inset-0 items-center justify-center bg-black bg-opacity-50 text-nowrap">
      <div ref={outsideClickRef} className="bg-white rounded-xl border px-8 py-4 md:max-w-[500px] md:max-h-[150px] h-full w-full gap-6 text-black md:text-md font-light flex flex-col justify-start items-center">
        <h1 className="font-semibold text-center text-[#5291CD] text-[20px]">Enter the OTP </h1>
        <div className='flex gap-4 w-full'>
        <Input
          className="h-full md:max-h-40 text-center"
          placeholder='Enter OTP here...'
              onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={()=>{handleEmailApi()}} className="bg-blue-400 text-white text-sm font-normal border px-4 hover:bg-blue-400 disabled:bg-opacity-50">
            Send OTP
          </Button>
          </div>
        
      </div>
    </div >
  )
}

export default OtpDialog