"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { useAuth } from "@/src/context/AuthContext";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import Comment_box from "./CommentBox";
import { useRouter } from "next/navigation";
import AccountsCommentBox from "./AccountsCommentBox";
import API_END_POINTS from "@/src/services/apiEndPoints";

interface Props {
  tabtype: string;
  ref_no: string;
  onboardingRefno: string;
}


const ApprovalButton = ({ tabtype, ref_no, onboardingRefno }: Props) => {
  const [isCommentBox, setIsCommentBox] = useState<boolean>(false);
  const [comments, setComments] = useState<string>("");
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isReject, setIsReject] = useState<boolean>(false);
  const [isAccountBox, setIsAccountBox] = useState<boolean>(false);
  const [reconsiliation, setReconsiliation] = useState<string>("");
  const [reconsiliationDropdown,setReconsiliationDropdown] = useState<{name:string}[]>([]);
  const router = useRouter();
  useEffect(()=>{
    const fetchDropdown = async()=>{
        const reconsiliationUrl = API_END_POINTS?.reconsiliationDropdown;
        const dropDownApi:AxiosResponse = await requestWrapper({url:reconsiliationUrl,method:"GET"});
        if(dropDownApi?.status == 200) {
          console.log(dropDownApi?.data,"this is drodown data")
          setReconsiliationDropdown(dropDownApi?.data?.data)
        }
      }
    fetchDropdown();
  },[])
  const { designation, user_email } = useAuth() as {
    designation: "Purchase Team" | "Accounts Team" | "Purchase Head";
    user_email: string;
  };
  if (!designation) {
    return <div>Loading</div>;
  }



  const approval = async () => {
    const url = {
      "Purchase Team": `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendor_onboarding.approvals.purchase_team_check`,
      "Accounts Team": `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendor_onboarding.approvals.accounts_team_check`,
      "Purchase Head": `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.vendor_onboarding.approvals.purchase_head_check`,
    };
    // const geturl = url[designation];
    const geturl = url[designation];
    const Response: AxiosResponse = await requestWrapper({
      url: geturl,
      method: "POST",
      data: {
        data: {
          onboard_id: onboardingRefno,
          user: user_email,
          approve: isApprove,
          reject: isReject,
          rejected_reason: isReject ? comments : "",
          comments: isApprove ? comments : "",
          reconciliation_account:reconsiliation?reconsiliation:""
        },
      },
    });
    if (Response?.status == 200) {
      if (isApprove && !isReject) {
        alert("Approved Successfully");
      } else {
        alert("Rejected Successfully");
      }
      setIsApprove(false);
      setIsReject(false);
      setComments("");
      setIsCommentBox(false);
      setReconsiliation("");
      router.push("/dashboard");
    }
  };

  const handleClose = () => {
    setIsCommentBox((prev) => !prev);
    setIsApprove(false);
    setIsReject(false);
    setComments("");
  };

  const handleAccountClose = () => {
    setIsAccountBox((prev) => !prev);
    setIsApprove(false);
    setIsReject(false);
    setComments("");
    setReconsiliation("");
  };
  return (
    <>
      <div className="w-full flex justify-end gap-5 px-5 pt-4">
        <Button
          className={`bg-blue-400 hover:bg-blue-400 ${designation != "Accounts Team" && tabtype == "Purchase Detail" ? "" : "hidden"}`}
          onClick={() => {
            setIsCommentBox((prev) => !prev);
            setIsApprove(true);
          }}
        >
          Approve
        </Button>
        <Button
          className={`bg-blue-400 hover:bg-blue-400 ${designation != "Accounts Team" && tabtype == "Purchase Detail" ? "" : "hidden"}`}
          onClick={() => {
            setIsCommentBox((prev) => !prev);
            setIsReject(true);
          }}
        >
          Reject
        </Button>
        <Button
          className={`bg-blue-400 hover:bg-blue-400 ${designation == "Accounts Team" && tabtype == "Purchase Detail" ? "" : "hidden"}`}
          onClick={() => {
            setIsAccountBox((prev) => !prev);
            setIsApprove(true);
          }}
        >
          Approve
        </Button>
        <Button
          className={`bg-blue-400 hover:bg-blue-400 ${designation == "Accounts Team" && tabtype == "Purchase Detail" ? "" : "hidden"}`}
          onClick={() => {
            setIsAccountBox((prev) => !prev);
            setIsReject(true);
          }}
        >
          Reject
        </Button>
      </div>
      {isCommentBox && (
        <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
          <Comment_box
            handleClose={handleClose}
            handleComment={setComments}
            Submitbutton={approval}
          />
        </div>
      )}
      {isAccountBox && (
        <div className="absolute z-50 flex pt-10 items-center justify-center bg-black bg-opacity-50 inset-0">
          <AccountsCommentBox
            handleClose={handleAccountClose}
            handleComment={setComments}
            handleReconsiliation={setReconsiliation}
            Submitbutton={approval}
            dropdown={reconsiliationDropdown}
          />
        </div>
      )}
    </>
  );
};

export default ApprovalButton;
