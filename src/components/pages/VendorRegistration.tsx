import React from "react";
import VendorRegistration1 from "../templates/vendorRegistration/VendorRegistrationForm1";
import VendorRegistration2 from "../templates/vendorRegistration/VendorRegistrationForm2";

const VendorRegistration = () => {
  return (
    <div className="p-6">
      <form>
        <VendorRegistration1 />
        <VendorRegistration2 />
      </form>
    </div>
  );
};

export default VendorRegistration;
