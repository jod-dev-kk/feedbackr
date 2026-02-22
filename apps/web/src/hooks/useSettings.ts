import { useAuth } from "@/features/auth/hooks.ts";
import { useDomain } from "@/hooks/useDomain.ts";
import { queryClientGlobal } from "@/lib/tanstack-query/client.ts";
import { ApiDomainStatus } from "@/services/getDomainService/useGetDomainService.types.ts";
import { CACHE_KEYS } from "@repo/common/queryCacheKeys";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export const useSettings = () => {
  const { userSession } = useAuth();
  const { domainId } = useParams<{ domainId: string }>();
  const {
    data: { domains },
    handler: { updateDomainStatusHandler },
  } = useDomain();

  const user = userSession.data?.user;
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");

  useEffect(() => {
    if (domainId && domains?.length > 0) {
      const exists = domains.find((d) => d.id === domainId);
      if (exists) setSelectedDomainId(domainId);
    } else if (domains?.length > 0 && !selectedDomainId) {
      setSelectedDomainId(domains[0]?.id || "");
    }
  }, [domainId, domains]);

  const selectedDomain = useMemo(
    () => domains?.find((d) => d?.id === selectedDomainId),
    [domains, selectedDomainId],
  );

  const handleDomainStatusChange = (id: string, checked: boolean) => {
    console.log(id, checked);
    const updatedStatus: ApiDomainStatus = checked ? "ACTIVE" : "INACTIVE";
    updateDomainStatusHandler({
      data: { status: updatedStatus, domainId: id },
      callback: (data) => {
        queryClientGlobal.invalidateQueries({
          queryKey: [CACHE_KEYS?.GET_DOMAINS],
        });
        toast.success(data?.message);
      },
    });
  };

  return {
    data: {
      user,
      domains,
      selectedDomainId,
      selectedDomain,
    },
    functions: {
      setSelectedDomainId,
      handleDomainStatusChange,
    },
  };
};
