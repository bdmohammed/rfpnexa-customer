import { apiClient } from "@/lib/http";
import type { ApiResponse, Tender } from "@/types";
import type {
  TenderDetailsResponse,
  TenderDownloadResponse,
  TenderQuestionInput,
  TenderQueryDto,
  TenderStatistics,
  TenderWatchInput,
} from "../types";

export const tenderApi = {
  /**
   * List and search published active tenders (Public)
   */
  list(query?: TenderQueryDto) {
    return apiClient.get<ApiResponse<Tender[]>>("/tenders", {
      params: query,
    });
  },

  /**
   * Get public tenders statistics (Public)
   */
  getStatistics() {
    return apiClient.get<ApiResponse<TenderStatistics>>("/tenders/statistics");
  },

  /**
   * Get published tender by URL slug (Public)
   */
  getBySlug(slug: string) {
    return apiClient.get<ApiResponse<Tender>>(
      `/tenders/${slug}`,
    );
  },

  /**
   * Get temporary document pre-signed S3 download URL (Authenticated User)
   */
  getDownloadUrl(id: string) {
    return apiClient.get<ApiResponse<TenderDownloadResponse>>(
      `/tenders/${id}/download-url`,
    );
  },

  /**
   * Post question on a tender (Authenticated User)
   */
  postQuestion(id: string, input: TenderQuestionInput) {
    return apiClient.post<ApiResponse<any>>(`/tenders/${id}/questions`, input);
  },

  /**
   * Toggle watch/unwatch tender (Authenticated User)
   */
  toggleWatch(id: string, input?: TenderWatchInput) {
    return apiClient.post<ApiResponse<{ watching: boolean }>>(
      `/tenders/${id}/watch`,
      input || {},
    );
  },
};
