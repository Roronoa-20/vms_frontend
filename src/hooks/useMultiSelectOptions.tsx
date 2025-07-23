// hooks/useMultiSelectOptions.ts
import { useEffect, useState } from "react";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";

interface QualityControlSystem {
  name: string;
  quality_control_system: string;
}

interface ProcedureDocument {
  name: string;
  procedure_doc_name: string;
}

interface PriorNotification {
  name: string;
  prior_notification: string;
}

interface inspectionreports {
  name: string;
  inspection_reports: string;
}

interface detailsofbatchrecords {
  name: string;
  batch_record_details: string;
}

interface MultiSelectAPIResponse {
  quality_control_systems: QualityControlSystem[];
  procedure_documents: ProcedureDocument[];
  prior_notifications: PriorNotification[];
  inspection_reports: inspectionreports[];
  batch_record_details: detailsofbatchrecords[]
}

export interface MultiSelectOptions {
  quality_control_system: string[];
  have_documentsprocedure: string[];
  if_yes_for_prior_notification: string[];
  inspection_reports: string[];
  details_of_batch_records: string[],
}

export const useMultiSelectOptions = (vendor_onboarding: string) => {
  const [options, setOptions] = useState<MultiSelectOptions>({
    quality_control_system: [],
    have_documentsprocedure: [],
    if_yes_for_prior_notification: [],
    inspection_reports: [],
    details_of_batch_records: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestWrapper({
          url: API_END_POINTS.qmstablemultiselect,
          method: "GET",
          params: { vendor_onboarding },
        });

        const data: MultiSelectAPIResponse = response.data?.message?.data;

        setOptions({
          quality_control_system: data?.quality_control_systems?.map(opt => opt.name) || [],
          have_documentsprocedure: data?.procedure_documents?.map(opt => opt.name) || [],
          if_yes_for_prior_notification: data?.prior_notifications?.map(opt => opt.name) || [],
          inspection_reports: data?.inspection_reports?.map(opt => opt.name) || [],
          details_of_batch_records: data?.batch_record_details?.map(opt => opt.name) || [],
        });
      } catch (err) {
        console.error("Error fetching multi-select options:", err);
      }
    };

    fetchData();
  }, [vendor_onboarding]);

  return options;
};
