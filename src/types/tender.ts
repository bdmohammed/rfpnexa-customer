import { Country } from "@/features/country";
import { Category } from "./category";
import { State } from "./state";

export interface Tender {
  id: string;

  referenceNo: string;
  title: string;

  description: string | null;
  eligibility: string | null;
  workPerformance: string | null;
  proposalSubmission: string | null;

  deadline: string;

  countryId: number;
  country: {
    countryId: string;
    countryName: string;
    countryCode: string;
  };

  stateId: number;
  state: State;

  categoryId: string;
  category: Category;

  createdById: string;

  createdAt: string;
  updatedAt: string;

  documents: TenderDocument[];
}

export interface TenderDocument {
  id: string;
  tenderId: string;

  documentType: string;
  documentS3Key: string;
  documentS3Bucket: string;

  documentOriginalName: string;
  mimeType: string | null;
  fileSize: number | null;

  downloadUrl?: string | null;
}
