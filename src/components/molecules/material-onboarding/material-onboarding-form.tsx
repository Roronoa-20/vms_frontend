import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import RequestorInformation from "@/src/components/molecules/material-onboarding/requestor-information";
import MaterialInformation from "@/src/components/molecules/material-onboarding/material-information";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";

interface MaterialOnboardingFormProps {
    form: UseFormReturn<MaterialRegistrationFormData>;
    onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onUpdate: (e: React.MouseEvent<HTMLButtonElement>) => void;
    UserDetailsJSON: any;
    EmployeeDetailsJSON: any;
    companyName: string;
}

const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = ({
    form,
    onCancel,
    onSubmit,
    onUpdate,
    UserDetailsJSON,
    EmployeeDetailsJSON,
    companyName,
}) => {
    return (
        <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4">
            <div className="space-y-1">
                <RequestorInformation
                    form={form}
                    UserDetails={UserDetailsJSON}
                    EmployeeDetails={EmployeeDetailsJSON}
                    companyInfo={companyName}
                />

                <MaterialInformation />
            </div>

            <div className="flex justify-end space-x-5 items-center">
                <Button variant="backbtn" size="backbtnsize" onClick={onCancel}>
                    Cancel
                </Button>

                {/* Uncomment & fix these if you implement conditional Submit/Update logic */}
                {/* <Button variant="nextbtn" size="nextbtnsize" type="submit">
          Submit
        </Button>

        <Button variant="nextbtn" size="nextbtnsize" type="button" onClick={onUpdate}>
          Update
        </Button> */}
            </div>
        </form>
    );
};

export default MaterialOnboardingForm;



// import React from "react";
// import { UseFormReturn } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import RequestorInformation from "@/src/components/molecules/material-onboarding/requestor-information";
// import MaterialInformation from "@/src/components/molecules/material-onboarding/material-information"


// interface MaterialOnboardingFormProps {
//     form: UseFormReturn<MaterialRegistrationFormData>;
//     onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
//     onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//     onUpdate: (e: React.MouseEvent<HTMLButtonElement>) => void;
//     UserDetailsJSON: any;
//     EmployeeDetailsJSON: any;
//     companyName: any;
// }

// const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = ({
//     form,
//     onCancel,
//     onSubmit,
//     onUpdate,
//     UserDetailsJSON,
//     EmployeeDetailsJSON,
//     companyName,
// }) => {
//     return (
//         <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4">
//             <div className="space-y-1">
//                 <RequestorInformation
//                     form={form}
//                     UserDetails={UserDetailsJSON.data[0]}
//                     EmployeeDetails={EmployeeDetailsJSON.data[0]}
//                     companyInfo={companyName.data[0]}
//                 />

//                 <div>
//                     <MaterialInformation  />
//                 </div>
//             </div>


//             <div className="flex justify-end space-x-5 items-center">
//                 <Button
//                     variant="backbtn"
//                     size="backbtnsize"
//                     onClick={onCancel}
//                 >
//                     Cancel
//                 </Button>

//                 {/* {(MaterialOnboardingDetails?.approval_status === "" ||
//                     MaterialOnboardingDetails?.approval_status === undefined) && (
//                         <Button
//                             variant="nextbtn"
//                             size="nextbtnsize"
//                             type="submit"
//                         >
//                             {isLoading ? "Processing..." : "Submit"}
//                         </Button>
//                     )}

//                 {MaterialOnboardingDetails?.approval_status === "Re-Opened by CP" && (
//                     <Button
//                         variant="nextbtn"
//                         size="nextbtnsize"
//                         type="button"
//                         onClick={onUpdate}
//                     >
//                         {isLoading ? "Processing..." : "Update"}
//                     </Button>
//                 )}

//                 {showAlert && (
//                     <Alertbox
//                         content={"Your Details have been submitted successfully!"}
//                         submit={showAlert}
//                         url="/material-onboarding-table"
//                     />
//                 )} */}
//             </div>
//         </form >
//     );
// };

// export default MaterialOnboardingForm;
