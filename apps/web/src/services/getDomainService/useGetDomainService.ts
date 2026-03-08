import { handleGlobalGetRequestQuery } from "@/utils/httpFuntions.ts";
import { API_URLS } from "@repo/common/apiUrls";
import { CACHE_KEYS } from "@repo/common/queryCacheKeys";
import { useQuery } from "@tanstack/react-query";
import { IGetDomainsResponse } from "./useGetDomainService.types.ts";
import { AxiosError } from "axios";

const useGetDomainService = () => {
  const getDomainService = useQuery<
    IGetDomainsResponse,
    AxiosError<{
      message: string;
      code: string;
    }>
  >({
    queryKey: [CACHE_KEYS?.GET_DOMAINS],
    queryFn: () => handleGlobalGetRequestQuery({ url: API_URLS?.DOMAIN }),
    // refetchOnMount: "always", // this was fetching feedbacks again aagain
  });

  return {
    services: { getDomainService },
  };
};

export default useGetDomainService;
