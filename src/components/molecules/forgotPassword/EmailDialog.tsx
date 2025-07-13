import { AxiosResponse } from 'axios'
import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import { useState } from 'react'
import { wrapApiHandler } from 'next/dist/server/api-utils'
import API_END_POINTS from '@/src/services/apiEndPoints'
import requestWrapper from '@/src/services/apiCall'
import { Dispatch } from 'react'
import { SetStateAction } from 'react'
import { TSendOtp } from '@/src/types/types'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'

interface Props {
    setIsEmailDialog:Dispatch<SetStateAction<boolean>>;
    setIsOtpDialog:Dispatch<SetStateAction<boolean>>;
    setUsr:Dispatch<SetStateAction<string>>;
    setAuthorization:Dispatch<SetStateAction<string>>;
}


const EmailDialog = ({setIsEmailDialog,setIsOtpDialog,setUsr,setAuthorization}:Props) => {
    const [email,setEmail] = useState<string | "">("")
    const handleEmailApi = async ()=>{
      setUsr(email);
      const url = API_END_POINTS?.otpEmail;
      const response: AxiosResponse = await requestWrapper({
        url: url,
        method: "POST",
        data: { data: {email:email} },
      });
      if(response?.status == 200){
        console.log(response?.data,"htis is response data");
        const data:TSendOtp = response?.data; 
        setAuthorization(data?.message?.Authorization)
        setIsEmailDialog(prev=>!prev);
        setIsOtpDialog(prev=>!prev);
      }
    }
    const handleClose = ()=>{
      setIsEmailDialog(false);
      setIsOtpDialog(false);
      setAuthorization("")
    }
    const outsideClickRef = useOutsideClick<HTMLDivElement>(handleClose)
    return (
      <div className="absolute z-50 flex inset-0 items-center justify-center bg-black bg-opacity-50 text-nowrap">
      <div ref={outsideClickRef} className="bg-white rounded-xl border px-8 py-4 md:max-w-[500px] md:max-h-[150px] h-full w-full gap-6 text-black md:text-md font-light flex flex-col justify-start items-center">
        <h1 className="font-semibold text-center text-[#5291CD] text-[20px]">Enter your registered Email ID to continue</h1>
        <div className='flex gap-4 w-full'>
        <Input
          className="h-full md:max-h-40 text-center"
          placeholder='Enter registered email id...'
             onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={()=>{handleEmailApi()}} className="bg-blue-400 text-white text-sm font-normal border px-4 hover:bg-blue-400 disabled:bg-opacity-50">
            Send OTP
          </Button>
          </div>
        
      </div>
    </div >
  )
}

export default EmailDialog