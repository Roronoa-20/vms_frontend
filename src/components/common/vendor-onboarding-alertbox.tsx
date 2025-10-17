import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface AlertBoxProps {
    content: string;
    submit: boolean;
    url: string;
}

const AlertBox: React.FC<AlertBoxProps> = ({ content, submit, url }) => {
    return (
        <AlertDialog open={submit}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{content}</AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={""}>
                    <Link href={url}>
                        <AlertDialogAction className="ml-24 bg-[#5291CD] text-[#FFFFFF] text[16px] leading-[19.36px] rounded-[29px] px-7 py-3">
                            OK
                        </AlertDialogAction>
                    </Link>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertBox;
