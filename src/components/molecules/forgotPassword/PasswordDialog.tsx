import React from 'react'
import { Input } from '../../atoms/input'
import { Button } from '../../atoms/button'
import { useState } from 'react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import requestWrapper from '@/src/services/apiCall'
import { AxiosResponse } from 'axios'
import { SetStateAction } from 'react'
import { Dispatch } from 'react'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'


interface Props {
    setIsPasswordDialog:Dispatch<SetStateAction<boolean>>;
    email:string,
    authorization:string
}

interface Error {
    confirmPassword?:string
}

const PasswordDialog = ({setIsPasswordDialog,email,authorization}:Props) => {
    const [password,setPassword] = useState<string | "">("")
    const [confirmPassword,setConfirmPassword] = useState<string | "">("")
    const [errors, setErrors] = useState<Error>();
    const handleClose = ()=>{
      setIsPasswordDialog(false);
      setConfirmPassword("")
      setPassword("")
    }
    const outsideClickRef = useOutsideClick<HTMLDivElement>(handleClose)
    const validateAtSubmit = ()=>{
        const errors: Error = {};
        if(!matchPassword()){
            errors.confirmPassword = "Password does not Match";
        }
        return errors
    }

    const matchPassword = ():boolean=>{
        if( confirmPassword.length < 0 ||  password != confirmPassword ){
            return false;
        }else{
            return true;
        }
    }

    const handleEmailApi = async ()=>{

        const validationErrors = validateAtSubmit();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
        console.log("after validation");
        const url = API_END_POINTS?.changePassword;
        const response: AxiosResponse = await requestWrapper({
            url: url,
            method: "POST",
            data: { data: {new_pwd:password,usr:email} },
            headers:{"Authorization":authorization}
          });
          if(response?.status == 200){
            setIsPasswordDialog(prev=>!prev);
          }
    }

  return (
    <div className="absolute z-50 flex inset-0 items-center justify-center bg-black bg-opacity-50 text-nowrap">
      <div ref={outsideClickRef} className="bg-white rounded-xl border px-8 py-4 md:max-w-[600px] md:max-h-[250px] h-full w-full gap-6 text-black md:text-md font-light flex flex-col justify-start items-center">
        <h1 className="font-semibold text-center text-[#5291CD] text-[20px]">Change Password</h1>
        <div className='flex flex-col gap-4 w-full'>
            <div className='grid grid-cols-3 gap-4'>
                <h1 className='pt-1'>Enter new password</h1>
        <Input
          className="h-full md:max-h-40 text-center col-span-2"
          placeholder='Password...'
          type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <h1 className='pt-1'>Confirm password</h1>
          <Input
          className="h-full md:max-h-40 text-center col-span-2"
          placeholder='Password...'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          </div>
          {errors &&
                errors?.confirmPassword &&
                 (
                  <p className="w-full text-red-500 text-[11px] text-center font-normal">
                    {errors?.confirmPassword}
                  </p>
                )}
          <Button onClick={()=>{handleEmailApi()}} className="bg-blue-400 text-white text-sm font-normal border px-4 hover:bg-blue-400 disabled:bg-opacity-50">
            Change Password
          </Button>
          </div>
        
      </div>
    </div >
  )
}

export default PasswordDialog
