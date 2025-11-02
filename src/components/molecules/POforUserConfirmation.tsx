import React from "react";


interface Props {
  poDetails: any;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

const POforUserConfirmation = ({ poDetails, contentRef }: Props) => {
  const VendorInfoList = [
    ["VENDOR GSTIN NO:", poDetails?.vendor_gst_no],
    ["Contact Person :", poDetails?.contact_person],
    ["Phone/Mobile No :", poDetails?.phone_no],
    ["E-mail :", poDetails?.email],
    ["Delivery Terms :", poDetails?.delivery_terms],
    ["Dispatch Mode :", poDetails?.dispatch_mode],
    ["Currency :", poDetails?.currency],
    ["Supplier Quote Ref :", poDetails?.supplier_quote_ref],
  ];

  const rightColumnAddressConst1 = [
    ["P.O. No.", poDetails?.name, "Date", poDetails?.po_date],
    ["Amd. Ver No.", "0", "Date", ""],
    ["Purchase Grp.", poDetails?.purchase_group, "", ""],
    ["Ref. PR No", poDetails?.ref_pr_no, "Ref. PR Date", poDetails?.ref_pr_date],
    ["Ref. PR Person", poDetails?.ref_pr_person, "", ""],
    ["Contact Person", poDetails?.contact_person, "Phone No.", poDetails?.phonemobile_no],
  ];

  const rightColumnAddressConst2 = [
    ["E-mail", poDetails?.email2],
    ["D/L No", poDetails?.dl_no],
    ["GSTIN No.", poDetails?.gstin_no],
    ["SSI Regn No.", ""],
  ];

  const Header = ["Sr No.", "Material Code", "Description", "HSN/SAC", "UOM", "Quantity", "Rate", "Amount", "Sche. Date", "Sche. Qty"];

  const amountLabel = [
    ["Total Gross Amount", poDetails?.total_gross_amount],
    ["Total Discount on Gross Amount", ""],
    ["Total INPUT CGST", poDetails?.total_input_cgst],
    ["Total INPUT SGST", poDetails?.total_input_sgst],
    ["Total Value of Purchase Order / Service Order", poDetails?.total_value_of_po__so,],
  ];

  

  console.log(poDetails, "this is pr details")

  return (
    <div
      ref={contentRef}
      className="bg-white border border-gray-300 rounded-md px-6 py-4 space-y-1 overflow-x-auto"
    >
      <h1 className="text-center font-medium">
        {poDetails?.purchase_order_format}
      </h1>
      {/* Grid with 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black ">
        {/* Left Column */}
        <div className="border-r border-black">
          <div className="flex justify-center border-b border-black py-4">
            {
              poDetails?.company_logo?.base64 &&
              // <img
              // src={`data:image/png;base64,${poDetails && poDetails?.company_logo?poDetails?.company_logo?.base64:""}`}
              // alt="Signature"
              // //  crossOrigin="anonymous"
              // style={{ width: "25%", height: "auto", objectFit: "contain" }}
              // // content="contain"
              // />
              <img
                src={`data:${poDetails?.company_logo?.mime_type};base64,${poDetails?.company_logo?.base64}`}
                alt="Company Logo"
                style={{ width: "25%", height: "auto", objectFit: "contain" }}
              />
            }
          </div>

          {/* Supplier and Address */}
          <div className="grid grid-cols-4 border-b border-black">
            <div className="col-span-2 border-r border-black p-2 font-semibold">
              Supplier
            </div>
            <div className="col-span-2 p-2">
              <span className="font-semibold">Code :</span>{" "}
              {poDetails?.vendor_code}
            </div>
          </div>
          <div className="border-b border-black p-2 leading-4 text-sm">
             <span className="font-semibold">{poDetails?.vendor_address_details?.vendor_name}</span><br/>
            {poDetails?.vendor_address_details?.address_line_1},<br />
            {poDetails?.vendor_address_details?.address_line_2},<br />
            {poDetails?.vendor_address_details?.city} - {poDetails?.vendor_address_details?.zip_code}, {poDetails?.vendor_address_details?.state}, {poDetails?.vendor_address_details?.country}<br />
          </div>

          {/* Vendor Info List */}
          {VendorInfoList?.map((item, idx) => (
            <div className="grid grid-cols-2 border-b border-black" key={idx}>
              <div className="border-r border-black p-2 font-semibold">
                {item[0]}
              </div>
              <div className="p-2">{item[1]}</div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div>
          <div className="border-b border-black p-2">
            <div className="font-semibold">
              Bill To : {poDetails?.bill_to_company_details?.company_name}
            </div>
            <div>{poDetails?.bill_to_company_details?.street_1}</div>
            <div>{poDetails?.bill_to_company_details?.street_2}</div>
            {/* <div>Muktanand Marg, Chala,</div> */}
            <div>{poDetails?.bill_to_company_details?.city} - {poDetails?.bill_to_company_details?.pincode} ({poDetails?.bill_to_company_details?.state_full})</div>
            <div>Phone No: {poDetails?.bill_to_company_details?.contact_no}</div>
          </div>

          {rightColumnAddressConst1?.map((row, idx) => (
            <div className="grid grid-cols-4 border-b border-black" key={idx}>
              <div className="border-r border-black p-2 font-semibold">
                {row[0]}
              </div>
              <div className="border-r border-black p-2">{row[1]}</div>
              <div className="border-r border-black p-2 font-semibold">
                {row[2]}
              </div>
              <div className="p-2">{row[3]}</div>
            </div>
          ))}

          {rightColumnAddressConst2.map((item, idx) => (
            <div className="grid grid-cols-4 border-b border-black" key={idx}>
              <div className="border-r border-black p-2 font-semibold">
                {item[0]}
              </div>
              <div className="col-span-3 p-2">{item[1]}</div>
            </div>
          ))}

          {/* Ship To */}
          <div className="border-t border-black p-2">
            <div className="font-semibold">
              Ship To : {poDetails?.ship_to_company_details?.company_name}
            </div>
            <div>{poDetails?.ship_to_company_details?.street_1}</div>
            <div>{poDetails?.ship_to_company_details?.street_2}</div>
            {/* <div>Muktanand Marg, Chala,</div> */}
            <div>{poDetails?.ship_to_company_details?.city} - {poDetails?.ship_to_company_details?.pincode} ({poDetails?.ship_to_company_details?.state_full})</div>
            <div>Phone No: {poDetails?.ship_to_company_details?.contact_no}</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-black">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-200 text-center font-semibold">
            <tr>
              {Header?.map((header, idx) => (
                <th key={idx} className="border border-black px-2 py-1">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {poDetails?.po_items?.map((item: any, index: any) => (
              <tr key={index} className={index % 2 ? "bg-gray-50" : ""}>
                <td className="border border-black px-2 py-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-black px-2 py-1">
                  {item?.material_code}
                </td>
                <td className="border border-black px-2 py-1">
                  {item?.description}
                </td>
                <td className="border border-black px-2 py-1">
                  {item?.hsnsac}
                </td>
                <td className="border border-black px-2 py-1">{item?.uom}</td>
                <td className="border border-black px-2 py-1">
                  {item?.quantity}
                </td>
                <td className="border border-black px-2 py-1">{item?.rate}</td>
                <td className="border border-black px-2 py-1">
                  {item?.base_amount}
                </td>
                <td className="border border-black px-2 py-1">
                  {item?.schedule_date}
                </td>
                <td className="border border-black px-2 py-1">
                  {item?.quantity}
                </td>
              </tr>
            ))}

            {amountLabel?.map(([label, value], idx) => (
              <tr key={idx} className={idx % 2 ? "bg-gray-50" : ""}>
                <td
                  colSpan={7}
                  className="text-right px-4 py-2 border border-black font-medium"
                >
                  {label}:
                </td>
                <td className="text-right px-4 py-2 border border-black">
                  ₹{value}
                </td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border border-black bg-white text-left text-xs font-semibold p-2">
        Totals Value in Words :{" "}
        <span className="font-normal">{poDetails?.total_value_in_words}</span>
      </div>

      {/* Terms and Footer */}
      <div className="border border-black p-4 text-sm space-y-2">
        <p className="font-semibold underline">Terms & Conditions</p>
        <p className="font-semibold">
          Terms of Payment:{poDetails?.terms_of_payment}
        </p>
        <p>100% within 30 Days from the Date of Invoice</p>
        <p className="font-semibold">
          Delivery Schedule:{poDetails?.delivery_schedule}
        </p>
        <p className="font-semibold py-2">Shipping Instructions:</p>
        <p className="font-semibold">Pre Shipment Documentation:</p>
        <p className="">The following is required defore of material.</p>
        <ol className="list-decimal list-inside">
          <li>Commercial Invoice</li>
          <li>Packing List</li>
          <li>Certificate of Analysis (COA)</li>
          <li>Material Safety Data Sheet (MSDS)</li>
          <li>Test Certificate</li>
        </ol>
      </div>

      <div className="border border-black bg-white text-left text-xs font-semibold p-2">
        PLEASE ACKNOWLEDGE THIS PURCHASE ORDER AND ADHERE TO IN ACCORDANCE WITH
        INSTRUCTION MENTIONED IN P.O. AND CONDITION OVERLEAF/AS AGREED, IF ANY.
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 border border-black text-xs">
        <div className="p-2 border-r border-black">
          "Invoice should reflect in our GSTR2B and no credit should be disallow
          to us against your default of any reason, otherwise we will raised the
          debit note without any intimation."
          <div className="border-t border-black mt-2 pt-1 font-semibold">
            Remark:
          </div>
        </div>
        <div className="p-0">
          <div className="border-b border-black text-center p-1 bg-gray-50">
            For Meril Endo Surgery Private Limited
          </div>
          <div className="grid grid-cols-3 text-center border-b border-black">
            <div className="border-r border-black h-20 flex items-center justify-center relative">
              {
                poDetails?.sign_url1?.base64 &&
                <img
                  src={`data:image/png;base64,${poDetails && poDetails?.sign_url1 ? poDetails?.sign_url1?.base64 : ""}`}
                  alt="Signature"
                  //  crossOrigin="anonymous"
                  style={{ width: "50%", height: "auto", objectFit: "contain" }}
                // content="contain"
                />
              }
            </div>
            <div className="border-r border-black h-20 flex items-center justify-center">
              {
                poDetails?.sign_url2?.base64 &&
                <img
                  src={`data:image/png;base64,${poDetails && poDetails?.sign_url2 ? poDetails?.sign_url2?.base64 : ""}`}
                  alt="Signature"
                  //  crossOrigin="anonymous"
                  style={{ width: "50%", height: "auto", objectFit: "contain" }}
                // content="contain"
                />
              }
            </div>
            <div className="h-20 flex items-center justify-center">
              {
                poDetails?.sign_url3?.base64 &&
                <img
                  src={`data:image/png;base64,${poDetails && poDetails?.sign_url3 ? poDetails?.sign_url3?.base64 : ""}`}
                  alt="Signature"
                  //  crossOrigin="anonymous"
                  style={{ width: "50%", height: "auto", objectFit: "contain" }}
                // content="contain"
                />
              }
            </div>
          </div>
          <div className="grid grid-cols-3 text-center text-[11px]">
            <div className="border-r border-black p-1">Purchase Team</div>
            <div className="border-r border-black p-1">Purchase Manager</div>
            <div className="p-1">Head of Group Purchase</div>
          </div>
        </div>
      </div>

      <div className="border border-black text-center text-[10px] p-2 font-semibold">
        Regd. office: BILAKHIA HOUSE, SURVEY NO 135/139, MUKTANAND MARG, CHALA,
        Vapi - 396191 (24-Gujarat), India, Phone No: 0260-3052100
      </div>

      <div className="text-[10px] py-2 text-right">
        FMT/MM/PUR/003.Issue No.03.Rev.NO.01
      </div>
    </div>
  );
};

export default POforUserConfirmation;
