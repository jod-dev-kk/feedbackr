import { handleGlobalGetRequestQuery } from "@/utils/httpFuntions.ts";
import { API_URLS } from "@repo/common/apiUrls";
import { CACHE_KEYS } from "@repo/common/queryCacheKeys";
import { useQuery } from "@tanstack/react-query";
import { IGetDomainExistResponse } from "./useGetDomainExistService.types.ts";
import { AxiosError } from "axios";

const useGetDomainExistService = () => {
  const getDomainExistService = useQuery<
    IGetDomainExistResponse,
    AxiosError<{
      message: string;
      code: string;
    }>
  >({
    queryKey: [CACHE_KEYS?.GET_DOMAINS_EXIST],
    queryFn: () =>
      handleGlobalGetRequestQuery({ url: API_URLS?.GET_DOMAIN_EXIST }),
  });

  const domains = getDomainExistService?.data?.data?.domains || [];
  const hasDomains = getDomainExistService?.data?.data?.hasDomains;

  return {
    services: { getDomainExistService },
    data: { domains, hasDomains },
  };
};

export default useGetDomainExistService;
