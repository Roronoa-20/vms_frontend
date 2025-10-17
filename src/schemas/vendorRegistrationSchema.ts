import { z } from "zod";

const VendorRegistrationSchemas = z.object({
    mobile_no: z.string().min(3, "Mobile number is required"),
    select_service: z.string().min(2, "Services is Required"),
    division: z.string().min(3, "Division is Required"),
    sr_no: z.string().min(3, "Serial number is required"),
    rfq_cutoff_date: z.string().min(3, "Invalid datetime string! Must be UTC."),
    rfq_date: z.string().min(3, "Invalid date string!"),
    mode_of_shipment: z.string().min(3, "Mode of shipment is required"),
    country: z.string().min(3, "Country is required"),
    destination_port: z.string().min(3, "Destination port is required"),
    port_codez: z.number().nonnegative(),
    port_of_loading: z.string().min(3, "Port of loading is required"),
    inco_terms: z.string().min(3, "Incoterms is required"),
    ship_to_address: z.string().min(3, "Ship to address is required"),
    package_type: z.string().min(3, "Package type is required"),
    no_of_pkg_units: z.string().min(3, "Number of package units is required"),
    product_category: z.string().min(3, "Product category is required"),
    vol_weight: z.string().min(3, "Volumetric weight is required"),
    actual_weight: z.string().min(3, "Actual weight is required"),
    invoice_date: z.string().min(3, "Invoice date is required"),
    invoice_no: z.string().min(3, "Invoice number is required"),
    onsignee_name: z.string().min(3, "Consignee name is required"),
});

export default VendorRegistrationSchemas;
