import { handleGlobalGetRequestQuery } from "@/utils/httpFuntions.ts";
import { API_URLS } from "@repo/common/apiUrls";
import { CACHE_KEYS } from "@repo/common/queryCacheKeys";
import { useQuery } from "@tanstack/react-query";
import { IFeedbacksResponse } from "./useGetFeedbackService.types.ts";

const useGetFeedbackService = ({ domainId }: { domainId: string }) => {
  const getFeedbackService = useQuery<IFeedbacksResponse>({
    queryKey: [CACHE_KEYS?.GET_FEEDBACKS, domainId],
    queryFn: () =>
      handleGlobalGetRequestQuery({
        url: API_URLS?.FEEDBACK,
        searchParams: { domainId: domainId },
      }),
    // refetchOnMount: "always",    // this was fetching domains on each operations ( click on switch domains. )
    enabled: !!domainId,
  });

  return {
    services: { getFeedbackService },
  };
};

export default useGetFeedbackService;
