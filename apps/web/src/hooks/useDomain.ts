import useGetDomainService from "@/services/getDomainService/useGetDomainService.ts";
import { IDomainResponse } from "@/services/getDomainService/useGetDomainService.types.ts";
import { handleGlobalPostRequest } from "@/utils/httpFuntions.ts";
import { API_URLS } from "@repo/common/apiUrls";
import { TDomainPayload } from "@repo/common/schemas";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useDomain = () => {
  const navigate = useNavigate();

  const {
    services: { getDomainService },
  } = useGetDomainService();

  const createDomainMutation = useMutation<
    IDomainResponse,
    AxiosError<{
      error: {
        message: string;
        code: string;
      };
    }>,
    TDomainPayload
  >({
    mutationFn: async (data) => {
      return handleGlobalPostRequest<Promise<IDomainResponse>>({
        url: API_URLS.DOMAIN,
        data,
      });
    },
    onError: (err) => {
      const apiError = err?.response?.data?.error.message;
      toast.error(err?.message, {
        description: apiError,
        richColors: true,
      });
    },
    onSuccess: (data) => {
      toast.success(data?.message, {
        richColors: true,
      });

      return navigate(`/dashboard/${data.data.domainId}`);
    },
  });

  const domains = getDomainService.data?.data || [];

  const createDomainHandler = ({
    data,
    callback,
  }: {
    data: TDomainPayload;
    callback?: (data: IDomainResponse) => void;
  }) => {
    createDomainMutation.mutateAsync(data)?.then((data) => callback?.(data));
  };

  return {
    mutations: {
      createDomainMutation,
    },
    handler: {
      createDomainHandler,
    },
    data: {
      domains,
    },
    services: {
      getDomainService,
    },
  };
};
