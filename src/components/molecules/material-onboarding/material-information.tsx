import React, { useEffect, useState } from "react";
import UserRequestForm from "./user-request-form";


export default function MaterialInformationForm({
    form, onSubmit, companyName, plantcode, UserDetails, DivisionDetails, role, UnitOfMeasure, MaterialGroup, MaterialType, StorageLocation, MaterialDetails, materialRequestList, setMaterialRequestList, materialCompanyCode, setMaterialCompanyCode, MaterialCategory, EmployeeDetails, AllMaterialCodes, MaterialOnboardingDetails, AllMaterialDetails
}) {

    console.log("Material Information Form Props:", MaterialOnboardingDetails)
    const [selectedMaterialType, setSelectedMaterialType] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [materialSelectedFromList, setMaterialSelectedFromList] = useState(false);
    const [materialCodeAutoFetched, setMaterialCodeAutoFetched] = useState(false);

    const handleMaterialSearch = (e) => {
        const val = e.target.value;
        if (val.trim().length > 3) {
            const filtered = AllMaterialCodes?.filter((item) => item.material_description?.toLowerCase().includes(val.toLowerCase()));
            const mappedResults = filtered?.map((item) => ({
                material_name_description: item.material_description,
                material_code_revised: item.name,
                material_type: item.material_type
            }));
            setSearchResults(mappedResults || []);
            setShowSuggestions(true);
        } else {
            setSearchResults([]);
            setShowSuggestions(false);
        }
        setMaterialSelectedFromList(false);
        setMaterialCodeAutoFetched(false);
    };

    const handleMaterialSelect = (item) => {
        form.setValue("material_name_description", item.material_name_description);
        form.setValue("material_code_revised", item.material_code_revised);
        setMaterialSelectedFromList(true);
        setMaterialCodeAutoFetched(true);
        setShowSuggestions(false);
    };

    const addMaterialRequest = async () => {
        const values = form.getValues();
        const newEntry = {
            material_name_description: values.material_name_description,
            material_code_revised: values.material_code_revised,
            material_company_code: materialCompanyCode,
            plant_name: values.plant_name,
            material_category: values.material_category,
            material_type: values.material_type,
            base_unit_of_measure: values.base_unit_of_measure,
            comment_by_user: values.comment_by_user
        };

        setMaterialRequestList([...materialRequestList, newEntry]);

        form.setValue("material_name_description", "");
        form.setValue("material_code_revised", "");
        form.setValue("plant_name", "");
        form.setValue("material_category", "");
        form.setValue("material_type", "");
        form.setValue("base_unit_of_measure", "");
        form.setValue("comment_by_user", "");
        form.setValue("material_company_code", "");
        setMaterialCompanyCode("");
    };

    return (
        <div className="bg-[#F4F4F6]">
            <div className="flex flex-col justify-between bg-white rounded-[8px]">
                <div className="space-y-2">

                    <UserRequestForm showSuggestions={showSuggestions} materialSelectedFromList={materialSelectedFromList} handleMaterialSearch={handleMaterialSearch} handleMaterialSelect={handleMaterialSelect} addMaterialRequest={addMaterialRequest} form={form} UnitOfMeasure={UnitOfMeasure} plantcode={plantcode} role={role} companyName={companyName} UserDetails={UserDetails} DivisionDetails={DivisionDetails} MaterialType={MaterialType} StorageLocation={StorageLocation} MaterialDetails={MaterialDetails} materialRequestList={materialRequestList} setMaterialRequestList={setMaterialRequestList} searchResults={searchResults} setSearchResults={setSearchResults} setShowSuggestions={setShowSuggestions} setMaterialSelectedFromList={setMaterialSelectedFromList} setSelectedMaterialType={setSelectedMaterialType} materialCompanyCode={materialCompanyCode} setMaterialCompanyCode={setMaterialCompanyCode} MaterialGroup={MaterialGroup} MaterialCategory={MaterialCategory} materialCodeAutoFetched={materialCodeAutoFetched} setMaterialCodeAutoFetched={setMaterialCodeAutoFetched} EmployeeDetails={EmployeeDetails} AllMaterialCodes={AllMaterialCodes} MaterialOnboardingDetails={MaterialOnboardingDetails} AllMaterialDetails={AllMaterialDetails} />
                </div>
            </div>
        </div>
    );
}