import React from "react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

interface AlertBoxProps {
    content: string;
    submit: boolean;
    url: string;
}

const AlertBox: React.FC<AlertBoxProps> = ({ content, submit, url }) => {
    return (
        <AlertDialog open={submit}>
            <AlertDialogContent className="w-[410px] text-center p-6 rounded-2xl">
                <AlertDialogHeader>
                    <div className="flex flex-col items-center space-y-2">
                        <CheckCircle2 className="text-green-600 w-10 h-10 mb-2" />
                        <AlertDialogTitle className="text-black text-[16px] text-nowrap font-semibold">{content}</AlertDialogTitle>
                    </div>
                </AlertDialogHeader>
                <AlertDialogDescription></AlertDialogDescription>
                <Link href={url}>
                    <AlertDialogAction className=" bg-[#5291CD] text-white rounded-full  px-4 py-2 text-sm">
                        OK
                    </AlertDialogAction>
                </Link>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertBox;
