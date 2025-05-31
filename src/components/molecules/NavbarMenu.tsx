"use client"
import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'


const NavbarMenu = () => {

    const router = useRouter();

    const handleLogOut = async()=>{
        
        const url = API_END_POINTS?.logout
        const reponse:AxiosResponse = await requestWrapper({url:url,method:"POST"})
        if(reponse?.status == 200){
            Cookies.remove("designation");
            Cookies.remove("full_name");
            Cookies.remove("sid");
            Cookies.remove("system_user");
            Cookies.remove("user_id");
            Cookies.remove("user_image");
            router.push("/")
        }

    }
  return (
    <div className='absolute z-40 -left-20 -bottom-44 bg-white text-black border border-black rounded-lg ease-in-out transition-all flex flex-col p-4 gap-5'>
        <h1 className='cursor-pointer'>profile</h1>
        <h1 className='cursor-pointer'>help</h1>
        <h1 className='cursor-pointer' onClick={()=>{handleLogOut()}}>log out</h1>
        </div>
  )
}

export default NavbarMenu