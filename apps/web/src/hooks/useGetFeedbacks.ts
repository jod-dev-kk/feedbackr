import useGetFeedbackService from "@/services/getFeedbackService/useGetFeedbackService.ts";
import { TFeedbackStatus } from "@/services/getFeedbackService/useGetFeedbackService.types.ts";
import { useParams } from "react-router";

const useGetFeedbacks = () => {
  const { domainId } = useParams();
  const {
    services: { getFeedbackService },
  } = useGetFeedbackService({ domainId: domainId ?? "" });

  const feedbackDataArray = getFeedbackService?.data?.data || [];

  const initialMetrics: Record<TFeedbackStatus, number> & { TOTAL: number } = {
    PENDING: 0,
    RESOLVED: 0,
    REJECTED: 0,
    INVALID: 0,
    TOTAL: 0,
    NIL: 0,
  };

  const feedbackMetricData = feedbackDataArray?.reduce((acc, curr) => {
    const status = curr?.status;

    if (status && status in acc) {
      acc[status as TFeedbackStatus] += 1;
      acc.TOTAL += 1;
    }
    return acc;
  }, initialMetrics);

  return {
    services: { getFeedbackService },
    data: { feedbackDataArray, feedbackMetricData },
  };
};

export default useGetFeedbacks;
