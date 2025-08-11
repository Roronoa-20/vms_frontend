
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CircleAlert } from "lucide-react"
type Props ={
  title?:string;
  description?:string;
}
const ErrorComponent = ({title,description}:Props) => {
  
    return (
         <div className="min-h-screen bg-[#EBEBF6] flex items-center justify-center p-4 text-black">
        <Card className="max-w-md w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-8 text-center">
          {/* <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4"> */}
            <CircleAlert className="mx-auto w-12 h-12 text-[#fb1818] mb-4" />
          {/* </div> */}
          <h2 className="text-2xl font-bold mb-2">{title?title:"Already Submitted"}</h2>
          <p className="text-gray-600 mb-6">
            {description?description:"You have already submitted your response for this event. Thank you for your participation!"}
          </p>
          {/* <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-6">
            <p className="text-purple-800 text-sm">
              If you need to make changes to your submission, please contact the event organizer.
            </p>
          </div> */}
          {/* <Button className="bg-[#5291CD] text-white">Contact Organizer</Button> */}
        </CardContent>
      </Card>
    </div>
    );
};

export default ErrorComponent;
